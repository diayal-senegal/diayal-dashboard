import React, { useState, useEffect } from 'react';
import { FaComments, FaUser, FaEnvelope, FaClock, FaReply, FaPaperPlane, FaEye } from 'react-icons/fa';
import { getAllSupportMessages, sendSupportMessage, markMessagesAsRead } from '../../api/customerSupport';
import { useMarkNotificationsRead } from '../../hooks/useMarkNotificationsRead';

const CustomerSupport = () => {
    const [messages, setMessages] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessionMessages, setSessionMessages] = useState([]);
    const [replyMessage, setReplyMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Marquer les notifications comme lues
    useMarkNotificationsRead('support');

    // Grouper les messages par session
    const groupMessagesBySession = (messages) => {
        const sessions = {};
        messages.forEach(msg => {
            if (!sessions[msg.sessionId]) {
                sessions[msg.sessionId] = {
                    sessionId: msg.sessionId,
                    senderName: msg.senderName,
                    senderEmail: msg.senderEmail,
                    lastMessage: msg.message,
                    lastMessageTime: msg.createdAt,
                    unreadCount: msg.status === 'unseen' ? 1 : 0,
                    messages: [msg]
                };
            } else {
                sessions[msg.sessionId].messages.push(msg);
                if (new Date(msg.createdAt) > new Date(sessions[msg.sessionId].lastMessageTime)) {
                    sessions[msg.sessionId].lastMessage = msg.message;
                    sessions[msg.sessionId].lastMessageTime = msg.createdAt;
                }
                if (msg.status === 'unseen') {
                    sessions[msg.sessionId].unreadCount++;
                }
            }
        });
        return Object.values(sessions).sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    };

    // Charger tous les messages
    const loadAllMessages = async () => {
        setLoading(true);
        try {
            console.log('📄 Admin: Chargement des messages...');
            const data = await getAllSupportMessages();
            console.log('📥 Admin: Réponse reçue:', data);
            
            if (data.success) {
                setMessages(data.messages);
                console.log(`✅ Admin: ${data.messages.length} messages chargés`);
            }
        } catch (error) {
            console.error('❌ Admin: Erreur lors du chargement des messages:', error);
        }
        setLoading(false);
    };

    // Envoyer une réponse
    const sendReply = async () => {
        if (!replyMessage.trim() || !selectedSession) return;

        try {
            const messageData = {
                senderName: 'Support Diayal',
                senderEmail: 'support@diayal.sn',
                message: replyMessage,
                sessionId: selectedSession.sessionId,
                isFromAdmin: true
            };

            const data = await sendSupportMessage(messageData);
            if (data.success) {
                setSessionMessages(prev => [...prev, data.data]);
                setReplyMessage('');
                loadAllMessages(); // Recharger pour mettre à jour la liste
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la réponse:', error);
        }
    };

    useEffect(() => {
        loadAllMessages();
    }, []);

    useEffect(() => {
        if (selectedSession) {
            setSessionMessages(selectedSession.messages);
            // Marquer les messages comme lus
            markMessagesAsRead(selectedSession.sessionId).catch(console.error);
        }
    }, [selectedSession]);

    const sessions = groupMessagesBySession(messages);

    return (
        <div className="px-2 lg:px-7 pt-5">
            <div className="w-full p-4 bg-[#6a5fdf] rounded-md">
                <div className="flex justify-between items-center">
                    <h1 className="text-[#d0d2d6] text-xl font-semibold">Support Client</h1>
                    <div className="flex items-center gap-2 text-[#d0d2d6]">
                        <FaComments />
                        <span>{sessions.length} conversations</span>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-wrap mt-4">
                <div className="w-full">
                    <div className="w-full p-4 bg-[#6a5fdf] rounded-md text-[#d0d2d6]">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Messages de Support</h2>
                            <button 
                                onClick={loadAllMessages}
                                className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                            >
                                Actualiser
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex mt-4 gap-4">
                {/* Liste des conversations */}
                <div className="w-1/3 bg-white rounded-md shadow-sm">
                    <div className="p-4 border-b">
                        <h3 className="font-semibold text-gray-800">Conversations ({sessions.length})</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Chargement...</div>
                        ) : sessions.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">Aucun message</div>
                        ) : (
                            sessions.map((session) => (
                                <div
                                    key={session.sessionId}
                                    onClick={() => setSelectedSession(session)}
                                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                                        selectedSession?.sessionId === session.sessionId ? 'bg-blue-50 border-blue-200' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {session.senderName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-gray-800 truncate">{session.senderName}</h4>
                                                {session.unreadCount > 0 && (
                                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                        {session.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">{session.senderEmail}</p>
                                            <p className="text-sm text-gray-500 truncate mt-1">{session.lastMessage}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(session.lastMessageTime).toLocaleString('fr-FR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Zone de conversation */}
                <div className="w-2/3 bg-white rounded-md shadow-sm">
                    {selectedSession ? (
                        <>
                            {/* En-tête de conversation */}
                            <div className="p-4 border-b bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {selectedSession.senderName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{selectedSession.senderName}</h3>
                                        <p className="text-sm text-gray-600">{selectedSession.senderEmail}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="p-4 h-80 overflow-y-auto">
                                {sessionMessages.map((msg, index) => (
                                    <div key={msg._id || index} className={`mb-4 ${msg.isFromAdmin ? 'text-right' : 'text-left'}`}>
                                        <div className={`inline-block p-3 rounded-lg max-w-xs ${
                                            msg.isFromAdmin 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            <p className="text-sm">{msg.message}</p>
                                            <span className="text-xs opacity-70 block mt-1">
                                                {new Date(msg.createdAt).toLocaleString('fr-FR')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Zone de réponse */}
                            <div className="p-4 border-t">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Tapez votre réponse..."
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendReply()}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={sendReply}
                                        disabled={!replyMessage.trim()}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <FaPaperPlane />
                                        Envoyer
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <FaComments className="text-4xl mx-auto mb-4 text-gray-300" />
                            <p>Sélectionnez une conversation pour commencer</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerSupport;