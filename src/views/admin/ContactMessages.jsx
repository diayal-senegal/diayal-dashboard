import React, { useState, useEffect } from 'react'
import { FaEnvelope, FaUser, FaClock, FaEye, FaEnvelopeOpen } from 'react-icons/fa'
import { getContacts, markContactAsRead } from '../../api/contacts'

const ContactMessages = () => {
    const [contacts, setContacts] = useState([])
    const [selectedContact, setSelectedContact] = useState(null)
    const [loading, setLoading] = useState(false)

    // Charger tous les messages de contact
    const loadContacts = async () => {
        setLoading(true)
        try {
            const data = await getContacts()
            if (data.success) {
                setContacts(data.contacts)
            }
        } catch (error) {
            console.error('Erreur lors du chargement des contacts:', error)
        }
        setLoading(false)
    }

    // Marquer un message comme lu
    const handleMarkAsRead = async (contactId) => {
        try {
            await markContactAsRead(contactId)
            setContacts(prev => 
                prev.map(contact => 
                    contact._id === contactId 
                        ? { ...contact, status: 'read' }
                        : contact
                )
            )
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error)
        }
    }

    useEffect(() => {
        loadContacts()
    }, [])

    const newMessagesCount = contacts.filter(c => c.status === 'new').length

    return (
        <div className="px-2 lg:px-7 pt-5">
            {/* En-tête */}
            <div className="w-full p-4 bg-[#6a5fdf] rounded-md">
                <div className="flex justify-between items-center">
                    <h1 className="text-[#d0d2d6] text-xl font-semibold">Messages de Contact</h1>
                    <div className="flex items-center gap-4 text-[#d0d2d6]">
                        <div className="flex items-center gap-2">
                            <FaEnvelope />
                            <span>{contacts.length} messages</span>
                        </div>
                        {newMessagesCount > 0 && (
                            <div className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full">
                                <span className="text-sm font-semibold">{newMessagesCount} nouveaux</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full flex mt-4 gap-4">
                {/* Liste des messages */}
                <div className="w-1/2 bg-white rounded-md shadow-sm">
                    <div className="p-4 border-b bg-gray-50">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">Messages ({contacts.length})</h3>
                            <button 
                                onClick={loadContacts}
                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                            >
                                Actualiser
                            </button>
                        </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Chargement...</div>
                        ) : contacts.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">Aucun message</div>
                        ) : (
                            contacts.map((contact) => (
                                <div
                                    key={contact._id}
                                    onClick={() => setSelectedContact(contact)}
                                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                                        selectedContact?._id === contact._id ? 'bg-blue-50 border-blue-200' : ''
                                    } ${contact.status === 'new' ? 'bg-yellow-50' : ''}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {contact.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-gray-800 truncate">{contact.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    {contact.status === 'new' && (
                                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                    )}
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">{contact.email}</p>
                                            <p className="text-sm font-medium text-gray-700 truncate mt-1">{contact.subject}</p>
                                            <p className="text-sm text-gray-500 truncate mt-1">{contact.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Détails du message sélectionné */}
                <div className="w-1/2 bg-white rounded-md shadow-sm">
                    {selectedContact ? (
                        <>
                            {/* En-tête du message */}
                            <div className="p-4 border-b bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                            {selectedContact.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{selectedContact.name}</h3>
                                            <p className="text-sm text-gray-600">{selectedContact.email}</p>
                                        </div>
                                    </div>
                                    {selectedContact.status === 'new' && (
                                        <button
                                            onClick={() => handleMarkAsRead(selectedContact._id)}
                                            className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                                        >
                                            <FaEye />
                                            Marquer comme lu
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Contenu du message */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">Sujet:</h4>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedContact.subject}</p>
                                </div>
                                
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">Message:</h4>
                                    <div className="text-gray-700 bg-gray-50 p-4 rounded whitespace-pre-wrap">
                                        {selectedContact.message}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-500 border-t pt-4">
                                    <div className="flex items-center gap-2">
                                        <FaClock />
                                        <span>Reçu le {new Date(selectedContact.createdAt).toLocaleString('fr-FR')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {selectedContact.status === 'new' ? (
                                            <>
                                                <FaEnvelope className="text-red-500" />
                                                <span className="text-red-500 font-medium">Non lu</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaEnvelopeOpen className="text-green-500" />
                                                <span className="text-green-500 font-medium">Lu</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <FaEnvelope className="text-4xl mx-auto mb-4 text-gray-300" />
                            <p>Sélectionnez un message pour voir les détails</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ContactMessages