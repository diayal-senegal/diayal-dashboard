import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';

const PublishedBanners = () => {
    const [publishedBanners, setPublishedBanners] = useState([]);

    useEffect(() => {
        const loadBanners = () => {
            const stored = JSON.parse(localStorage.getItem('publishedBanners') || '[]');
            setPublishedBanners(stored.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)));
        };

        loadBanners();

        const handleBannerApproved = () => {
            loadBanners();
        };

        window.addEventListener('bannerApproved', handleBannerApproved);
        const interval = setInterval(loadBanners, 3000);

        return () => {
            window.removeEventListener('bannerApproved', handleBannerApproved);
            clearInterval(interval);
        };
    }, []);

    const removeBanner = (bannerId) => {
        const updated = publishedBanners.filter(banner => banner._id !== bannerId);
        localStorage.setItem('publishedBanners', JSON.stringify(updated));
        setPublishedBanners(updated);
    };

    if (publishedBanners.length === 0) {
        return (
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <h2 className='text-white font-semibold mb-4'>Bannières Publiées</h2>
                <p className='text-gray-300 text-center py-8'>Aucune bannière publiée pour le moment</p>
            </div>
        );
    }

    return (
        <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-white font-semibold'>Bannières Publiées</h2>
                <span className='bg-green-500 text-white px-3 py-1 rounded-full text-sm'>
                    {publishedBanners.length} active{publishedBanners.length > 1 ? 's' : ''}
                </span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {publishedBanners.slice(0, 6).map((banner) => (
                    <div key={banner._id} className='bg-white rounded-lg overflow-hidden shadow-md'>
                        <img 
                            src={banner.image} 
                            alt="Bannière" 
                            className='w-full h-32 object-cover'
                        />
                        <div className='p-3'>
                            <div className='flex justify-between items-start mb-2'>
                                <div>
                                    <h4 className='font-medium text-gray-800 text-sm'>{banner.sellerName}</h4>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        banner.bannerType === 'vip' ? 'bg-purple-100 text-purple-800' :
                                        banner.bannerType === 'premium' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {banner.bannerType.toUpperCase()}
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeBanner(banner._id)}
                                    className='text-red-500 hover:text-red-700 p-1'
                                    title='Retirer'
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                            <p className='text-xs text-gray-500'>
                                Publié le {banner.publishedAt}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {publishedBanners.length > 6 && (
                <div className='text-center mt-4'>
                    <p className='text-gray-300 text-sm'>
                        Et {publishedBanners.length - 6} autre{publishedBanners.length - 6 > 1 ? 's' : ''} bannière{publishedBanners.length - 6 > 1 ? 's' : ''}...
                    </p>
                </div>
            )}
        </div>
    );
};

export default PublishedBanners;