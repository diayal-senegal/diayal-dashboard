import api from './api'

// Récupérer les compteurs de notifications
export const getNotificationCounts = async () => {
    try {
        const response = await api.get('/notifications/counts')
        return response.data
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error)
        return {
            newsletter: 0,
            vendorTeaser: 0,
            contact: 0,
            support: 0
        }
    }
}