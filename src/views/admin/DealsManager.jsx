import React, { useState, useEffect } from 'react';
import { FaClock, FaPercent, FaTrash, FaPlus, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

// API pour gérer les deals - copie locale
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const dealsAPI = {
    getDeals: async () => {
        const response = await fetch(`${API_BASE}/deals`);
        return response.json();
    },
    getProducts: async () => {
        const response = await fetch(`${API_BASE}/products`);
        return response.json();
    },
    addFlashDeal: async (productId, discount, endTime) => {
        const response = await fetch(`${API_BASE}/deals/flash`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, discount, endTime })
        });
        return response.json();
    },
    addDailyDeal: async (productId) => {
        const response = await fetch(`${API_BASE}/deals/daily`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId })
        });
        return response.json();
    },
    removeDeal: async (dealId) => {
        const response = await fetch(`${API_BASE}/deals/${dealId}`, {
            method: 'DELETE'
        });
        return response.json();
    },
    setPromotionEndTime: async (endTime) => {
        const response = await fetch(`${API_BASE}/deals/promotion-timer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endTime })
        });
        return response.json();
    },
    getPromotionSettings: async () => {
        const response = await fetch(`${API_BASE}/deals/promotion-settings`);
        return response.json();
    }
};

const DealsManager = () => {
    const [products, setProducts] = useState([]);
    const [deals, setDeals] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [discount, setDiscount] = useState('');
    const [dealType, setDealType] = useState('flash');
    const [promotionEndTime, setPromotionEndTime] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchDeals();
        fetchPromotionSettings();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await dealsAPI.getProducts();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Erreur produits:', error);
        }
    };

    const fetchDeals = async () => {
        try {
            const data = await dealsAPI.getDeals();
            setDeals(data.adminDeals || []);
        } catch (error) {
            console.error('Erreur deals:', error);
        }
    };

    const fetchPromotionSettings = async () => {
        try {
            const data = await dealsAPI.getPromotionSettings();
            if (data.endTime) {
                const date = new Date(data.endTime);
                setPromotionEndTime(date.toISOString().slice(0, 16));
            }
        } catch (error) {
            console.error('Erreur paramètres:', error);
        }
    };

    const handleAddDeal = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (dealType === 'flash') {
                await dealsAPI.addFlashDeal(selectedProduct, discount, new Date(Date.now() + 24 * 60 * 60 * 1000));
                toast.success('Vente flash ajoutée !');
            } else {
                await dealsAPI.addDailyDeal(selectedProduct);
                toast.success('Produit ajouté à la sélection du jour !');
            }
            fetchDeals();
            setSelectedProduct('');
            setDiscount('');
        } catch (error) {
            toast.error('Erreur lors de l\'ajout');
        }
        setLoading(false);
    };

    const handleRemoveDeal = async (dealId) => {
        try {
            await dealsAPI.removeDeal(dealId);
            toast.success('Promotion supprimée !');
            fetchDeals();
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleUpdatePromotionTimer = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endTime = new Date(promotionEndTime).toISOString();
            await dealsAPI.setPromotionEndTime(endTime);
            toast.success('Compteur de promotion mis à jour !');
        } catch (error) {
            toast.error('Erreur lors de la mise à jour du compteur');
        }
        setLoading(false);
    };

    const flashDeals = deals.filter(deal => deal.type === 'flash');
    const dailyDeals = deals.filter(deal => deal.type === 'daily');

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 md:px-8 py-6'>
            {/* Header */}
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-gray-800 mb-2'>Gestion des Promotions</h1>
                <p className='text-gray-600'>Gérez les ventes flash, sélections du jour et le compteur de promotion</p>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
                <div className='bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-lg'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm font-medium text-gray-600 mb-1'>Ventes Flash</p>
                            <p className='text-3xl font-bold text-gray-800'>{flashDeals.length}</p>
                        </div>
                        <div className='w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center'>
                            <FaClock className='text-2xl text-white' />
                        </div>
                    </div>
                </div>

                <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm font-medium text-gray-600 mb-1'>Sélection du Jour</p>
                            <p className='text-3xl font-bold text-gray-800'>{dailyDeals.length}</p>
                        </div>
                        <div className='w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center'>
                            <FaPercent className='text-2xl text-white' />
                        </div>
                    </div>
                </div>

                <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm font-medium text-gray-600 mb-1'>Total Produits</p>
                            <p className='text-3xl font-bold text-gray-800'>{products.length}</p>
                        </div>
                        <div className='w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center'>
                            <FaPlus className='text-2xl text-white' />
                        </div>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
                {/* Formulaires */}
                <div className='space-y-6'>
                    {/* Ajouter Deal */}
                    <div className='bg-white rounded-2xl shadow-lg p-6'>
                        <h3 className='text-xl font-bold text-gray-800 mb-6 flex items-center gap-3'>
                            <FaPlus className='text-green-500' />
                            Ajouter une Promotion
                        </h3>
                        <form onSubmit={handleAddDeal} className='space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Type de promotion</label>
                                    <select 
                                        value={dealType} 
                                        onChange={(e) => setDealType(e.target.value)}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    >
                                        <option value="flash">Vente Flash</option>
                                        <option value="daily">Sélection du Jour</option>
                                    </select>
                                </div>
                                
                                {dealType === 'flash' && (
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Réduction (%)</label>
                                        <input 
                                            type="number" 
                                            value={discount} 
                                            onChange={(e) => setDiscount(e.target.value)}
                                            className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            min="1" 
                                            max="90"
                                            required
                                            placeholder="Ex: 30"
                                        />
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Produit</label>
                                <select 
                                    value={selectedProduct} 
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    required
                                >
                                    <option value="">Sélectionner un produit</option>
                                    {products.map(product => (
                                        <option key={product._id} value={product._id}>
                                            {product.name} - {product.price} FCFA
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={loading}
                                className='w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-300'
                            >
                                {loading ? 'Ajout...' : 'Ajouter la Promotion'}
                            </button>
                        </form>
                    </div>

                    {/* Compteur Promotion */}
                    <div className='bg-white rounded-2xl shadow-lg p-6'>
                        <h3 className='text-xl font-bold text-gray-800 mb-6 flex items-center gap-3'>
                            <FaCalendarAlt className='text-orange-500' />
                            Compteur de Promotion
                        </h3>
                        <form onSubmit={handleUpdatePromotionTimer} className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>Date et heure de fin</label>
                                <input 
                                    type="datetime-local" 
                                    value={promotionEndTime} 
                                    onChange={(e) => setPromotionEndTime(e.target.value)}
                                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className='w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 transition-all duration-300'
                            >
                                {loading ? 'Mise à jour...' : 'Mettre à jour le Compteur'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Liste des deals */}
                <div className='bg-white rounded-2xl shadow-lg p-6'>
                    <h3 className='text-xl font-bold text-gray-800 mb-6'>Promotions Actives ({deals.length})</h3>
                    <div className='space-y-4 max-h-96 overflow-y-auto'>
                        {deals.map(deal => (
                            <div key={deal._id} className='flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors'>
                                <div className='flex items-center gap-4'>
                                    {deal.type === 'flash' ? (
                                        <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
                                            <FaClock className='text-red-500' />
                                        </div>
                                    ) : (
                                        <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
                                            <FaPercent className='text-green-500' />
                                        </div>
                                    )}
                                    <div>
                                        <div className='font-semibold text-gray-900'>
                                            {deal.product?.name || 'Produit supprimé'}
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            {deal.product?.price ? `${deal.product.price} FCFA` : ''}
                                            {deal.type === 'flash' && (
                                                <span className='ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium'>
                                                    -{deal.discount}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleRemoveDeal(deal._id)}
                                    className='p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                                    title="Supprimer"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        {deals.length === 0 && (
                            <div className='text-center py-12 text-gray-500'>
                                <FaPercent className='mx-auto text-4xl mb-3 opacity-50' />
                                <p>Aucune promotion active</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealsManager;