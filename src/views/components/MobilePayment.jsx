import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { initiate_mobile_payment } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';

const MobilePayment = ({ orderId, amount, onClose, paymentType = 'mobile' }) => {
    const dispatch = useDispatch();
    const [paymentData, setPaymentData] = useState({
        provider: paymentType === 'mobile' ? 'orange-money-senegal' : 'card',
        phoneNumber: '',
        customerName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });
    const [loading, setLoading] = useState(false);

    const mobileProviders = [
        { value: 'orange-money-senegal', label: 'Orange Money', icon: '🟠' },
        { value: 'free-money', label: 'Free Money', icon: '🔵' },
        { value: 'e-money', label: 'E-Money', icon: '🟢' }
    ];

    const cardProviders = [
        { value: 'visa', label: 'Visa', icon: '💳' },
        { value: 'mastercard', label: 'MasterCard', icon: '💳' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (paymentType === 'mobile' && (!paymentData.phoneNumber || !paymentData.customerName)) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }
        if (paymentType === 'card' && (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.customerName)) {
            toast.error('Veuillez remplir tous les champs de la carte');
            return;
        }

        setLoading(true);
        try {
            const paymentPayload = {
                orderId,
                amount,
                provider: paymentData.provider,
                customerName: paymentData.customerName,
                paymentType
            };
            
            if (paymentType === 'mobile') {
                paymentPayload.phoneNumber = paymentData.phoneNumber;
            } else {
                paymentPayload.cardNumber = paymentData.cardNumber;
                paymentPayload.expiryDate = paymentData.expiryDate;
                paymentPayload.cvv = paymentData.cvv;
            }
            
            await dispatch(initiate_mobile_payment(paymentPayload));
        } catch (error) {
            toast.error('Erreur lors du paiement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{paymentType === 'mobile' ? 'Paiement Mobile' : 'Paiement par Carte'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <div className="mb-4 p-3 bg-gray-100 rounded">
                    <p className="text-sm text-gray-600">Montant à payer</p>
                    <p className="text-2xl font-bold text-green-600">{amount} FCFA</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {paymentType === 'mobile' ? (
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Opérateur</label>
                            <div className="grid grid-cols-1 gap-2">
                                {mobileProviders.map(provider => (
                                    <label key={provider.value} className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="provider"
                                            value={provider.value}
                                            checked={paymentData.provider === provider.value}
                                            onChange={(e) => setPaymentData({...paymentData, provider: e.target.value})}
                                            className="mr-3"
                                        />
                                        <span className="mr-2">{provider.icon}</span>
                                        <span>{provider.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Type de carte</label>
                            <div className="grid grid-cols-2 gap-2">
                                {cardProviders.map(provider => (
                                    <label key={provider.value} className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="provider"
                                            value={provider.value}
                                            checked={paymentData.provider === provider.value}
                                            onChange={(e) => setPaymentData({...paymentData, provider: e.target.value})}
                                            className="mr-3"
                                        />
                                        <span className="mr-2">{provider.icon}</span>
                                        <span>{provider.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Nom complet</label>
                        <input
                            type="text"
                            value={paymentData.customerName}
                            onChange={(e) => setPaymentData({...paymentData, customerName: e.target.value})}
                            className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
                            placeholder="Votre nom complet"
                            required
                        />
                    </div>

                    {paymentType === 'mobile' ? (
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Numéro de téléphone</label>
                            <input
                                type="tel"
                                value={paymentData.phoneNumber}
                                onChange={(e) => setPaymentData({...paymentData, phoneNumber: e.target.value})}
                                className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
                                placeholder="77 123 45 67"
                                required
                            />
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Numéro de carte</label>
                                <input
                                    type="text"
                                    value={paymentData.cardNumber}
                                    onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                                    className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Date d'expiration</label>
                                    <input
                                        type="text"
                                        value={paymentData.expiryDate}
                                        onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                                        className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
                                        placeholder="MM/AA"
                                        maxLength="5"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">CVV</label>
                                    <input
                                        type="text"
                                        value={paymentData.cvv}
                                        onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                                        className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
                                        placeholder="123"
                                        maxLength="4"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Traitement...' : 'Payer maintenant'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MobilePayment;