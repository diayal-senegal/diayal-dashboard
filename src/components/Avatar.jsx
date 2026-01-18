import React, { useState } from 'react';
import { getInitials, getAvatarColor } from '../utils/avatarUtils';

const Avatar = ({ 
    type = 'user', // 'admin', 'seller', 'customer', 'user'
    image, 
    name, 
    size = 'md', // 'sm', 'md', 'lg'
    className = '',
    showOnline = false,
    borderColor = 'white'
}) => {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
        sm: 'w-[38px] h-[38px]',
        md: 'w-[45px] h-[45px]',
        lg: 'w-[50px] h-[50px]'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    // Si c'est l'admin, afficher le logo
    if (type === 'admin') {
        return (
            <div className={`relative ${className}`}>
                <img 
                    className={`${sizeClasses[size]} border-${borderColor} border-2 max-w-[${sizeClasses[size].split(' ')[0].slice(2)}] p-[2px] rounded-full bg-white`}
                    src="/images/logo.svg"
                    alt="Admin"
                />
                {showOnline && (
                    <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0 border-2 border-white'></div>
                )}
            </div>
        );
    }

    // Si l'image existe et n'a pas d'erreur, l'afficher
    if (image && !imageError) {
        return (
            <div className={`relative ${className}`}>
                <img 
                    className={`${sizeClasses[size]} border-${borderColor} border-2 max-w-[${sizeClasses[size].split(' ')[0].slice(2)}] p-[2px] rounded-full`}
                    src={image}
                    alt={name || 'User'}
                    onError={() => setImageError(true)}
                />
                {showOnline && (
                    <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0 border-2 border-white'></div>
                )}
            </div>
        );
    }

    // Sinon, afficher les initiales
    const initials = getInitials(name);
    const bgColor = getAvatarColor(name);

    return (
        <div className={`relative ${className}`}>
            <div 
                className={`${sizeClasses[size]} border-${borderColor} border-2 rounded-full flex items-center justify-center font-bold text-white ${textSizeClasses[size]}`}
                style={{ backgroundColor: bgColor }}
            >
                {initials}
            </div>
            {showOnline && (
                <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0 border-2 border-white'></div>
            )}
        </div>
    );
};

export default Avatar;
