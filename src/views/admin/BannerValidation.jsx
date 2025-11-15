import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { get_pending_banners, validate_banner, messageClear } from '../../store/Reducers/bannerReducer';
import toast from 'react-hot-toast';
import api from '../../api/api';

const BannerValidation = () => {
    const dispatch = useDispatch();
    const { pendingBanners, loader, successMessage, errorMessage } = useSelector(state => state.banner);
    const [banners, setBanners] = useState([]);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        try {
            console.log('=== DEBUG CHARGEMENT BANNIERES ===');
            console.log('URL API:', '/banners/pending');
            console.log('Token présent:', !!localStorage.getItem('accessToken'));
            
            const response = await api.get('/banners/pending');
            console.log('Réponse complète:', response);
            console.log('Status:', response.status);
            console.log('Data:', response.data);
            
            if (response.data?.banners) {
                setBanners(response.data.banners);
                console.log('Bannières définies:', response.data.banners);
                if (response.data.banners.length > 0) {
                    toast.success(`${response.data.banners.length} bannière(s) en attente`);
                } else {
                    console.log('Aucune bannière en attente');
                    toast.success('Aucune bannière en attente');
                }
            } else {
                console.log('Pas de bannières dans la réponse');
                setBanners([]);
                toast.success('Aucune donnée de bannières');
            }
        } catch (error) {
            console.error('=== ERREUR COMPLETE ===');
            console.error('Error object:', error);
            console.error('Response:', error.response);
            console.error('Status:', error.response?.status);
            console.error('Data:', error.response?.data);
            console.error('Message:', error.message);
            
            if (error.response?.status === 403) {
                toast.error('Accès refusé - Connexion admin requise');
            } else if (error.response?.status === 404) {
                toast.error('Endpoint non trouvé');
            } else {
                toast.error(`Erreur: ${error.response?.status || error.message}`);
            }
            
            setBanners([]);
        }
    };

    useEffect(() => {
        if (pendingBanners) {
            setBanners(pendingBanners);
        }
    }, [pendingBanners]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            loadBanners();
        }
        if (errorMessage) {
            console.error('Erreur:', errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    const handleApprove = async (bannerId) => {
        try {
            await api.put(`/banners/validate/${bannerId}`, { 
                status: 'approved' 
            });
            
            setBanners(prev => prev.filter(b => b._id !== bannerId));
            setShowModal(false);
            toast.success('Bannière approuvée avec succès !');
        } catch (error) {
            console.error('Erreur approbation:', error);
            toast.error('Erreur lors de l\'approbation');
        }
    };

    const handleReject = async (bannerId) => {
        try {
            await api.put(`/banners/validate/${bannerId}`, { 
                status: 'rejected', 
                reason: 'Non conforme aux standards' 
            });
            
            setBanners(prev => prev.filter(b => b._id !== bannerId));
            setShowModal(false);
            toast.success('Bannière rejetée');
        } catch (error) {
            console.error('Erreur rejet:', error);
            toast.error('Erreur lors du rejet');
        }
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[#000000] font-semibold text-lg mb-3'>Validation des Bannières</h1>
            
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-white font-semibold'>Bannières en attente</h2>
                    <div className='flex gap-2 items-center'>
                        <button 
                            onClick={loadBanners}
                            className='bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600'
                        >
                            ↻ Recharger
                        </button>
                        <button 
                            onClick={async () => {
                                try {
                                    console.log('=== TEST CREATION BANNIERE ===');
                                    const response = await api.post('/banners/test');
                                    console.log('Réponse test:', response.data);
                                    toast.success('Bannière de test créée!');
                                    
                                    // Test immédiat de récupération
                                    setTimeout(async () => {
                                        console.log('=== TEST RECUPERATION ===');
                                        try {
                                            const checkResponse = await api.get('/banners/pending');
                                            console.log('Vérification:', checkResponse.data);
                                            setBanners(checkResponse.data.banners || []);
                                            toast.success(`Trouvé: ${checkResponse.data.banners?.length || 0} bannières`);
                                        } catch (err) {
                                            console.error('Erreur vérification:', err);
                                            toast.error('Erreur lors de la vérification');
                                        }
                                    }, 1000);
                                } catch (error) {
                                    console.error('Erreur test:', error);
                                    toast.error('Erreur création test');
                                }
                            }}
                            className='bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600'
                        >
                            + Test Complet
                        </button>
                        <button 
                            onClick={async () => {
                                try {
                                    console.log('=== TEST PENDING SANS AUTH ===');
                                    const response = await fetch('http://localhost:5000/api/banners/pending-test');
                                    const data = await response.json();
                                    console.log('Pending test:', data);
                                    if (data.banners) {
                                        setBanners(data.banners);
                                        toast.success(`${data.banners.length} bannières trouvées!`);
                                    } else {
                                        toast.success('Aucune bannière');
                                    }
                                } catch (error) {
                                    console.error('Erreur test:', error);
                                    toast.error('Erreur test');
                                }
                            }}
                            className='bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600'
                        >
                            🔍 Test Pending
                        </button>
                        <span className='bg-yellow-500 text-white px-3 py-1 rounded-full text-sm'>
                            {banners.length} en attente
                        </span>
                    </div>
                </div>

                <div className='relative overflow-x-auto'>
                    <table className='w-full text-sm text-left text-[#d0d2d6]'>
                        <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                            <tr>
                                <th className='py-3 px-4'>Vendeur</th>
                                <th className='py-3 px-4'>Type</th>
                                <th className='py-3 px-4'>Prix</th>
                                <th className='py-3 px-4'>Date</th>
                                <th className='py-3 px-4'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className='py-4 px-4 text-center text-gray-400'>
                                        Aucune bannière en attente
                                    </td>
                                </tr>
                            ) : banners.map((banner) => (
                                <tr key={banner._id} className='border-b border-slate-700'>
                                    <td className='py-3 px-4'>{banner.sellerName || 'Vendeur'}</td>
                                    <td className='py-3 px-4'>
                                        <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'>
                                            {banner.bannerType}
                                        </span>
                                    </td>
                                    <td className='py-3 px-4'>{banner.price} FCFA</td>
                                    <td className='py-3 px-4'>{new Date(banner.createdAt || Date.now()).toLocaleDateString()}</td>
                                    <td className='py-3 px-4'>
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => {
                                                    setSelectedBanner(banner);
                                                    setShowModal(true);
                                                }}
                                                className='p-2 bg-blue-500 rounded hover:bg-blue-600 text-white'
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => handleApprove(banner._id)}
                                                className='p-2 bg-green-500 rounded hover:bg-green-600 text-white'
                                                disabled={loader}
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                onClick={() => handleReject(banner._id)}
                                                className='p-2 bg-red-500 rounded hover:bg-red-600 text-white'
                                                disabled={loader}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && selectedBanner && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg max-w-2xl w-full mx-4'>
                        <h3 className='text-lg font-bold mb-4 text-gray-800'>Détails de la bannière</h3>
                        <div className='mb-4'>
                            <p className='text-gray-700'><strong>Vendeur:</strong> {selectedBanner.sellerName}</p>
                            <p className='text-gray-700'><strong>Type:</strong> {selectedBanner.bannerType}</p>
                            <p className='text-gray-700'><strong>Prix:</strong> {selectedBanner.price} FCFA</p>
                            <p className='text-gray-700'><strong>Date:</strong> {new Date(selectedBanner.createdAt).toLocaleDateString()}</p>
                            <div className='mt-2'>
                                <p className='text-gray-600 text-sm mb-1'>Aperçu de la bannière:</p>
                                {selectedBanner.image ? (
                                    <div className='relative'>
                                        <img 
                                            src={selectedBanner.image} 
                                            alt="Bannière" 
                                            className='w-full h-32 object-cover rounded border'
                                            onLoad={() => console.log('Image chargée:', selectedBanner.image)}
                                            onError={(e) => {
                                                console.error('Erreur chargement image:', selectedBanner.image);
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div 
                                            className='w-full h-32 bg-gray-200 rounded border flex-col items-center justify-center text-gray-500 text-sm p-2'
                                            style={{display: 'none'}}
                                        >
                                            <div className='text-center'>
                                                🖼️ Image non disponible
                                            </div>
                                            <div className='text-xs mt-1 break-all'>
                                                URL: {selectedBanner.image}
                                            </div>
                                            <button 
                                                onClick={() => window.open(selectedBanner.image, '_blank')}
                                                className='mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded'
                                            >
                                                Ouvrir dans un nouvel onglet
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='w-full h-32 bg-gray-200 rounded border flex items-center justify-center text-gray-500'>
                                        Aucune image
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='flex gap-3'>
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