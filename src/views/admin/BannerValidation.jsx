import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_pending_banners, validate_banner, messageClear } from '../../store/Reducers/bannerReducer';
import toast from 'react-hot-toast';

const BannerValidation = () => {
    const dispatch = useDispatch()
    const { validationStatus, loader, successMessage, errorMessage } = useSelector(state => state.banner)
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [localBanners, setLocalBanners] = useState([]);

    useEffect(() => {
        const loadBanners = () => {
            const stored = JSON.parse(localStorage.getItem('pendingBanners') || '[]')
            setLocalBanners(stored.filter(banner => banner.status === 'pending_validation'))
        }
        loadBanners()
        const interval = setInterval(loadBanners, 2000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage, dispatch])

    const handleApprove = (bannerId) => {
        const allBanners = JSON.parse(localStorage.getItem('pendingBanners') || '[]')
        const bannerToApprove = allBanners.find(banner => banner._id === bannerId)
        
        const updatedBanners = allBanners.map(banner => 
            banner._id === bannerId 
                ? { ...banner, status: 'approved', approvedAt: new Date().toLocaleString() }
                : banner
        )
        localStorage.setItem('pendingBanners', JSON.stringify(updatedBanners))
        
        // Ajouter à la liste des bannières publiées
        const publishedBanners = JSON.parse(localStorage.getItem('publishedBanners') || '[]')
        const newBanner = {
            ...bannerToApprove,
            status: 'approved',
            approvedAt: new Date().toLocaleString(),
            publishedAt: new Date().toLocaleString()
        }
        publishedBanners.push(newBanner)
        
        // Sauvegarder localement
        const limitedBanners = publishedBanners.slice(-10)
        localStorage.setItem('publishedBanners', JSON.stringify(limitedBanners))
        localStorage.setItem('frontendBanners', JSON.stringify(limitedBanners))
        
        // Notification pour le vendeur
        const sellerNotifications = JSON.parse(localStorage.getItem('sellerNotifications') || '[]')
        sellerNotifications.push({
            id: 'notif_' + Date.now(),
            type: 'banner_approved',
            title: 'Bannière approuvée !',
            message: `Votre bannière ${bannerToApprove.bannerType} a été approuvée et publiée.`,
            timestamp: new Date().toLocaleString(),
            read: false
        })
        localStorage.setItem('sellerNotifications', JSON.stringify(sellerNotifications))
        
        // Envoyer automatiquement au frontend
        try {
            const frontendWindow = window.open('http://localhost:3000', 'frontend');
            setTimeout(() => {
                if (frontendWindow) {
                    frontendWindow.postMessage({
                        type: 'SYNC_BANNERS',
                        banners: limitedBanners
                    }, 'http://localhost:3000');
                    console.log('✅ Bannière envoyée au frontend automatiquement');
                }
            }, 1000);
        } catch (error) {
            console.log('Erreur envoi frontend:', error);
        }
        
        // Déclencher événements
        window.dispatchEvent(new CustomEvent('bannerApproved', { detail: bannerToApprove }))
        window.dispatchEvent(new CustomEvent('sellerNotification', { detail: { type: 'approved' } }))
        
        setLocalBanners(prev => prev.filter(banner => banner._id !== bannerId))
        setShowModal(false)
        toast.success('Bannière approuvée et publiée !')
    };

    const handleReject = (bannerId, reason = 'Non conforme aux standards') => {
        const allBanners = JSON.parse(localStorage.getItem('pendingBanners') || '[]')
        const bannerToReject = allBanners.find(banner => banner._id === bannerId)
        
        const updatedBanners = allBanners.map(banner => 
            banner._id === bannerId 
                ? { ...banner, status: 'rejected', rejectedAt: new Date().toLocaleString(), rejectionReason: reason }
                : banner
        )
        localStorage.setItem('pendingBanners', JSON.stringify(updatedBanners))
        
        // Notification pour le vendeur
        const sellerNotifications = JSON.parse(localStorage.getItem('sellerNotifications') || '[]')
        sellerNotifications.push({
            id: 'notif_' + Date.now(),
            type: 'banner_rejected',
            title: 'Bannière rejetée',
            message: `Votre bannière ${bannerToReject.bannerType} a été rejetée. Raison: ${reason}`,
            timestamp: new Date().toLocaleString(),
            read: false
        })
        localStorage.setItem('sellerNotifications', JSON.stringify(sellerNotifications))
        
        // Déclencher événement
        window.dispatchEvent(new CustomEvent('sellerNotification', { detail: { type: 'rejected' } }))
        
        setLocalBanners(prev => prev.filter(banner => banner._id !== bannerId))
        setShowModal(false)
        toast.success('Bannière rejetée')
    };

    const openModal = (banner) => {
        setSelectedBanner(banner);
        setShowModal(true);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending_validation': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'pending_validation': return 'En attente';
            case 'approved': return 'Approuvée';
            case 'rejected': return 'Rejetée';
            default: return 'Inconnu';
        }
    };

    const banners = localBanners;

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[#000000] font-semibold text-lg mb-3'>Validation des Bannières</h1>
            
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-white font-semibold'>Bannières en attente de validation</h2>
                    <span className='bg-yellow-500 text-white px-3 py-1 rounded-full text-sm'>
                        {banners.length} en attente
                    </span>
                </div>

                <div className='relative overflow-x-auto'>
                    <table className='w-full text-sm text-left text-[#d0d2d6]'>
                        <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                            <tr>
                                <th scope='col' className='py-3 px-4'>Vendeur</th>
                                <th scope='col' className='py-3 px-4'>Type</th>
                                <th scope='col' className='py-3 px-4'>Prix</th>
                                <th scope='col' className='py-3 px-4'>Soumise le</th>
                                <th scope='col' className='py-3 px-4'>Statut</th>
                                <th scope='col' className='py-3 px-4'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.length === 0 ? (
                                <tr><td colSpan="6" className='py-4 px-4 text-center text-gray-400'>Aucune bannière en attente de validation</td></tr>
                            ) : banners.map((banner) => (
                                <tr key={banner._id} className='border-b border-slate-700'>
                                    <td className='py-3 px-4 font-medium'>{banner.sellerName}</td>
                                    <td className='py-3 px-4'>
                                        <span className='capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'>
                                            {banner.bannerType}
                                        </span>
                                    </td>
                                    <td className='py-3 px-4'>{banner.price} FCFA</td>
                                    <td className='py-3 px-4'>{banner.submittedAt}</td>
                                    <td className='py-3 px-4'>
                                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(banner.status)}`}>
                                            {getStatusText(banner.status)}
                                        </span>
                                    </td>
                                    <td className='py-3 px-4'>
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => openModal(banner)}
                                                className='p-2 bg-blue-500 rounded hover:bg-blue-600'
                                                title='Voir détails'
                                            >
                                                <FaEye />
                                            </button>
                                            {banner.status === 'pending_validation' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(banner._id)}
                                                        className='p-2 bg-green-500 rounded hover:bg-green-600'
                                                        title='Approuver'
                                                        disabled={loader}
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(banner._id)}
                                                        className='p-2 bg-red-500 rounded hover:bg-red-600'
                                                        title='Rejeter'
                                                        disabled={loader}
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                                <p><strong>Soumise le:</strong> {selectedBanner.submittedAt}</p>
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
                            {selectedBanner.status === 'pending_validation' && (
                                <>
                                    <button
                                        onClick={() => handleApprove(selectedBanner._id)}
                                        className='flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'
                                        disabled={loader}
                                    >
                                        ✓ Approuver
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedBanner._id)}
                                        className='flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600'
                                        disabled={loader}
                                    >
                                        ✗ Rejeter
                                    </button>
                                </>
                            )}
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

export default BannerValidation;