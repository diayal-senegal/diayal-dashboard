import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { get_promotional_settings, update_promotional_settings, messageClear } from '../../store/Reducers/promotionReducer';

const Promotions = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { promotionalSettings, successMessage, errorMessage, loader } = useSelector(state => state.promotion);
    
    const [promotionData, setPromotionData] = useState({
        isActive: false,
        message: '',
        minimumAmount: '',
        regions: []
    });

    useEffect(() => {
        if (userInfo?._id) {
            dispatch(get_promotional_settings(userInfo._id));
        }
    }, [dispatch, userInfo]);

    useEffect(() => {
        if (promotionalSettings) {
            setPromotionData({
                isActive: promotionalSettings.isActive || false,
                message: promotionalSettings.message || '',
                minimumAmount: promotionalSettings.minimumAmount || '',
                regions: promotionalSettings.regions || []
            });
        }
    }, [promotionalSettings]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    const availableRegions = [
        'Dakar', 'Thiès', 'Saint-Louis', 'Diourbel', 'Louga', 
        'Tambacounda', 'Kaolack', 'Ziguinchor', 'Fatick', 
        'Kolda', 'Matam', 'Kaffrine', 'Kédougou', 'Sédhiou'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPromotionData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRegionChange = (region) => {
        setPromotionData(prev => ({
            ...prev,
            regions: prev.regions.includes(region)
                ? prev.regions.filter(r => r !== region)
                : [...prev.regions, region]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userInfo?._id) {
            dispatch(update_promotional_settings({
                sellerId: userInfo._id,
                promotionData
            }));
        }
    };

    return (
        <div className="px-2 lg:px-7 pt-5">
            <div className="w-full p-4 bg-[#6a5fdf] rounded-md">
                <h1 className="text-[#d0d2d6] font-semibold text-lg mb-3">Gestion des Promotions</h1>
            </div>

            <div className="w-full bg-[#6a5fdf] rounded-md mt-6">
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-[#d0d2d6] font-semibold text-xl">Configuration Promotionnelle</h2>
                </div>

                <div className="p-4">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
                        {/* Activation Toggle */}
                        <div className="mb-6">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={promotionData.isActive}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-[#6a5fdf] rounded focus:ring-[#6a5fdf]"
                                />
                                <span className="text-lg font-medium text-gray-900">
                                    Activer les promotions
                                </span>
                            </label>
                        </div>

                        {/* Message promotionnel */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message promotionnel
                            </label>
                            <input
                                type="text"
                                name="message"
                                value={promotionData.message}
                                onChange={handleInputChange}
                                placeholder="Ex: Livraison gratuite à partir de 30 000 F"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6a5fdf] focus:border-transparent"
                                disabled={!promotionData.isActive}
                            />
                        </div>

                        {/* Montant minimum */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Montant minimum (FCFA)
                            </label>
                            <input
                                type="number"
                                name="minimumAmount"
                                value={promotionData.minimumAmount}
                                onChange={handleInputChange}
                                placeholder="30000"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6a5fdf] focus:border-transparent"
                                disabled={!promotionData.isActive}
                            />
                        </div>

                        {/* Régions */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Régions concernées
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {availableRegions.map(region => (
                                    <label key={region} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={promotionData.regions.includes(region)}
                                            onChange={() => handleRegionChange(region)}
                                            className="w-4 h-4 text-[#6a5fdf] rounded focus:ring-[#6a5fdf]"
                                            disabled={!promotionData.isActive}
                                        />
                                        <span className="text-sm text-gray-700">{region}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Aperçu */}
                        {promotionData.isActive && promotionData.message && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h4 className="text-sm font-medium text-green-800 mb-2">Aperçu du message :</h4>
                                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-md text-sm">
                                    🚚 {promotionData.message}
                                </div>
                            </div>
                        )}

                        {/* Bouton de sauvegarde */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loader}
                                className="px-6 py-2 bg-[#6a5fdf] text-white rounded-md hover:bg-[#5b52d6] focus:outline-none focus:ring-2 focus:ring-[#6a5fdf] focus:ring-offset-2 transition-colors disabled:opacity-50"
                            >
                                {loader ? 'Sauvegarde...' : 'Sauvegarder'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Promotions;