import api from './api'

// Récupérer tous les messages de contact
export const getContacts = async () => {
    try {
        const response = await api.get('/contacts')
        return response.data
    } catch (error) {
        console.error('Erreur lors de la récupération des contacts:', error)
        throw error
    }
}

// Marquer un message comme lu
export const markContactAsRead = async (contactId) => {
    try {
        const response = await api.put(`/contact/${contactId}/read`)
        return response.data
    } catch (error) {
        console.error('Erreur lors de la mise à jour du contact:', error)
        throw error
    }
}