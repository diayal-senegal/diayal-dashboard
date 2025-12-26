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
            support: 0,
            sellerRequest: 0,
            paymentRequest: 0,
            sellerSupport: 0,
            bannerValidation: 0
        }
    }
}

// Marquer les notifications comme lues pour un type donné
export const markNotificationsAsRead = async (type) => {
    try {
        const response = await api.post('/notifications/mark-read', { type })
        return response.data
    } catch (error) {
        console.error('Erreur lors du marquage des notifications:', error)
        return { success: false }
    }
}