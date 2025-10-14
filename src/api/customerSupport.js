import api from './api';

export const getAllSupportMessages = async () => {
    try {
        const response = await api.get('/chat/support/all-messages');
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération de tous les messages:', error);
        throw error;
    }
};

export const sendSupportMessage = async (messageData) => {
    try {
        const response = await api.post('/chat/support/send-message', messageData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        throw error;
    }
};

export const markMessagesAsRead = async (sessionId) => {
    try {
        const response = await api.put(`/chat/support/mark-session-read/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw error;
    }
};