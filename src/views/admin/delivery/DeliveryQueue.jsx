import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaTruck, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaExclamationCircle, FaCheckCircle, FaEye } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DeliveryQueue = () => {
    const navigate = useNavigate();
    const [deliveries, setDeliveries] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        zone: '',
        priority: ''
    });
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const { userInfo, token } = useSelector(state => state.auth);

    useEffect(() => {
        loadDeliveries();
        loadAvailableCouriers();
        
        const interval = setInterval(loadDeliveries, 15000);
        return () => clearInterval(interval);
    }, [filters]);

    const loadDeliveries = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                ...(filters.status && { status: filters.status }),
                ...(filters.zone && { zone: filters.zone }),
                ...(filters.priority && { priority: filters.priority }),
                limit: '100'
            });

            const response = await fetch(`${API_URL}/api/admin/deliveries?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (response.ok) {
                setDeliveries(data.items || []);
            }
        } catch (error) {
            console.error('Erreur chargement livraisons:', error);
            toast.error('Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    const loadAvailableCouriers = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/couriers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (response.ok) {
                setCouriers(data || []);
            }
        } catch (error) {
            console.error('Erreur chargement coursiers:', error);
        }
    };

    const handleAssign = async (courierId) => {
        if (!selectedDelivery) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/deliveries/${selectedDelivery._id}/assign`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ courierId, note: 'Assignation depuis la queue' })
            });

            if (response.ok) {
                toast.success('Livraison assignée avec succès');
                setShowAssignModal(false);
                setSelectedDelivery(null);
                loadDeliveries();
            } else {
                const error = await response.json();
                toast.error(error.message || 'Erreur lors de l\'assignation');
            }
        } catch (error) {
            toast.error('Erreur lors de l\'assignation');
        } finally {
            setLoading(false);
        }
    };

    const filteredDeliveries = deliveries.filter(d => 
        d._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.dropoff?.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.pickup?.contactName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: filteredDeliveries.length,
        pending: filteredDeliveries.filter(d => d.status === 'PICKUP_PENDING').length,
        assigned: filteredDeliveries.filter(d => d.status === 'ASSIGNED').length,
        inProgress: filteredDeliveries.filter(d => ['PICKED_UP', 'IN_TRANSIT'].includes(d.status)).length,
        delivered: filteredDeliveries.filter(d => d.status === 'DELIVERED').length,
    };

    const getStatusBadge = (status) => {
        const config = {
            'PICKUP_PENDING': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente', icon: FaClock },
            'ASSIGNED': { color: 'bg-blue-100 text-blue-800', label: 'Assignée', icon: FaTruck },
            'PICKED_UP': { color: 'bg-purple-100 text-purple-800', label: 'Récupérée', icon: FaTruck },
            'IN_TRANSIT': { color: 'bg-orange-100 text-orange-800', label: 'En transit', icon: FaTruck },
            'DELIVERED': { color: 'bg-green-100 text-green-800', label: 'Livrée', icon: FaCheckCircle },
            'FAILED': { color: 'bg-red-100 text-red-800', label: 'Échec', icon: FaExclamationCircle },
            'CANCELED': { color: 'bg-gray-100 text-gray-800', label: 'Annulée', icon: FaExclamationCircle }
        };

        const { color, label, icon: Icon } = config[status] || config['PICKUP_PENDING'];

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${color} flex items-center gap-1`}>
                <Icon className="text-xs" />
                {label}
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        if (priority === 0) return null;
        
        const config = {
            1: { color: 'bg-orange-100 text-orange-800', label: '⚡ Urgent' },
            2: { color: 'bg-red-100 text-red-800', label: '🔥 Express' }
        };

        const { color, label } = config[priority] || {};
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>{label}</span>;
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getElapsedTime = (date) => {
        if (!date) return 'N/A';
        const minutes = Math.floor((new Date() - new Date(date)) / 60000);
        if (minutes < 60) return `${minutes}min`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}min`;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Queue des Livraisons</h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/admin/dashboard/delivery-create')}
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 flex items-center gap-2"
                    >
                        <FaPlus /> Nouvelle livraison
                    </button>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Auto: 15s</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                {[
                    { label: 'Total', value: stats.total, color: 'bg-gray-500' },
                    { label: 'En attente', value: stats.pending, color: 'bg-yellow-500' },
                    { label: 'Assignées', value: stats.assigned, color: 'bg-blue-500' },
                    { label: 'En cours', value: stats.inProgress, color: 'bg-purple-500' },
                    { label: 'Livrées', value: stats.delivered, color: 'bg-green-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-md shadow">
                        <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white text-xl font-bold mb-2`}>
                            {stat.value}
                        </div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filtres */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="PICKUP_PENDING">En attente</option>
                        <option value="ASSIGNED">Assignées</option>
                        <option value="PICKED_UP">Récupérées</option>
                        <option value="IN_TRANSIT">En transit</option>
                        <option value="DELIVERED">Livrées</option>
                    </select>

                    <select
                        value={filters.zone}
                        onChange={(e) => setFilters({...filters, zone: e.target.value})}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                        <option value="">Toutes les zones</option>
                        <optgroup label="Département de Dakar">
                            <option value="Dakar-Plateau">Dakar-Plateau</option>
                            <option value="Médina">Médina</option>
                            <option value="Les Parcelles Assainies">Parcelles Assainies</option>
                            <option value="Sicap-Liberté">Sicap-Liberté</option>
                            <option value="Grand Yoff">Grand Yoff</option>
                            <option value="Ouakam">Ouakam</option>
                            <option value="HLM">HLM</option>
                            <option value="Yoff">Yoff</option>
                        </optgroup>
                        <optgroup label="Département de Pikine">
                            <option value="Pikine Est">Pikine Est</option>
                            <option value="Pikine Nord">Pikine Nord</option>
                            <option value="Pikine Ouest">Pikine Ouest</option>
                            <option value="Guédiawaye">Guédiawaye</option>
                        </optgroup>
                        <optgroup label="Département de Rufisque">
                            <option value="Rufisque">Rufisque</option>
                        </optgroup>
                    </select>

                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters({...filters, priority: e.target.value})}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                        <option value="">Toutes priorités</option>
                        <option value="2">Express</option>
                        <option value="1">Urgent</option>
                        <option value="0">Normal</option>
                    </select>

                    <button
                        onClick={loadDeliveries}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'Chargement...' : 'Actualiser'}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Récupération</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livraison</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coursier</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durée</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDeliveries.map((delivery) => (
                                <tr key={delivery._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium text-gray-900">#{delivery._id?.slice(-8)}</div>
                                        <div className="text-xs text-gray-500">{formatDate(delivery.createdAt)}</div>
                                        {getPriorityBadge(delivery.priority)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium">{delivery.pickup?.contactName}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <FaMapMarkerAlt /> {delivery.pickup?.zone}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium">{delivery.dropoff?.contactName}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <FaMapMarkerAlt /> {delivery.dropoff?.zone}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {delivery.codAmount > 0 && (
                                            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                                                <FaMoneyBillWave />
                                                {delivery.codAmount} XOF
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-500">
                                            Frais: {delivery.fee?.amount || 0} XOF
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{getStatusBadge(delivery.status)}</td>
                                    <td className="px-4 py-3">
                                        {delivery.assignedCourier ? (
                                            <div>
                                                <div className="text-sm font-medium">{delivery.assignedCourier.name}</div>
                                                <div className="text-xs text-gray-500">{delivery.assignedCourier.phone}</div>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">Non assigné</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-600">{getElapsedTime(delivery.createdAt)}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {!delivery.assignedCourier && delivery.status === 'PICKUP_PENDING' && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedDelivery(delivery);
                                                        setShowAssignModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                                >
                                                    Assigner
                                                </button>
                                            )}
                                            <button
                                                onClick={() => navigate(`/admin/dashboard/deliveries/${delivery._id}`)}
                                                className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                                            >
                                                <FaEye /> Voir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredDeliveries.length === 0 && (
                    <div className="text-center py-12 text-gray-500">Aucune livraison trouvée</div>
                )}
            </div>

            {/* Modal Assignation */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">
                            Assigner la livraison #{selectedDelivery?._id?.slice(-8)}
                        </h3>
                        
                        <div className="mb-4 p-3 bg-gray-50 rounded">
                            <p className="text-sm"><strong>De:</strong> {selectedDelivery?.pickup?.zone}</p>
                            <p className="text-sm"><strong>Vers:</strong> {selectedDelivery?.dropoff?.zone}</p>
                        </div>

                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {couriers.filter(c => c.isAvailable).map((courier) => (
                                <div
                                    key={courier._id}
                                    className="border rounded-lg p-3 cursor-pointer hover:bg-blue-50 hover:border-blue-500"
                                    onClick={() => handleAssign(courier._id)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-medium">{courier.name}</div>
                                            <div className="text-sm text-gray-500">{courier.phone}</div>
                                            <div className="text-xs text-gray-400">{courier.zone} - {courier.vehicleType}</div>
                                        </div>
                                        <div className="text-xs text-green-600 font-medium">Disponible</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {couriers.filter(c => c.isAvailable).length === 0 && (
                            <div className="text-center py-4 text-gray-500">Aucun coursier disponible</div>
                        )}

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryQueue;
