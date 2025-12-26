import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { mark_notification_read } from '../store/Reducers/sellerReducer';
import { FaBell, FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SellerNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        const loadNotifications = () => {
            const stored = JSON.parse(localStorage.getItem('sellerNotifications') || '[]');
            setNotifications(stored.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
            setUnreadCount(stored.filter(n => !n.read).length);
        };

        loadNotifications();

        const handleNewNotification = (e) => {
            loadNotifications();
            const { type } = e.detail;
            if (type === 'approved') {
                toast.success('🎉 Votre bannière a été approuvée !');
            } else if (type === 'rejected') {
                toast.error('❌ Votre bannière a été rejetée');
            }
        };

        window.addEventListener('sellerNotification', handleNewNotification);
        const interval = setInterval(loadNotifications, 2000);

        return () => {
            window.removeEventListener('sellerNotification', handleNewNotification);
            clearInterval(interval);
        };
    }, []);

    const markAsRead = (notificationId) => {
        const updated = notifications.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
        );
        localStorage.setItem('sellerNotifications', JSON.stringify(updated));
        setNotifications(updated);
        setUnreadCount(updated.filter(n => !n.read).length);
        
        // Synchroniser avec Redux
        dispatch(mark_notification_read(notificationId));
    };

    const clearAll = () => {
        localStorage.setItem('sellerNotifications', JSON.stringify([]));
        setNotifications([]);
        setUnreadCount(0);
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-white hover:bg-gray-700 rounded-full transition-colors"
            >
                <FaBell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-3 border-b flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        {notifications.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="text-sm text-red-500 hover:text-red-700"
                            >
                                Tout effacer
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                Aucune notification
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                                        !notification.read ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-start gap-2">
                                        <div className="flex-shrink-0 mt-1">
                                            {notification.type === 'banner_approved' ? (
                                                <FaCheck className="text-green-500" />
                                            ) : (
                                                <FaTimes className="text-red-500" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800 text-sm">
                                                {notification.title}
                                            </h4>
                                            <p className="text-gray-600 text-xs mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                {notification.timestamp}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerNotifications;