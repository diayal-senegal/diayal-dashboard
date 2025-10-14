import React, { useState } from 'react';
import MobilePayment from './MobilePayment';

const Checkout = ({ orderData }) => {
    const [showMobilePayment, setShowMobilePayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('mobile');

    const paymentMethods = [
        { 
            id: 'mobile', 
            name: 'Paiement Mobile', 
            description: 'Orange Money, Free Money, E-Money',
            icon: '📱'
        },
        { 
            id: 'card', 
            name: 'Paiement par Carte', 
            description: 'Visa, MasterCard via PayDunya',
            icon: '💳'
        }
    ];

    const handlePayment = () => {
        if (paymentMethod === 'mobile') {
            setShowMobilePayment(true);
        } else {
            // Traitement paiement par carte
            setShowMobilePayment(true);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Finaliser la commande</h2>
            
            {/* Résumé de la commande */}
            <div className="mb-6 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Résumé de la commande</h3>
                <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-bold text-xl">{orderData?.total || 0} FCFA</span>
                </div>
            </div>

            {/* Méthodes de paiement */}
            <div className="mb-6">
                <h3 className="font-semibold mb-4">Choisir le mode de paiement</h3>
                <div className="space-y-3">
                    {paymentMethods.map(method => (
                        <label key={method.id} className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={paymentMethod === method.id}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="mr-4"
                            />
                            <div className="flex-1">
                                <div className="flex items-center">
                                    <span className="mr-2 text-xl">{method.icon}</span>
                                    <span className="font-medium">{method.name}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Bouton de paiement */}
            <button
                onClick={handlePayment}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
                {paymentMethod === 'mobile' ? 'Procéder au paiement mobile' : 'Procéder au paiement par carte'}
            </button>

            {/* Modal de paiement */}
            {showMobilePayment && (
                <MobilePayment
                    orderId={orderData?.orderId}
                    amount={orderData?.total}
                    paymentType={paymentMethod}
                    onClose={() => setShowMobilePayment(false)}
                />
            )}
        </div>
    );
};

export default Checkout;