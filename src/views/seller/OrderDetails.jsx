import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { get_seller_order, messageClear, seller_order_status_update } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('');
    const { order, errorMessage, successMessage } = useSelector(state => state.order);
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        if (order?.delivery_status) {
            setStatus(order.delivery_status);
        }
    }, [order]);

    useEffect(() => {
        dispatch(get_seller_order(orderId));
    }, [orderId, dispatch]);

    const status_update = async (e) => {
        setStatus(e.target.value);
        await dispatch(seller_order_status_update({ orderId, info: { status: e.target.value } }));
        dispatch(get_seller_order(orderId));
    };

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

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            warehouse: 'bg-blue-100 text-blue-800',
            shipping: 'bg-purple-100 text-purple-800',
            placed: 'bg-green-100 text-green-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const translateStatus = (status) => {
        const translations = {
            pending: 'En attente',
            warehouse: 'En cours de préparation',
            shipping: 'En cours de livraison',
            placed: 'Passée',
            delivered: 'Livrée',
            cancelled: 'Annulée'
        };
        return translations[status] || status;
    };

    const translatePaymentStatus = (status) => {
        const translations = {
            paid: 'Payé',
            unpaid: 'Non payé',
            pending: 'En attente'
        };
        return translations[status] || status;
    };

    if (!order) return <div className="flex justify-center items-center h-64">Chargement...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-2xl font-bold text-white mb-2 sm:mb-0">
                            Détails de la commande
                        </h1>
                        <select
                            onChange={status_update}
                            value={status || order?.delivery_status || 'pending'}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-700 font-medium"
                        >
                            <option value="placed">Passée</option>
                            <option value="pending">En attente</option>
                            <option value="warehouse">En cours de préparation</option>
                            <option value="shipping">En cours de livraison</option>
                            <option value="delivered">Livrée</option>
                            <option value="cancelled">Annulée</option>
                        </select>
                    </div>
                </div>

                {/* Order Info */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4">
                            <span className="text-lg font-semibold text-gray-900">#{order._id}</span>
                            <span className="text-gray-500">{order.date}</span>
                        </div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.delivery_status)}`}>
                            {translateStatus(order.delivery_status)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    {/* Shipping Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de livraison</h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Adresse de livraison:</span>
                                    {typeof order.shippingInfo === 'object' ? (
                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-slate-600 font-semibold pb-2">Livraison chez : {order.shippingInfo?.name}</h2>
                                            <div className="bg-gray-100 p-3 rounded-lg">
                                                <span className="bg-blue-200 text-blue-500 text-sm font-medium mr-2 py-1 px-2 rounded">Domicile</span>
                                                <div className="mt-2 text-sm text-gray-700">
                                                    <p><strong>Adresse :</strong> {order.shippingInfo?.adress}</p>
                                                    <p><strong>Ville/Commune :</strong> {order.shippingInfo?.city}</p>
                                                    <p><strong>Région :</strong> {order.shippingInfo?.region}</p>
                                                    <p><strong>Téléphone :</strong> {order.shippingInfo?.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-900">{order.shippingInfo}</p>
                                    )}
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Statut paiement:</span>
                                    <span className={`ml-2 inline-flex px-2 py-1 rounded text-sm font-medium ${
                                        order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {translatePaymentStatus(order.payment_status)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-500">Total:</span>
                                    <span className="ml-2 text-lg font-bold text-gray-900">{order.price} FCFA</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Produits commandés</h3>
                        <div className="space-y-4">
                            {order?.products?.map((product, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start space-x-4">
                                        <img
                                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                            src={product.images[0]}
                                            alt={product.name}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-medium text-gray-900 truncate">
                                                {product.name}
                                            </h4>
                                            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                                                <span>
                                                    <span className="font-medium">Marque:</span> {product.brand}
                                                </span>
                                                <span>
                                                    <span className="font-medium">Quantité:</span> {product.quantity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;