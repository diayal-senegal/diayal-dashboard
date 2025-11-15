import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_notifications, mark_notification_read } from '../../store/Reducers/sellerReducer';
import { FaBell, FaCheck, FaTimes } from 'react-icons/fa';

const Notifications = () => {
    const dispatch = useDispatch();
    const { notifications } = useSelector(state => state.seller);

    useEffect(() => {
        dispatch(get_seller_notifications());
    }, [dispatch]);

    const handleMarkAsRead = (notificationId) => {
        dispatch(mark_notification_read(notificationId));
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'banner_approved':
                return <FaCheck className="text-green-500" />;
            case 'banner_rejected':
                return <FaTimes className="text-red-500" />;
            default:
                return <FaBell className="text-blue-500" />;
        }
    };

    const getNotificationBg = (type, status) => {
        const baseClasses = "p-4 rounded-lg border-l-4 ";
        const unreadClasses = status === 'unread' ? 'bg-blue-50 ' : 'bg-gray-50 ';
        
        switch (type) {
            case 'banner_approved':
                return baseClasses + unreadClasses + 'border-green-500';
            case 'banner_rejected':
                return baseClasses + unreadClasses + 'border-red-500';
            default:
                return baseClasses + unreadClasses + 'border-blue-500';
        }
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='flex justify-between items-center mb-5'>
                <h1 className='text-[#000000] font-semibold text-lg'>Notifications</h1>
                <div className='flex items-center gap-2'>
                    <FaBell className='text-gray-600' />
                    <span className='text-sm text-gray-600'>
                        {notifications.filter(n => n.status === 'unread').length} non lues
                    </span>
                </div>
            </div>

            <div className='space-y-4'>
                {notifications.length === 0 ? (
                    <div className='text-center py-8'>
                        <FaBell className='mx-auto text-4xl text-gray-400 mb-4' />
                        <p className='text-gray-500'>Aucune notification</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={getNotificationBg(notification.type, notification.status)}
                        >
                            <div className='flex items-start justify-between'>
                                <div className='flex items-start gap-3'>
                                    <div className='mt-1'>
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className='flex-1'>
                                        <h3 className='font-semibold text-gray-800 mb-1'>
                                            {notification.title}
                                        </h3>
                                        <p className='text-gray-600 text-sm mb-2'>
                                            {notification.message}
                                        </p>
                                        <p className='text-xs text-gray-500'>
                                            {new Date(notification.createdAt).toLocaleString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                                
                                {notification.status === 'unread' && (
                                    <button
                                        onClick={() => handleMarkAsRead(notification._id)}
                                        className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                                    >
                                        Marquer comme lu
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;