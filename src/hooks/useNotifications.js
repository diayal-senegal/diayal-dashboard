import { useState, useEffect } from 'react'
import { getNotificationCounts } from '../api/notifications'

export const useNotifications = () => {
    const [notifications, setNotifications] = useState({
        newsletter: 0,
        vendorTeaser: 0,
        contact: 0,
        support: 0,
        sellerRequest: 0,
        paymentRequest: 0,
        sellerSupport: 0,
        bannerValidation: 0
    })
    const [loading, setLoading] = useState(false)

    const fetchNotifications = async () => {
        setLoading(true)
        try {
            const data = await getNotificationCounts()
            if (data.success) {
                setNotifications(data.counts)
            }
        } catch (error) {
            console.error('Erreur chargement notifications:', error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchNotifications()
        
        // Actualiser toutes les 30 secondes
        const interval = setInterval(fetchNotifications, 30000)
        
        return () => clearInterval(interval)
    }, [])

    return {
        notifications,
        loading,
        refreshNotifications: fetchNotifications
    }
}