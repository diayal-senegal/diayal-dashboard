import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DeliveryCreate = () => {
    const navigate = useNavigate();
    const { userInfo, token } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [couriers, setCouriers] = useState([]);
    const [formData, setFormData] = useState({
        orderId: '',
        sellerId: '',
        customerId: '',
        pickup: {
            contactName: '',
            phone: '',
            addressText: '',
            zone: ''
        },
        dropoff: {
            contactName: '',
            phone: '',
            addressText: '',
            zone: ''
        },
        codAmount: 0,
        notes: '',
        priority: 0,
        assignToCourier: ''
    });

    useEffect(() => {
        loadCouriers();
    }, []);

    const loadCouriers = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/couriers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setCouriers(data || []);
        } catch (error) {
            console.error('Erreur chargement couriers:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Créer la livraison
            const response = await fetch(`${API_URL}/api/admin/deliveries`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId: formData.orderId || '000000000000000000000001',
                    sellerId: formData.sellerId || '000000000000000000000001',
                    customerId: formData.customerId || '000000000000000000000001',
                    pickup: formData.pickup,
                    dropoff: formData.dropoff,
                    codAmount: parseInt(formData.codAmount) || 0,
                    notes: formData.notes,
                    priority: parseInt(formData.priority)
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Livraison créée avec succès!');
                navigate('/admin/dashboard/delivery-queue');
            } else {
                alert(`Erreur: ${data.error || 'Erreur lors de la création'}`);
            }
        } catch (error) {
            alert('Erreur lors de la création de la livraison');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const zones = [
        'DAKAR_PLATEAU', 'DAKAR_MEDINA', 'DAKAR_PARCELLES',
        'DAKAR_LIBERTE', 'DAKAR_GRAND_YOFF', 'DAKAR_OUAKAM',
        'PIKINE_CENTRE', 'GUEDIAWAYE', 'RUFISQUE'
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Créer une livraison</h1>
                <button
                    onClick={() => navigate('/admin/dashboard/delivery-queue')}
                    className="text-gray-600 hover:text-gray-900"
                >
                    ← Retour
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-4xl">
                {/* Informations Pickup */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">📦 Point de collecte</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du contact *</label>
                            <input
                                type="text"
                                required
                                value={formData.pickup.contactName}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    pickup: { ...formData.pickup, contactName: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Ex: Boutique Diayal"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                            <input
                                type="tel"
                                required
                                value={formData.pickup.phone}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    pickup: { ...formData.pickup, phone: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="+221771234567"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                            <input
                                type="text"
                                required
                                value={formData.pickup.addressText}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    pickup: { ...formData.pickup, addressText: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Adresse complète"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Zone *</label>
                            <select
                                required
                                value={formData.pickup.zone}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    pickup: { ...formData.pickup, zone: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">Sélectionner une zone</option>
                                {zones.map(zone => (
                                    <option key={zone} value={zone}>{zone.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Informations Dropoff */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">🏠 Point de livraison</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du destinataire *</label>
                            <input
                                type="text"
                                required
                                value={formData.dropoff.contactName}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    dropoff: { ...formData.dropoff, contactName: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Ex: Mamadou Diallo"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                            <input
                                type="tel"
                                required
                                value={formData.dropoff.phone}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    dropoff: { ...formData.dropoff, phone: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="+221771234567"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                            <input
                                type="text"
                                required
                                value={formData.dropoff.addressText}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    dropoff: { ...formData.dropoff, addressText: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Adresse complète"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Zone *</label>
                            <select
                                required
                                value={formData.dropoff.zone}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    dropoff: { ...formData.dropoff, zone: e.target.value }
                                })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">Sélectionner une zone</option>
                                {zones.map(zone => (
                                    <option key={zone} value={zone}>{zone.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Détails supplémentaires */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">📋 Détails</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Montant à collecter (XOF)</label>
                            <input
                                type="number"
                                value={formData.codAmount}
                                onChange={(e) => setFormData({ ...formData, codAmount: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="0">Normal</option>
                                <option value="1">Urgent</option>
                                <option value="2">Express</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                rows="3"
                                placeholder="Instructions spéciales..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/dashboard/delivery-queue')}
                        className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Création...' : 'Créer la livraison'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DeliveryCreate;
