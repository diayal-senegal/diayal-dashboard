import React, { useState, useEffect } from 'react';
import { FaTrash, FaEye, FaSync } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { syncBanners } from '../../utils/syncBanners';

const PublishedBannersPage = () => {
    const [publishedBanners, setPublishedBanners] = useState([]);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const loadBanners = () => {
            // Synchroniser d'abord
            syncBanners();
            
            const stored = JSON.parse(localStorage.getItem('publishedBanners') || '[]');
            setPublishedBanners(stored.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)));
        };

        loadBanners();

        const handleBannerApproved = () => {
            loadBanners();
        };

        window.addEventListener('bannerApproved', handleBannerApproved);
        const interval = setInterval(loadBanners, 8000);

        return () => {
            window.removeEventListener('bannerApproved', handleBannerApproved);
            clearInterval(interval);
        };
    }, []);

    const removeBanner = (bannerId) => {
        const updated = publishedBanners.filter(banner => banner._id !== bannerId);
        localStorage.setItem('publishedBanners', JSON.stringify(updated));
        localStorage.setItem('frontendBanners', JSON.stringify(updated));
        
        // Envoyer automatiquement au frontend
        try {
            const frontendWindow = window.open('http://localhost:3000', 'frontend');
            setTimeout(() => {
                if (frontendWindow) {
                    frontendWindow.postMessage({
                        type: 'SYNC_BANNERS',
                        banners: updated
                    }, 'http://localhost:3000');
                    console.log('✅ Suppression envoyée au frontend automatiquement');
                }
            }, 1000);
        } catch (error) {
            console.log('Erreur envoi frontend:', error);
        }
        
        setPublishedBanners(updated);
        toast.success('Bannière supprimée');
        
        // Fermer le modal si ouvert
        setShowModal(false);
    };

    const openModal = (banner) => {
        setSelectedBanner(banner);
        setShowModal(true);
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[#000000] font-semibold text-lg mb-3'>Bannières Publiées</h1>
            
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-white font-semibold'>Gestion des bannières actives</h2>
                    <div className='flex gap-2 items-center'>
                        <button
                            onClick={() => {
                                syncBanners();
                                const stored = JSON.parse(localStorage.getItem('publishedBanners') || '[]');
                                setPublishedBanners(stored.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)));
                                toast.success('Bannières synchronisées');
                            }}
                            className='bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center gap-1'
                        >
                            <FaSync /> Sync
                        </button>
                        <span className='bg-green-500 text-white px-3 py-1 rounded-full text-sm'>
                            {publishedBanners.length} bannière{publishedBanners.length > 1 ? 's' : ''} active{publishedBanners.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {publishedBanners.length === 0 ? (
                    <div className='text-center py-8'>
                        <p className='text-gray-300'>Aucune bannière publiée pour le moment</p>
                    </div>
                ) : (
                    <div className='relative overflow-x-auto'>
                        <table className='w-full text-sm text-left text-[#d0d2d6]'>
                            <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                                <tr>
                                    <th scope='col' className='py-3 px-4'>Aperçu</th>
                                    <th scope='col' className='py-3 px-4'>Vendeur</th>
                                    <th scope='col' className='py-3 px-4'>Type</th>
                                    <th scope='col' className='py-3 px-4'>Prix</th>
                                    <th scope='col' className='py-3 px-4'>Publié le</th>
                                    <th scope='col' className='py-3 px-4'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {publishedBanners.map((banner) => (
                                    <tr key={banner._id} className='border-b border-slate-700'>
                                        <td className='py-3 px-4'>
                                            <img 
                                                src={banner.image} 
                                                alt="Bannière" 
                                                className='w-16 h-10 object-cover rounded'
                                            />
                                        </td>
                                        <td className='py-3 px-4 font-medium'>{banner.sellerName}</td>
                                        <td className='py-3 px-4'>
                                            <span className={`capitalize px-2 py-1 rounded text-xs ${
                                                banner.bannerType === 'vip' ? 'bg-purple-100 text-purple-800' :
                                                banner.bannerType === 'premium' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {banner.bannerType}
                                            </span>
                                        </td>
                                        <td className='py-3 px-4'>{banner.price} FCFA</td>
                                        <td className='py-3 px-4'>{banner.publishedAt}</td>
                                        <td className='py-3 px-4'>
                                            <div className='flex gap-2'>
                                                <button
                                                    onClick={() => openModal(banner)}
                                                    className='p-2 bg-blue-500 rounded hover:bg-blue-600'
                                                    title='Voir détails'
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => removeBanner(banner._id)}
                                                    className='p-2 bg-red-500 rounded hover:bg-red-600'
                                                    title='Retirer de la publication'
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal de détails */}
            {showModal && selectedBanner && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
                        <h3 className='text-lg font-bold text-gray-800 mb-4'>Détails de la bannière</h3>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                            <div>
                                <p><strong>Vendeur:</strong> {selectedBanner.sellerName}</p>
                                <p><strong>Type:</strong> {selectedBanner.bannerType}</p>
                                <p><strong>Prix:</strong> {selectedBanner.price} FCFA</p>
                                <p><strong>Approuvé le:</strong> {selectedBanner.approvedAt}</p>
                                <p><strong>Publié le:</strong> {selectedBanner.publishedAt}</p>
                            </div>
                            <div className='text-center'>
                                <img 
                                    src={selectedBanner.image} 
                                    alt="Bannière" 
                                    className='w-full h-32 object-cover rounded border'
                                />
                            </div>
                        </div>

                        <div className='flex gap-3'>
                            <button
                                onClick={() => removeBanner(selectedBanner._id)}
                                className='flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600'
                            >
                                Retirer de la publication
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

export default PublishedBannersPage;