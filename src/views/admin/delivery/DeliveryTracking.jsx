import React, { useState, useEffect } from 'react';
import { FaSearch, FaClock, FaUser, FaTruck, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaMoneyBillWave, FaEye } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const DeliveryTracking = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadDeliveries();
    const interval = setInterval(loadDeliveries, 30000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const statusParam = statusFilter === 'all' ? 'PICKUP_PENDING,ASSIGNED,ACCEPTED,REJECTED,PICKED_UP,EN_ROUTE,ARRIVED,IN_TRANSIT,DELIVERED,FAILED,CANCELED' : statusFilter;
      const response = await fetch(`${API_URL}/admin/deliveries?status=${statusParam}`, {
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

  const filteredDeliveries = deliveries.filter(delivery => 
    delivery._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.dropoff?.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.assignedCourier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const config = {
      'PICKUP_PENDING': { color: 'bg-gray-100 text-gray-800', label: 'En attente', icon: FaClock },
      'ASSIGNED': { color: 'bg-blue-100 text-blue-800', label: 'Assignée', icon: FaTruck },
      'ACCEPTED': { color: 'bg-green-100 text-green-800', label: 'Acceptée', icon: FaCheckCircle },
      'REJECTED': { color: 'bg-red-100 text-red-800', label: 'Refusée', icon: FaExclamationCircle },
      'PICKED_UP': { color: 'bg-yellow-100 text-yellow-800', label: 'Récupérée', icon: FaClock },
      'EN_ROUTE': { color: 'bg-orange-100 text-orange-800', label: 'En route', icon: FaTruck },
      'ARRIVED': { color: 'bg-teal-100 text-teal-800', label: 'Arrivé', icon: FaMapMarkerAlt },
      'IN_TRANSIT': { color: 'bg-purple-100 text-purple-800', label: 'En transit', icon: FaTruck },
      'DELIVERED': { color: 'bg-green-100 text-green-800', label: 'Livrée', icon: FaCheckCircle },
      'FAILED': { color: 'bg-red-100 text-red-800', label: 'Échec', icon: FaExclamationCircle },
      'CANCELED': { color: 'bg-gray-100 text-gray-800', label: 'Annulée', icon: FaExclamationCircle }
    };
    const { color, label, icon: Icon } = config[status] || config['ASSIGNED'];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${color} flex items-center gap-1`}>
        <Icon className="text-xs" />
        {label}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeElapsed = (dateString) => {
    if (!dateString) return '-';
    const now = new Date();
    const assignedDate = new Date(dateString);
    const diffMs = now - assignedDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}min`;
    }
    return `${diffMins}min`;
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Suivi des Livraisons</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Auto: 30s</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
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
            <option value="all">Tous les statuts</option>
            <option value="PICKUP_PENDING">En attente</option>
            <option value="ASSIGNED">Assignées</option>
            <option value="ACCEPTED">Acceptées</option>
            <option value="REJECTED">Refusées</option>
            <option value="PICKED_UP">Récupérées</option>
            <option value="EN_ROUTE">En route</option>
            <option value="ARRIVED">Arrivées</option>
            <option value="IN_TRANSIT">En transit</option>
            <option value="DELIVERED">Livrées</option>
            <option value="FAILED">Échecs</option>
            <option value="CANCELED">Annulées</option>
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

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'En attente', value: deliveries.filter(d => d.status === 'PICKUP_PENDING').length, color: 'bg-gray-500', icon: FaClock },
          { label: 'Assignées', value: deliveries.filter(d => d.status === 'ASSIGNED').length, color: 'bg-blue-500', icon: FaTruck },
          { label: 'En cours', value: deliveries.filter(d => ['ACCEPTED', 'PICKED_UP', 'EN_ROUTE', 'ARRIVED', 'IN_TRANSIT'].includes(d.status)).length, color: 'bg-purple-500', icon: FaClock },
          { label: 'Livrées', value: deliveries.filter(d => d.status === 'DELIVERED').length, color: 'bg-green-500', icon: FaCheckCircle },
          { label: 'Total', value: deliveries.length, color: 'bg-indigo-500', icon: FaCalendarAlt }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-md shadow">
            <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white text-xl font-bold mb-2`}>
              {stat.value}
            </div>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Liste des livraisons */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-xl font-medium text-gray-700 pb-4">
          Livraisons ({filteredDeliveries.length})
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Zone</th>
                  <th className="py-3 px-4">Coursier</th>
                  <th className="py-3 px-4">Montant</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4">Assignée</th>
                  <th className="py-3 px-4">Livrée</th>
                  <th className="py-3 px-4">Durée</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((delivery) => {
                  const assignedTime = delivery.timestamps?.assignedAt ? new Date(delivery.timestamps.assignedAt) : null;
                  const deliveredTime = delivery.timestamps?.deliveredAt ? new Date(delivery.timestamps.deliveredAt) : null;
                  const duration = assignedTime ? Math.floor(((deliveredTime || new Date()) - assignedTime) / 60000) : 0;
                  
                  return (
                    <tr key={delivery._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">#{delivery._id?.slice(-8)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <FaUser className="text-gray-400" />
                          <div>
                            <div className="font-medium">{delivery.dropoff?.contactName}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <FaPhone className="mr-1" />
                              {delivery.dropoff?.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span className="text-sm">{delivery.dropoff?.zone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <FaTruck className="text-gray-400" />
                          <span className="font-medium">{delivery.assignedCourier?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <FaMoneyBillWave className="text-green-500" />
                          <span className="font-medium">{delivery.amounts?.cod || 0} XOF</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(delivery.status)}</td>
                      <td className="py-3 px-4 text-sm">{formatDateTime(delivery.timestamps?.assignedAt)}</td>
                      <td className="py-3 px-4 text-sm">{formatDateTime(delivery.timestamps?.deliveredAt)}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium ${duration > 120 ? 'text-red-600' : 'text-gray-600'}`}>
                          {duration}min
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setSelectedDelivery(delivery);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Détails"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredDeliveries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune livraison trouvée
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Détails */}
      {showDetailsModal && selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Détails de la livraison #{selectedDelivery._id?.slice(-8)}</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">📦 Récupération</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm"><strong>Contact:</strong> {selectedDelivery.pickup?.contactName}</p>
                    <p className="text-sm"><strong>Téléphone:</strong> {selectedDelivery.pickup?.phone}</p>
                    <p className="text-sm"><strong>Adresse:</strong> {selectedDelivery.pickup?.addressText}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">🚚 Livraison</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm"><strong>Contact:</strong> {selectedDelivery.dropoff?.contactName}</p>
                    <p className="text-sm"><strong>Téléphone:</strong> {selectedDelivery.dropoff?.phone}</p>
                    <p className="text-sm"><strong>Adresse:</strong> {selectedDelivery.dropoff?.addressText}</p>
                    <p className="text-sm"><strong>Zone:</strong> {selectedDelivery.dropoff?.zone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">👤 Coursier</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm"><strong>Nom:</strong> {selectedDelivery.assignedCourier?.name || 'N/A'}</p>
                    <p className="text-sm"><strong>Téléphone:</strong> {selectedDelivery.assignedCourier?.phone || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">💰 Montants</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm"><strong>Frais:</strong> {selectedDelivery.amounts?.fee || 0} XOF</p>
                    <p className="text-sm"><strong>COD:</strong> {selectedDelivery.amounts?.cod || 0} XOF</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">⏱️ Historique des statuts</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm space-y-1 max-h-64 overflow-y-auto">
                    <p><strong>Créée:</strong> {formatDateTime(selectedDelivery.createdAt)}</p>
                    {selectedDelivery.timestamps?.pickupPendingAt && <p><strong>En attente:</strong> {formatDateTime(selectedDelivery.timestamps.pickupPendingAt)}</p>}
                    {selectedDelivery.timestamps?.assignedAt && <p><strong>Assignée:</strong> {formatDateTime(selectedDelivery.timestamps.assignedAt)}</p>}
                    {selectedDelivery.timestamps?.acceptedAt && <p className="text-green-600"><strong>Acceptée:</strong> {formatDateTime(selectedDelivery.timestamps.acceptedAt)}</p>}
                    {selectedDelivery.timestamps?.rejectedAt && <p className="text-red-600"><strong>Refusée:</strong> {formatDateTime(selectedDelivery.timestamps.rejectedAt)}</p>}
                    {selectedDelivery.timestamps?.pickedUpAt && <p><strong>Récupérée:</strong> {formatDateTime(selectedDelivery.timestamps.pickedUpAt)}</p>}
                    {selectedDelivery.timestamps?.enRouteAt && <p><strong>En route:</strong> {formatDateTime(selectedDelivery.timestamps.enRouteAt)}</p>}
                    {selectedDelivery.timestamps?.arrivedAt && <p><strong>Arrivée:</strong> {formatDateTime(selectedDelivery.timestamps.arrivedAt)}</p>}
                    {selectedDelivery.timestamps?.inTransitAt && <p><strong>En transit:</strong> {formatDateTime(selectedDelivery.timestamps.inTransitAt)}</p>}
                    {selectedDelivery.timestamps?.deliveredAt && <p className="text-green-600"><strong>Livrée:</strong> {formatDateTime(selectedDelivery.timestamps.deliveredAt)}</p>}
                    {selectedDelivery.timestamps?.failedAt && <p className="text-red-600"><strong>Échec:</strong> {formatDateTime(selectedDelivery.timestamps.failedAt)}</p>}
                    {selectedDelivery.timestamps?.canceledAt && <p className="text-gray-600"><strong>Annulée:</strong> {formatDateTime(selectedDelivery.timestamps.canceledAt)}</p>}
                  </div>
                </div>
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

export default DeliveryTracking;