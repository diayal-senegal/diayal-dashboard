import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AddCourierForm from '../../../components/admin/AddCourierForm.jsx';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CourierManagement = () => {
    const [couriers, setCouriers] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filters, setFilters] = useState({
        availability: '',
        zone: ''
    });

    const { userInfo, token } = useSelector(state => state.auth);

    useEffect(() => {
        loadCouriers();
        loadPendingDeliveries();
        
        // Polling toutes les 20 secondes
        const interval = setInterval(() => {
            loadCouriers();
        }, 20000);
        
        return () => clearInterval(interval);
    }, [filters]);

    const loadCouriers = async () => {
        try {
            const params = new URLSearchParams({
                ...(filters.availability && { availability: filters.availability }),
                ...(filters.zone && { zone: filters.zone })
            });

            const response = await fetch(`${API_URL}/admin/couriers?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                // Adapter le format de la réponse
                const couriersData = Array.isArray(data) ? data : (data.couriers || data.data || []);
                const formattedCouriers = couriersData.map(c => ({
                    id: c._id || c.id,
                    name: c.name,
                    phone: c.phone,
                    availability: c.isAvailable ? 'AVAILABLE' : 'OFFLINE',
                    activeDeliveriesCount: 0,
                    maxDeliveries: 5,
                    lastLocation: null,
                    vehicle: { type: c.vehicleType, plate: '' }
                }));
                setCouriers(formattedCouriers);
            } else {
                console.error('Erreur API:', data.message || 'Erreur inconnue');
                setCouriers([]);
            }
        } catch (error) {
            console.error('Erreur chargement couriers:', error);
            setCouriers([]);
        }
    };

    const loadPendingDeliveries = async () => {
        try {
            // TODO: Implémenter la route backend pour les livraisons
            // const response = await fetch(`${API_URL}/api/admin/deliveries?status=PICKUP_PENDING&limit=20`);
            // const data = await response.json();
            // if (response.ok) {
            //     setDeliveries(data.items || []);
            // }
            setDeliveries([]);
        } catch (error) {
            console.error('Erreur chargement livraisons:', error);
        }
    };

    const handleAssignDelivery = async (deliveryId) => {
        if (!selectedCourier) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/admin/deliveries/${deliveryId}/assign`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    courierId: selectedCourier.id,
                    note: `Assigné depuis la page couriers`
                })
            });

            if (response.ok) {
                setShowAssignModal(false);
                setSelectedCourier(null);
                loadCouriers();
                loadPendingDeliveries();
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.message}`);
            }
        } catch (error) {
            alert('Erreur lors de l\'assignation');
        } finally {
            setLoading(false);
        }
    };



    const getAvailabilityBadge = (availability) => {
        const colors = {
            'AVAILABLE': 'bg-green-100 text-green-800',
            'BUSY': 'bg-yellow-100 text-yellow-800',
            'OFFLINE': 'bg-gray-100 text-gray-800',
            'SUSPENDED': 'bg-red-100 text-red-800'
        };

        const labels = {
            'AVAILABLE': 'Disponible',
            'BUSY': 'Occupé',
            'OFFLINE': 'Hors ligne',
            'SUSPENDED': 'Suspendu'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[availability] || 'bg-gray-100 text-gray-800'}`}>
                {labels[availability] || availability}
            </span>
        );
    };

    const formatLastSeen = (timestamp) => {
        if (!timestamp) return 'Jamais';
        
        const now = new Date();
        const lastSeen = new Date(timestamp);
        const diffMinutes = Math.floor((now - lastSeen) / (1000 * 60));
        
        if (diffMinutes < 1) return 'À l\'instant';
        if (diffMinutes < 60) return `Il y a ${diffMinutes}min`;
        if (diffMinutes < 1440) return `Il y a ${Math.floor(diffMinutes / 60)}h`;
        return lastSeen.toLocaleDateString();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Couriers</h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                    >
                        + Nouveau Coursier
                    </button>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Mise à jour: 20s</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Disponibilité
                        </label>
                        <select
                            value={filters.availability}
                            onChange={(e) => setFilters({...filters, availability: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                            <option value="">Tous</option>
                            <option value="AVAILABLE">Disponible</option>
                            <option value="BUSY">Occupé</option>
                            <option value="OFFLINE">Hors ligne</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Zone
                        </label>
                        <select
                            value={filters.zone}
                            onChange={(e) => setFilters({...filters, zone: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                            <option value="">Toutes les zones</option>
                            
                            {/* Département de Dakar */}
                            <optgroup label="Département de Dakar">
                                <option value="Biscuiterie">Biscuiterie</option>
                                <option value="Cambérène">Cambérène</option>
                                <option value="Dakar-Plateau">Dakar-Plateau</option>
                                <option value="Dieuppeul-Derklé">Dieuppeul-Derklé</option>
                                <option value="Fann-Point E-Amitié">Fann-Point E-Amitié</option>
                                <option value="Grand Dakar">Grand Dakar</option>
                                <option value="Grand Yoff">Grand Yoff</option>
                                <option value="Gueule Tapée-Fass-Colobane">Gueule Tapée-Fass-Colobane</option>
                                <option value="Hann Bel-Air">Hann Bel-Air</option>
                                <option value="HLM">HLM</option>
                                <option value="Les Parcelles Assainies">Les Parcelles Assainies</option>
                                <option value="Médina">Médina</option>
                                <option value="Mermoz-Sacré-Cœur">Mermoz-Sacré-Cœur</option>
                                <option value="Ngor">Ngor</option>
                                <option value="Ouakam">Ouakam</option>
                                <option value="Patte d'Oie">Patte d'Oie</option>
                                <option value="Sicap-Liberté">Sicap-Liberté</option>
                                <option value="Yoff">Yoff</option>
                            </optgroup>
                            
                            {/* Département de Pikine */}
                            <optgroup label="Département de Pikine">
                                <option value="Dalifort">Dalifort</option>
                                <option value="Diamaguène Sicap Mbao">Diamaguène Sicap Mbao</option>
                                <option value="Djidah Thiaroye Kaw">Djidah Thiaroye Kaw</option>
                                <option value="Guinaw Rail Nord">Guinaw Rail Nord</option>
                                <option value="Guinaw Rail Sud">Guinaw Rail Sud</option>
                                <option value="Keur Massar">Keur Massar</option>
                                <option value="Malika">Malika</option>
                                <option value="Mbao">Mbao</option>
                                <option value="Pikine Est">Pikine Est</option>
                                <option value="Pikine Nord">Pikine Nord</option>
                                <option value="Pikine Ouest">Pikine Ouest</option>
                                <option value="Thiaroye Gare">Thiaroye Gare</option>
                                <option value="Thiaroye-sur-Mer">Thiaroye-sur-Mer</option>
                                <option value="Tivaouane Diacksao">Tivaouane Diacksao</option>
                                <option value="Yeumbeul Nord">Yeumbeul Nord</option>
                                <option value="Yeumbeul Sud">Yeumbeul Sud</option>
                            </optgroup>
                            
                            {/* Département de Guédiawaye */}
                            <optgroup label="Département de Guédiawaye">
                                <option value="Golf Sud">Golf Sud</option>
                                <option value="Médina Gounass">Médina Gounass</option>
                                <option value="Ndiarème Limamoulaye">Ndiarème Limamoulaye</option>
                                <option value="Sam Notaire">Sam Notaire</option>
                                <option value="Wakhinane Nimzatt">Wakhinane Nimzatt</option>
                            </optgroup>
                            
                            {/* Département de Rufisque */}
                            <optgroup label="Département de Rufisque">
                                <option value="Rufisque Est">Rufisque Est</option>
                                <option value="Rufisque Nord">Rufisque Nord</option>
                                <option value="Rufisque Ouest">Rufisque Ouest</option>
                                <option value="Bargny">Bargny</option>
                                <option value="Sébikotane">Sébikotane</option>
                                <option value="Diamniadio">Diamniadio</option>
                                <option value="Sangalkam">Sangalkam</option>
                                <option value="Sendou">Sendou</option>
                            </optgroup>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={loadCouriers}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            Actualiser
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total', value: couriers?.length || 0, color: 'bg-blue-500' },
                    { label: 'Disponibles', value: couriers?.filter(c => c.availability === 'AVAILABLE').length || 0, color: 'bg-green-500' },
                    { label: 'Occupés', value: couriers?.filter(c => c.availability === 'BUSY').length || 0, color: 'bg-yellow-500' },
                    { label: 'Hors ligne', value: couriers?.filter(c => c.availability === 'OFFLINE').length || 0, color: 'bg-gray-500' }
                ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${stat.color} mr-2`}></div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Table des couriers */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Courier
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Livraisons
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dernière position
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Véhicule
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {(couriers || []).map((courier) => (
                                <tr key={courier.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {courier.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {courier.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getAvailabilityBadge(courier.availability)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {courier.activeDeliveriesCount} / {courier.maxDeliveries}
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(courier.activeDeliveriesCount / courier.maxDeliveries) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {courier.lastLocation ? (
                                            <div>
                                                <div className="text-sm text-gray-900">
                                                    {formatLastSeen(courier.lastLocation.recordedAt)}
                                                </div>
                                                <a
                                                    href={`https://www.google.com/maps?q=${courier.lastLocation.coordinates.lat},${courier.lastLocation.coordinates.lng}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-600 hover:text-blue-800"
                                                >
                                                    🗺️ Voir position
                                                </a>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">Aucune position</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {courier.vehicle?.type || 'Non spécifié'}
                                        </div>
                                        {courier.vehicle?.plate && (
                                            <div className="text-xs text-gray-500">
                                                {courier.vehicle.plate}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            {courier.availability === 'AVAILABLE' && courier.activeDeliveriesCount < courier.maxDeliveries && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedCourier(courier);
                                                        setShowAssignModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Assigner
                                                </button>
                                            )}
                                            <button
                                                onClick={() => window.open(`/admin/couriers/${courier.id}/active-deliveries`, '_blank')}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                Livraisons
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(couriers || []).length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500">Aucun courier trouvé</div>
                    </div>
                )}
            </div>

            {/* Modal d'assignation */}
            {showAssignModal && selectedCourier && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Assigner une livraison à {selectedCourier.name}
                            </h3>
                            
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {(deliveries || []).map((delivery) => (
                                    <div
                                        key={delivery.id}
                                        className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                                        onClick={() => handleAssignDelivery(delivery.id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="font-medium">#{delivery.id.slice(0, 8)}</div>
                                                <div className="text-sm text-gray-600">
                                                    {delivery.pickup.zone} → {delivery.dropoff.zone}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {delivery.dropoff.name}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {delivery.priority > 0 && (
                                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                        {delivery.priority === 2 ? 'Express' : 'Urgent'}
                                                    </span>
                                                )}
                                                {delivery.amounts.cod > 0 && (
                                                    <div className="text-xs text-green-600 mt-1">
                                                        COD: {(delivery.amounts.cod / 100).toFixed(0)} {delivery.amounts.currency}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {(deliveries || []).length === 0 && (
                                <div className="text-center py-4 text-gray-500">
                                    Aucune livraison en attente
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowAssignModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de création avec le nouveau composant */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-5 border shadow-lg rounded-md bg-white max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Nouveau coursier
                            </h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <AddCourierForm 
                            onSuccess={() => {
                                setShowCreateModal(false);
                                loadCouriers();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourierManagement;