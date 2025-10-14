import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verify_payment } from '../../store/Reducers/OrderReducer';

const PaymentStatus = () => {
    const { transactionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Vérification du paiement...');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const result = await dispatch(verify_payment(transactionId));
                if (result.payload.success) {
                    setStatus('success');
                    setMessage('Paiement effectué avec succès !');
                    setTimeout(() => navigate('/orders'), 3000);
                } else {
                    setStatus('failed');
                    setMessage('Échec du paiement. Veuillez réessayer.');
                }
            } catch (error) {
                setStatus('failed');
                setMessage('Erreur lors de la vérification du paiement.');
            }
        };

        if (transactionId) {
            verifyPayment();
        }
    }, [transactionId, dispatch, navigate]);

    const getStatusIcon = () => {
        switch (status) {
            case 'loading':
                return '⏳';
            case 'success':
                return '✅';
            case 'failed':
                return '❌';
            default:
                return '⏳';
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'success':
                return 'text-green-600';
            case 'failed':
                return 'text-red-600';
            default:
                return 'text-blue-600';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">
                    {getStatusIcon()}
                </div>
                <h2 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
                    {status === 'loading' && 'Vérification...'}
                    {status === 'success' && 'Paiement réussi !'}
                    {status === 'failed' && 'Paiement échoué'}
                </h2>
                <p className="text-gray-600 mb-6">{message}</p>
                
                {status === 'success' && (
                    <div className="text-sm text-gray-500">
                        Redirection automatique dans 3 secondes...
                    </div>
                )}
                
                {status === 'failed' && (
                    <button
                        onClick={() => navigate('/checkout')}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Réessayer
                    </button>
                )}
            </div>
        </div>
    );
};

export default PaymentStatus;