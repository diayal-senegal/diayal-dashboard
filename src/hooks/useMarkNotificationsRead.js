import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { markNotificationsAsRead } from '../api/notifications';
import { useNotifications } from './useNotifications';

export const useMarkNotificationsRead = (notificationType) => {
    const { refreshNotifications } = useNotifications();
    const location = useLocation();

    useEffect(() => {
        if (!notificationType) return;

        const markAsRead = async () => {
            try {
                await markNotificationsAsRead(notificationType);
                refreshNotifications();
            } catch (error) {
                console.error('Erreur lors du marquage des notifications:', error);
            }
        };
        
        // Marquer comme lu dès l'accès à la page, même sans paramètres
        markAsRead();
    }, [notificationType, refreshNotifications, location.pathname]);
};