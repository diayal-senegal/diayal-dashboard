import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import api from '../../api/api';
import toast from 'react-hot-toast';

const PublishedBanners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadPublishedBanners();
    }, []);

    const loadPublishedBanners = async () => {
        try {
            setLoading(true);
            const response = await api.get('/banners/published');
            
            if (response.data.success) {
                setBanners(response.data.banners);
                toast.success(`${response.data.banners.length} bannière(s) publiée(s) chargée(s)`);
            }
        } catch (error) {
            console.error('Erreur chargement bannières:', error);
            toast.error('Erreur lors du chargement des bannières');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (bannerId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) {
            return;
        }

        try {
            await api.delete(`/banners/${bannerId}`);
            setBanners(prev => prev.filter(b => b.id !== bannerId));
            toast.success('Bannière supprimée avec succès');
        } catch (error) {
            console.error('Erreur suppression:', error);
            toast.error('Erreur lors de la suppression');
        }
    };

    const getBannerTypeColor = (type) => {
        switch (type) {
            case 'gratuit': return 'bg-green-100 text-green-800';
            case 'premium': return 'bg-blue-100 text-blue-800';
            case 'vip': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getBannerTypeName = (type) => {
        switch (type) {
            case 'gratuit': return 'Gratuite';
            case 'premium': return 'Premium';
            case 'vip': return 'VIP';
            default: return type;
        }
    };

    if (loading) {
        return (
            <div className='px-2 lg:px-7 pt-5'>
                <div className='flex items-center justify-center h-64'>
                    <div className='text-white'>Chargement des bannières...</div>
                </div>
            </div>
        );
    }

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='flex justify-between items-center mb-5'>
                <h1 className='text-[#000000] font-semibold text-lg'>Bannières Publiées</h1>
                <button 
                    onClick={loadPublishedBanners}
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                >
                    ↻ Recharger
                </button>
            </div>

            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-white font-semibold'>Liste des bannières actives</h2>
                    <span className='bg-green-500 text-white px-3 py-1 rounded-full text-sm'>
                        {banners.length} bannière(s) active(s)
                    </span>
                </div>

                {banners.length === 0 ? (
                    <div className='text-center py-8 text-gray-300'>
                        <div className='text-4xl mb-4'>📭</div>
                        <p>Aucune bannière publiée pour le moment</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {banners.map((banner) => (
                            <div key={banner.id} className='bg-white rounded-lg overflow-hidden shadow-md'>
                                <div className='relative'>
                                    <img 
                                        src={banner.image} 
                                        alt="Bannière" 
                                        className='w-full h-32 object-cover'
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x200/cccccc/666666?text=Image+non+disponible';
                                        }}
                                    />
                                    <div className='absolute top-2 right-2'>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getBannerTypeColor(banner.bannerType)}`}>
                                            {getBannerTypeName(banner.bannerType)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className='p-3'>
                                    <div className='flex justify-between items-center mb-2'>
                                        <span className='text-sm font-medium text-gray-700'>
                                            {banner.sellerName}
                                        </span>
                                        <span className='text-xs text-gray-500'>
                                            ID: {banner.id.slice(-6)}
                                        </span>
                                    </div>
                                    
                                    <div className='flex gap-2'>
                                        <button
                                            onClick={() => {
                                                setSelectedBanner(banner);
                                                setShowModal(true);
                                            }}
                                            className='flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center justify-center gap-1'
                                        >
                                            <FaEye /> Voir
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner.id)}
                                            className='flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex items-center justify-center gap-1'
                                        >
                                            <FaTrash /> Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de détails */}
            {showModal && selectedBanner && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
                        <h3 className='text-lg font-bold mb-4 text-gray-800'>Détails de la bannière</h3>
                        
                        <div className='mb-4'>
                            <img 
                                src={selectedBanner.image} 
                                alt="Bannière" 
                                className='w-full h-48 object-cover rounded border'
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/800x300/cccccc/666666?text=Image+non+disponible';
                                }}
                            />
                        </div>
                        
                        <div className='grid grid-cols-2 gap-4 mb-4 text-sm'>
                            <div>
                                <strong>Vendeur:</strong> {selectedBanner.sellerName}
                            </div>
                            <div>
                                <strong>Type:</strong> 
                                <span className={`ml-2 px-2 py-1 rounded text-xs ${getBannerTypeColor(selectedBanner.bannerType)}`}>
                                    {getBannerTypeName(selectedBanner.bannerType)}
                                </span>
                            </div>
                            <div>
                                <strong>ID:</strong> {selectedBanner.id}
                            </div>
                            <div>
                                <strong>Lien:</strong> 
                                <a 
                                    href={selectedBanner.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className='text-blue-500 hover:underline ml-1'
                                >
                                    Ouvrir
                                </a>
                            </div>
                        </div>
                        
                        <div className='flex gap-3'>
                            <button
                                onClick={() => handleDelete(selectedBanner.id)}
                                className='bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600'
                            >
                                🗑️ Supprimer cette bannière
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className='flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600'
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublishedBanners;