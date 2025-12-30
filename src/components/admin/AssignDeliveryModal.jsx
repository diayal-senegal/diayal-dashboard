import React, { useState, useEffect } from 'react';

export default function AssignDeliveryModal({ delivery, onClose, onAssign }) {
  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailableCouriers();
  }, []);

  const loadAvailableCouriers = async () => {
    try {
      const response = await fetch('/api/admin/couriers?available=true');
      const data = await response.json();
      setCouriers(data);
    } catch (error) {
      console.error('Erreur chargement coursiers:', error);
    }
  };

  const handleAssign = async () => {
    if (!selectedCourier) {
      alert('Veuillez sélectionner un coursier');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/deliveries/${delivery._id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courierId: selectedCourier })
      });

      if (response.ok) {
        alert('Livraison assignée avec succès !');
        onAssign();
        onClose();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.message || 'Impossible d\'assigner'}`);
      }
    } catch (error) {
      alert('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Assigner la livraison</h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Récupération:</strong> {delivery.pickup?.addressText}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Livraison:</strong> {delivery.dropoff?.addressText}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Sélectionner un coursier disponible
          </label>
          <select
            value={selectedCourier}
            onChange={(e) => setSelectedCourier(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
          >
            <option value="">-- Choisir un coursier --</option>
            {couriers.map(courier => (
              <option key={courier._id} value={courier._id}>
                {courier.name} - {courier.zone} ({courier.vehicleType})
              </option>
            ))}
          </select>
          {couriers.length === 0 && (
            <p className="text-sm text-red-600 mt-2">
              Aucun coursier disponible
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded hover:bg-gray-100"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={handleAssign}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || !selectedCourier}
          >
            {loading ? 'Assignation...' : 'Assigner'}
          </button>
        </div>
      </div>
    </div>
  );
}