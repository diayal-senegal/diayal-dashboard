import React, { useState, useEffect } from 'react';
import { FaSearch, FaExchangeAlt, FaUser, FaTruck, FaMapMarkerAlt, FaPhone, FaClock, FaMoneyBillWave, FaHistory, FaExclamationTriangle, FaFilter, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const DeliveryReassignment = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState('');
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [reassignReason, setReassignReason] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [zoneFilter, setZoneFilter] = useState('');
  const [deliveryHistory, setDeliveryHistory] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadDeliveries();
    loadCouriers();
    const interval = setInterval(loadDeliveries, 30000);
    return () => clearInterval(interval);
  }, [statusFilter, zoneFilter]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (zoneFilter) params.append('zone', zoneFilter);
      
      const response = await fetch(`${API_URL}/api/admin/deliveries?${params}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setDeliveries(Array.isArray(data) ? data : (data.items || []));
    } catch (error) {
      console.error('Erreur chargement livraisons:', error);
      toast.error('Erreur lors du chargement des livraisons');
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCouriers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/couriers`, {
        credentials: 'include'
      });
      const data = await response.json();
      setCouriers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement coursiers:', error);
      setCouriers([]);
    }
  };

  const loadDeliveryHistory = async (deliveryId) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/deliveries/${deliveryId}/history`, {
        credentials: 'include'
      });
      const data = await response.json();
      setDeliveryHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      setDeliveryHistory([]);
    }
  };

  const handleReassign = async () => {
    if (!selectedDelivery || !selectedCourier || !reassignReason) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/deliveries/${selectedDelivery.id}/reassign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          courierId: selectedCourier,
          reason: reassignReason
        })
      });

      if (response.ok) {
        toast.success('Livraison réassignée avec succès');
        setShowReassignModal(false);
        setSelectedDelivery(null);
        setSelectedCourier('');
        setReassignReason('');
        loadDeliveries();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors de la réassignation');
      }
    } catch (error) {
      console.error('Erreur réassignation:', error);
      toast.error('Erreur lors de la réassignation');
    } finally {
      setLoading(false);
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => 
    delivery.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.dropoff?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.assignedCourier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: filteredDeliveries.length,
    assigned: filteredDeliveries.filter(d => d.status === 'ASSIGNED').length,
    pickedUp: filteredDeliveries.filter(d => d.status === 'PICKED_UP').length,
    inTransit: filteredDeliveries.filter(d => d.status === 'IN_TRANSIT').length,
  };

  const getStatusColor = (status) => {
    const colors = {
      'ASSIGNED': 'bg-blue-100 text-blue-800',
      'PICKED_UP': 'bg-yellow-100 text-yellow-800',
      'IN_TRANSIT': 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'ASSIGNED': 'Assignée',
      'PICKED_UP': 'Récupérée',
      'IN_TRANSIT': 'En transit',
    };
    return texts[status] || status;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvailableCouriers = () => {
    return couriers.filter(c => c.isAvailable && c.zone === selectedDelivery?.dropoff?.zone);
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#6a5fdf] rounded-md">
        <h1 className="text-[#d0d2d6] font-semibold text-lg">Réassignation des Livraisons</h1>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-500' },
          { label: 'Assignées', value: stats.assigned, color: 'bg-indigo-500' },
          { label: 'Récupérées', value: stats.pickedUp, color: 'bg-yellow-500' },
          { label: 'En transit', value: stats.inTransit, color: 'bg-purple-500' },
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
      <div className="w-full p-4 bg-white rounded-md mt-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par ID, client ou coursier..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="ASSIGNED">Assignées</option>
            <option value="PICKED_UP">Récupérées</option>
            <option value="IN_TRANSIT">En transit</option>
          </select>

          <button
            onClick={loadDeliveries}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Actualiser'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full p-4 bg-white rounded-md mt-6">
        <div className="text-xl font-medium text-[#5c5a5a] pb-4">
          Livraisons Actives ({filteredDeliveries.length})
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-[#5c5a5a]">
              <thead className="text-sm text-[#5c5a5a] uppercase border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Adresse</th>
                  <th className="py-3 px-4">Coursier</th>
                  <th className="py-3 px-4">Montant</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4">Durée</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((delivery) => {
                  const assignedTime = delivery.timestamps?.assignedAt ? new Date(delivery.timestamps.assignedAt) : null;
                  const duration = assignedTime ? Math.floor((new Date() - assignedTime) / 60000) : 0;
                  
                  return (
                    <tr key={delivery.id} className="border-b border-slate-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">#{delivery.id?.slice(-8)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <FaUser className="text-gray-400" />
                          <div>
                            <div className="font-medium">{delivery.dropoff?.name}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <FaPhone className="mr-1" />
                              {delivery.dropoff?.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <div>
                            <div className="text-sm">{delivery.dropoff?.addressText?.slice(0, 30)}...</div>
                            <div className="text-xs text-gray-500">{delivery.dropoff?.zone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <FaTruck className="text-gray-400" />
                          <div>
                            <div className="font-medium">{delivery.assignedCourier?.name || 'Non assigné'}</div>
                            <div className="text-xs text-gray-500">{delivery.assignedCourier?.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <FaMoneyBillWave className="text-green-500" />
                          <span className="font-medium">{delivery.amounts?.cod || 0} XOF</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                          {getStatusText(delivery.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <FaClock className="text-gray-400" />
                          <span className={`text-sm ${duration > 60 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                            {duration}min
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedDelivery(delivery);
                              loadDeliveryHistory(delivery.id);
                              setShowDetailsModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Détails"
                          >
                            <FaInfoCircle />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDelivery(delivery);
                              setShowReassignModal(true);
                            }}
                            className="flex items-center space-x-1 px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                          >
                            <FaExchangeAlt />
                            <span>Réassigner</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredDeliveries.length === 0 && (
              <div className="text-center py-8 text-gray-500">Aucune livraison trouvée</div>
            )}
          </div>
        )}
      </div>

      {/* Modal Réassignation */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaExchangeAlt className="mr-2" />
              Réassigner la livraison #{selectedDelivery?.id?.slice(-8)}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded">
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-medium">{selectedDelivery?.dropoff?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-medium">{selectedDelivery?.dropoff?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Zone</p>
                <p className="font-medium">{selectedDelivery?.dropoff?.zone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Montant COD</p>
                <p className="font-medium">{selectedDelivery?.amounts?.cod || 0} XOF</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Coursier actuel</p>
                <p className="font-medium text-orange-600">{selectedDelivery?.assignedCourier?.name || 'Non assigné'}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison de la réassignation *
              </label>
              <select
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner une raison</option>
                <option value="COURIER_UNAVAILABLE">Coursier indisponible</option>
                <option value="COURIER_DELAYED">Coursier en retard</option>
                <option value="ZONE_CHANGE">Changement de zone</option>
                <option value="CUSTOMER_REQUEST">Demande client</option>
                <option value="TECHNICAL_ISSUE">Problème technique</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau coursier * ({getAvailableCouriers().length} disponibles dans la zone)
              </label>
              <select
                value={selectedCourier}
                onChange={(e) => setSelectedCourier(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un coursier</option>
                {getAvailableCouriers().map((courier) => (
                  <option key={courier._id} value={courier._id}>
                    {courier.name} - {courier.zone} ({courier.vehicleType}) - {courier.phone}
                  </option>
                ))}
              </select>
              {getAvailableCouriers().length === 0 && (
                <p className="text-sm text-red-600 mt-2 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  Aucun coursier disponible dans cette zone
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowReassignModal(false);
                  setSelectedDelivery(null);
                  setSelectedCourier('');
                  setReassignReason('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleReassign}
                disabled={loading || !selectedCourier || !reassignReason}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Réassignation...' : 'Confirmer la réassignation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Détails de la livraison #{selectedDelivery?.id?.slice(-8)}</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">📦 Récupération</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm"><strong>Contact:</strong> {selectedDelivery?.pickup?.name}</p>
                    <p className="text-sm"><strong>Téléphone:</strong> {selectedDelivery?.pickup?.phone}</p>
                    <p className="text-sm"><strong>Adresse:</strong> {selectedDelivery?.pickup?.addressText}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">🚚 Livraison</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm"><strong>Contact:</strong> {selectedDelivery?.dropoff?.name}</p>
                    <p className="text-sm"><strong>Téléphone:</strong> {selectedDelivery?.dropoff?.phone}</p>
                    <p className="text-sm"><strong>Adresse:</strong> {selectedDelivery?.dropoff?.addressText}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">💰 Montants</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm"><strong>Frais de livraison:</strong> {selectedDelivery?.amounts?.fee || 0} XOF</p>
                    <p className="text-sm"><strong>COD:</strong> {selectedDelivery?.amounts?.cod || 0} XOF</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">⏱️ Timestamps</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                    <p><strong>Créée:</strong> {formatDate(selectedDelivery?.timestamps?.created)}</p>
                    <p><strong>Assignée:</strong> {formatDate(selectedDelivery?.timestamps?.assigned)}</p>
                    <p><strong>Récupérée:</strong> {formatDate(selectedDelivery?.timestamps?.pickedUp)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                <FaHistory className="mr-2" />
                Historique des réassignations
              </h4>
              <div className="bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
                {deliveryHistory.length > 0 ? (
                  <div className="space-y-2">
                    {deliveryHistory.map((entry, i) => (
                      <div key={i} className="text-sm border-l-2 border-blue-500 pl-3">
                        <p className="font-medium">{entry.action}</p>
                        <p className="text-gray-600">{formatDate(entry.timestamp)}</p>
                        {entry.reason && <p className="text-gray-500 italic">{entry.reason}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucun historique disponible</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedDelivery(null);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
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

export default DeliveryReassignment;
