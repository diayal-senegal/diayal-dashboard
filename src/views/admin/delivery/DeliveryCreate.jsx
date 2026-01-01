import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DeliveryCreate = () => {
    const navigate = useNavigate();
    const { token } = useSelector(state => state.auth);
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
            const payload = {
                orderId: formData.orderId || '000000000000000000000001',
                sellerId: formData.sellerId || '000000000000000000000001',
                customerId: formData.customerId || '000000000000000000000001',
                pickup: formData.pickup,
                dropoff: formData.dropoff,
                codAmount: parseInt(formData.codAmount) || 0,
                notes: formData.notes,
                priority: parseInt(formData.priority),
                courierId: formData.assignToCourier || null
            };

            console.log('📤 Envoi de la requête:', payload);
            console.log('🔑 Token présent:', !!token);
            console.log('🌐 URL:', `${API_URL}/api/admin/deliveries`);

            const response = await fetch(`${API_URL}/api/admin/deliveries`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            console.log('📥 Status:', response.status);
            const data = await response.json();
            console.log('📥 Réponse:', data);

            if (response.ok) {
                alert('Livraison créée avec succès!');
                navigate('/admin/dashboard/delivery-queue');
            } else {
                console.error('❌ Erreur backend:', data);
                alert(`Erreur: ${data.error || data.message || JSON.stringify(data)}`);
            }
        } catch (error) {
            console.error('❌ Erreur complète:', error);
            alert('Erreur lors de la création de la livraison');
        } finally {
            setLoading(false);
        }
    };

    const zones = [
        // Département de Dakar
        { label: 'Biscuiterie', value: 'Biscuiterie', dept: 'Dakar' },
        { label: 'Cambérène', value: 'Cambérène', dept: 'Dakar' },
        { label: 'Dakar-Plateau', value: 'Dakar-Plateau', dept: 'Dakar' },
        { label: 'Dieuppeul-Derklé', value: 'Dieuppeul-Derklé', dept: 'Dakar' },
        { label: 'Fann-Point E-Amitié', value: 'Fann-Point E-Amitié', dept: 'Dakar' },
        { label: 'Grand Dakar', value: 'Grand Dakar', dept: 'Dakar' },
        { label: 'Grand Yoff', value: 'Grand Yoff', dept: 'Dakar' },
        { label: 'Gueule Tapée-Fass-Colobane', value: 'Gueule Tapée-Fass-Colobane', dept: 'Dakar' },
        { label: 'Hann Bel-Air', value: 'Hann Bel-Air', dept: 'Dakar' },
        { label: 'HLM', value: 'HLM', dept: 'Dakar' },
        { label: 'Les Parcelles Assainies', value: 'Les Parcelles Assainies', dept: 'Dakar' },
        { label: 'Médina', value: 'Médina', dept: 'Dakar' },
        { label: 'Mermoz-Sacré-Cœur', value: 'Mermoz-Sacré-Cœur', dept: 'Dakar' },
        { label: 'Ngor', value: 'Ngor', dept: 'Dakar' },
        { label: 'Ouakam', value: 'Ouakam', dept: 'Dakar' },
        { label: 'Patte d\'Oie', value: 'Patte d\'Oie', dept: 'Dakar' },
        { label: 'Sicap-Liberté', value: 'Sicap-Liberté', dept: 'Dakar' },
        { label: 'Yoff', value: 'Yoff', dept: 'Dakar' },
        // Département de Pikine
        { label: 'Dalifort', value: 'Dalifort', dept: 'Pikine' },
        { label: 'Diamaguène Sicap Mbao', value: 'Diamaguène Sicap Mbao', dept: 'Pikine' },
        { label: 'Djidah Thiaroye Kaw', value: 'Djidah Thiaroye Kaw', dept: 'Pikine' },
        { label: 'Guinaw Rail Nord', value: 'Guinaw Rail Nord', dept: 'Pikine' },
        { label: 'Guinaw Rail Sud', value: 'Guinaw Rail Sud', dept: 'Pikine' },
        { label: 'Keur Massar', value: 'Keur Massar', dept: 'Pikine' },
        { label: 'Malika', value: 'Malika', dept: 'Pikine' },
        { label: 'Mbao', value: 'Mbao', dept: 'Pikine' },
        { label: 'Pikine Est', value: 'Pikine Est', dept: 'Pikine' },
        { label: 'Pikine Nord', value: 'Pikine Nord', dept: 'Pikine' },
        { label: 'Pikine Ouest', value: 'Pikine Ouest', dept: 'Pikine' },
        { label: 'Thiaroye Gare', value: 'Thiaroye Gare', dept: 'Pikine' },
        { label: 'Thiaroye-sur-Mer', value: 'Thiaroye-sur-Mer', dept: 'Pikine' },
        { label: 'Tivaouane Diacksao', value: 'Tivaouane Diacksao', dept: 'Pikine' },
        { label: 'Yeumbeul Nord', value: 'Yeumbeul Nord', dept: 'Pikine' },
        { label: 'Yeumbeul Sud', value: 'Yeumbeul Sud', dept: 'Pikine' },
        // Département de Guédiawaye
        { label: 'Golf Sud', value: 'Golf Sud', dept: 'Guédiawaye' },
        { label: 'Médina Gounass', value: 'Médina Gounass', dept: 'Guédiawaye' },
        { label: 'Ndiarème Limamoulaye', value: 'Ndiarème Limamoulaye', dept: 'Guédiawaye' },
        { label: 'Sam Notaire', value: 'Sam Notaire', dept: 'Guédiawaye' },
        { label: 'Wakhinane Nimzatt', value: 'Wakhinane Nimzatt', dept: 'Guédiawaye' },
        // Département de Rufisque
        { label: 'Rufisque Est', value: 'Rufisque Est', dept: 'Rufisque' },
        { label: 'Rufisque Nord', value: 'Rufisque Nord', dept: 'Rufisque' },
        { label: 'Rufisque Ouest', value: 'Rufisque Ouest', dept: 'Rufisque' },
        { label: 'Bargny', value: 'Bargny', dept: 'Rufisque' },
        { label: 'Sébikotane', value: 'Sébikotane', dept: 'Rufisque' },
        { label: 'Diamniadio', value: 'Diamniadio', dept: 'Rufisque' },
        { label: 'Sangalkam', value: 'Sangalkam', dept: 'Rufisque' },
        { label: 'Sendou', value: 'Sendou', dept: 'Rufisque' }
    ];

    const groupedZones = zones.reduce((acc, zone) => {
        if (!acc[zone.dept]) acc[zone.dept] = [];
        acc[zone.dept].push(zone);
        return acc;
    }, {});

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
                                {Object.entries(groupedZones).map(([dept, deptZones]) => (
                                    <optgroup key={dept} label={`Département de ${dept}`}>
                                        {deptZones.map(zone => (
                                            <option key={zone.value} value={zone.value}>{zone.label}</option>
                                        ))}
                                    </optgroup>
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
                                {Object.entries(groupedZones).map(([dept, deptZones]) => (
                                    <optgroup key={dept} label={`Département de ${dept}`}>
                                        {deptZones.map(zone => (
                                            <option key={zone.value} value={zone.value}>{zone.label}</option>
                                        ))}
                                    </optgroup>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assigner à un coursier</label>
                            <select
                                value={formData.assignToCourier}
                                onChange={(e) => setFormData({ ...formData, assignToCourier: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">Sélectionner un coursier (optionnel)</option>
                                {couriers.map(courier => (
                                    <option key={courier._id} value={courier._id}>
                                        {courier.name} - {courier.phone} ({courier.zone || 'Aucune zone'})
                                    </option>
                                ))}
                            </select>
                        </div>
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
