import React, { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaSearch, FaTruck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../api/api';

const DeliveryCommissionsPage = () => {
    const [commissions, setCommissions] = useState([]);
    const [stats, setStats] = useState({
        totalCommissions: 0,
        totalDeliveryFees: 0,
        pendingCommissions: 0,
        collectedCommissions: 0
    });
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCommission, setSelectedCommission] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadCommissions();
        loadStats();
    }, [currentPage, searchValue]);

    const loadCommissions = async () => {
        try {
            const response = await api.get(`/admin/delivery-commissions?page=${currentPage}&searchValue=${searchValue}`);
            setCommissions(response.data.commissions || []);
        } catch (error) {
            console.error('Erreur API:', error);
            toast.error('Erreur lors du chargement des commissions');
        }
    };

    const loadStats = async () => {
        try {
            const response = await api.get('/admin/delivery-commission-stats');
            setStats(response.data.totalStats || {
                totalCommissions: 0,
                totalDeliveryFees: 0,
                pendingCommissions: 0,
                collectedCommissions: 0
            });
        } catch (error) {
            console.error('Erreur API:', error);
            toast.error('Erreur lors du chargement des statistiques');
        }
    };

    const markAsCollected = async (commissionId) => {
        try {
            await api.put(`/admin/delivery-commission/${commissionId}/collect`);
            setCommissions(prev => 
                prev.map(c => 
                    c._id === commissionId 
                        ? { ...c, status: 'collected', collectedAt: new Date().toISOString() }
                        : c
                )
            );
            toast.success('Commission marquée comme collectée');
            setShowModal(false);
            loadStats();
        } catch (error) {
            console.error('Erreur API:', error);
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const openModal = (commission) => {
        setSelectedCommission(commission);
        setShowModal(true);
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[#000000] font-semibold text-lg mb-3 flex items-center gap-2'>
                <FaTruck className='text-blue-600' />
                Commissions de Livraison
            </h1>
            
            {/* Statistiques */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
                <div className='bg-green-500 p-4 rounded-md text-white'>
                    <h3 className='text-sm font-medium'>Total Commissions</h3>
                    <p className='text-2xl font-bold'>{stats.totalCommissions.toLocaleString()} FCFA</p>
                </div>
                <div className='bg-blue-500 p-4 rounded-md text-white'>
                    <h3 className='text-sm font-medium'>Total Frais Livraison</h3>
                    <p className='text-2xl font-bold'>{stats.totalDeliveryFees.toLocaleString()} FCFA</p>
                </div>
                <div className='bg-orange-500 p-4 rounded-md text-white'>
                    <h3 className='text-sm font-medium'>En Attente</h3>
                    <p className='text-2xl font-bold'>{stats.pendingCommissions.toLocaleString()} FCFA</p>
                </div>
                <div className='bg-purple-500 p-4 rounded-md text-white'>
                    <h3 className='text-sm font-medium'>Collectées</h3>
                    <p className='text-2xl font-bold'>{stats.collectedCommissions.toLocaleString()} FCFA</p>
                </div>
            </div>

            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-white font-semibold'>Liste des Commissions de Livraison</h2>
                    <div className='flex gap-2 items-center'>
                        <div className='relative'>
                            <input
                                type='text'
                                placeholder='Rechercher...'
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className='px-3 py-1 rounded text-sm text-black pl-8'
                            />
                            <FaSearch className='absolute left-2 top-2 text-gray-400 text-xs' />
                        </div>
                        <span className='bg-green-500 text-white px-3 py-1 rounded-full text-sm'>
                            {commissions.length} commission{commissions.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {commissions.length === 0 ? (
                    <div className='text-center py-8'>
                        <p className='text-gray-300'>Aucune commission pour le moment</p>
                    </div>
                ) : (
                    <div className='relative overflow-x-auto'>
                        <table className='w-full text-sm text-left text-[#d0d2d6]'>
                            <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                                <tr>
                                    <th scope='col' className='py-3 px-4'>Livreur</th>
                                    <th scope='col' className='py-3 px-4'>Récupération</th>
                                    <th scope='col' className='py-3 px-4'>Livraison</th>
                                    <th scope='col' className='py-3 px-4'>Distance</th>
                                    <th scope='col' className='py-3 px-4'>Frais</th>
                                    <th scope='col' className='py-3 px-4'>Commission</th>
                                    <th scope='col' className='py-3 px-4'>Livreur reçoit</th>
                                    <th scope='col' className='py-3 px-4'>Statut</th>
                                    <th scope='col' className='py-3 px-4'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commissions.map((commission) => (
                                    <tr key={commission._id} className='border-b border-slate-700'>
                                        <td className='py-3 px-4 font-medium'>{commission.courierName}</td>
                                        <td className='py-3 px-4 text-xs'>{commission.pickupAddress.substring(0, 30)}...</td>
                                        <td className='py-3 px-4 text-xs'>{commission.dropoffAddress.substring(0, 30)}...</td>
                                        <td className='py-3 px-4'>{commission.distanceKm ? `${commission.distanceKm} km` : '-'}</td>
                                        <td className='py-3 px-4'>{commission.deliveryFeeAmount.toLocaleString()} FCFA</td>
                                        <td className='py-3 px-4 font-bold text-green-400'>
                                            {commission.commissionAmount.toLocaleString()} FCFA
                                        </td>
                                        <td className='py-3 px-4 font-bold text-blue-400'>
                                            {commission.courierEarnings.toLocaleString()} FCFA
                                        </td>
                                        <td className='py-3 px-4'>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                commission.status === 'pending' 
                                                    ? 'bg-orange-100 text-orange-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {commission.status === 'pending' ? 'En attente' : 'Collectée'}
                                            </span>
                                        </td>
                                        <td className='py-3 px-4'>
                                            <div className='flex gap-2'>
                                                <button
                                                    onClick={() => openModal(commission)}
                                                    className='p-2 bg-blue-500 rounded hover:bg-blue-600'
                                                    title='Voir détails'
                                                >
                                                    <FaEye />
                                                </button>
                                                {commission.status === 'pending' && (
                                                    <button
                                                        onClick={() => markAsCollected(commission._id)}
                                                        className='p-2 bg-green-500 rounded hover:bg-green-600'
                                                        title='Marquer comme collectée'
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                )}
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
            {showModal && selectedCommission && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg max-w-2xl w-full mx-4'>
                        <h3 className='text-lg font-bold text-gray-800 mb-4'>Détails de la Commission</h3>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                            <div>
                                <p><strong>Livreur:</strong> {selectedCommission.courierName}</p>
                                <p><strong>Récupération:</strong> {selectedCommission.pickupAddress}</p>
                                <p><strong>Livraison:</strong> {selectedCommission.dropoffAddress}</p>
                                <p><strong>Distance:</strong> {selectedCommission.distanceKm ? `${selectedCommission.distanceKm} km` : '-'}</p>
                            </div>
                            <div>
                                <p><strong>Frais livraison:</strong> {selectedCommission.deliveryFeeAmount.toLocaleString()} FCFA</p>
                                <p><strong>Commission (5%):</strong> {selectedCommission.commissionAmount.toLocaleString()} FCFA</p>
                                <p><strong>Livreur reçoit:</strong> {selectedCommission.courierEarnings.toLocaleString()} FCFA</p>
                                <p><strong>Statut:</strong> {selectedCommission.status === 'pending' ? 'En attente' : 'Collectée'}</p>
                                <p><strong>Date:</strong> {new Date(selectedCommission.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className='flex gap-3'>
                            {selectedCommission.status === 'pending' && (
                                <button
                                    onClick={() => markAsCollected(selectedCommission._id)}
                                    className='flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'
                                >
                                    Marquer comme collectée
                                </button>
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

export default DeliveryCommissionsPage;
