import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DeliveryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useSelector(state => state.auth);
    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDelivery();
    }, [id]);

    const loadDelivery = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/deliveries/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                setDelivery(data);
            }
        } catch (error) {
            console.error('Erreur chargement livraison:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6">Chargement...</div>;
    }

    if (!delivery) {
        return <div className="p-6">Livraison non trouvée</div>;
    }

    return (
        <div className="p-6">
            <button
                onClick={() => navigate('/admin/dashboard/delivery-queue')}
                className="mb-4 text-blue-600 hover:text-blue-800"
            >
                ← Retour à la liste
            </button>

            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6">Livraison #{delivery._id.slice(0, 8)}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-3">📦 Point de collecte</h2>
                        <p><strong>Contact:</strong> {delivery.pickup.contactName}</p>
                        <p><strong>Téléphone:</strong> {delivery.pickup.phone}</p>
                        <p><strong>Adresse:</strong> {delivery.pickup.addressText}</p>
                        <p><strong>Zone:</strong> {delivery.pickup.zone}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-3">🏠 Point de livraison</h2>
                        <p><strong>Contact:</strong> {delivery.dropoff.contactName}</p>
                        <p><strong>Téléphone:</strong> {delivery.dropoff.phone}</p>
                        <p><strong>Adresse:</strong> {delivery.dropoff.addressText}</p>
                        <p><strong>Zone:</strong> {delivery.dropoff.zone}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">📋 Détails</h2>
                    <p><strong>Statut:</strong> {delivery.status}</p>
                    <p><strong>Montant COD:</strong> {delivery.codAmount} XOF</p>
                    <p><strong>Priorité:</strong> {delivery.priority === 0 ? 'Normal' : delivery.priority === 1 ? 'Urgent' : 'Express'}</p>
                    {delivery.notes && <p><strong>Notes:</strong> {delivery.notes}</p>}
                    <p><strong>Créé le:</strong> {new Date(delivery.createdAt).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDetail;
