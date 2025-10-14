import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { admin_order_status_update, get_admin_order, messageClear } from '../../store/Reducers/OrderReducer';
import toast from 'react-hot-toast';

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('');
    const { order, errorMessage, successMessage } = useSelector(state => state.order);

    useEffect(() => {
        if (order?.delivery_status) {
            setStatus(order.delivery_status);
        }
    }, [order]);

    useEffect(() => {
        if (orderId) {
            console.log('Chargement commande ID:', orderId);
            dispatch(get_admin_order(orderId));
        } else {
            console.error('Aucun ID de commande fourni');
        }
    }, [orderId, dispatch]);



    const status_update = async (e) => {
        const newStatus = e.target.value;
        console.log('🔄 Admin: Mise à jour statut:', { orderId, oldStatus: order.delivery_status, newStatus });
        setStatus(newStatus);
        
        const result = await dispatch(admin_order_status_update({ orderId, info: { status: newStatus } }));
        console.log('✅ Admin: Résultat mise à jour:', result);
        
        // Rafraîchir la commande
        const refreshResult = await dispatch(get_admin_order(orderId));
        console.log('🔄 Admin: Commande rafraîchie:', refreshResult.payload?.order?.delivery_status);
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
            processing: 'bg-blue-100 text-blue-800',
            warehouse: 'bg-purple-100 text-purple-800',
            placed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const translateStatus = (status) => {
        const translations = {
            pending: 'En attente',
            processing: 'En cours de préparation',
            warehouse: 'Entrepôt/Magasin',
            placed: 'Passée',
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

    const formatDateFrench = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (!order) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des détails de la commande...</p>
                    {orderId && <p className="text-sm text-gray-400 mt-2">ID: {orderId}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-2xl font-bold text-white mb-2 sm:mb-0">
                            Détails de la commande (Admin)
                        </h1>
                        <select
                            onChange={status_update}
                            value={status || order?.delivery_status || 'pending'}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-700 font-medium"
                        >
                            <option value="pending">En attente</option>
                            <option value="processing">En cours de préparation</option>
                            <option value="warehouse">Entrepôt/Magasin</option>
                            <option value="placed">Passée</option>
                            <option value="cancelled">Annulée</option>
                        </select>
                    </div>
                </div>

                {/* Order Info */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4">
                            <span className="text-lg font-semibold text-gray-900">#{order._id}</span>
                            <span className="text-gray-500">{formatDateFrench(order.date)}</span>
                        </div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.delivery_status)}`}>
                            {translateStatus(order.delivery_status)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    {/* Customer & Shipping Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de livraison</h3>
                            <div className="space-y-3">
                                <div>
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
                                
                                {/* Seller Information */}
                                {order?.suborder && order.suborder.length > 0 && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Vendeurs impliqués</h4>
                                        <div className="space-y-1">
                                            {order.suborder.map((sub, index) => {
                                                const seller = order.sellers?.find(s => s._id.toString() === sub.sellerId.toString());
                                                return (
                                                    <div key={index} className="text-xs text-blue-800">
                                                        <span className="font-medium">Vendeur {index + 1}:</span> {seller?.name || `ID: ${sub.sellerId}`}
                                                        <span className="ml-2 text-blue-600">({sub.products?.length || 0} produit{sub.products?.length > 1 ? 's' : ''})</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Customer Information */}
                                {order?.customer && order.customer[0] && (
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <h4 className="text-sm font-semibold text-green-900 mb-2">Informations client</h4>
                                        <div className="text-xs text-green-800 space-y-1">
                                            <p><span className="font-medium">Nom:</span> {order.customer[0].name}</p>
                                            <p><span className="font-medium">Email:</span> {order.customer[0].email}</p>
                                            <p><span className="font-medium">Membre depuis:</span> {formatDateFrench(order.customer[0].createdAt)}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Order Summary */}
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Résumé de la commande</h4>
                                    <div className="space-y-1 text-xs text-gray-700">
                                        <div className="flex justify-between">
                                            <span>Nombre de vendeurs:</span>
                                            <span className="font-medium">{order?.suborder?.length || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total produits:</span>
                                            <span className="font-medium">{order?.products?.reduce((acc, p) => acc + p.quantity, 0) || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Date de commande:</span>
                                            <span className="font-medium">{formatDateFrench(order.createdAt || order.date)}</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-1 mt-2">
                                            <span className="font-medium">Statut paiement:</span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {translatePaymentStatus(order.payment_status)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t pt-1 mt-2">
                                            <span className="font-medium">Total:</span>
                                            <span className="text-lg font-bold text-gray-900">{order.price} FCFA</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Products */}
                        {order.products && order.products.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Produits de la commande</h3>
                                <div className="space-y-3">
                                    {order.products.map((product, index) => (
                                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                                            <div className="flex items-start space-x-3">
                                                <img
                                                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                        {product.name}
                                                    </h4>
                                                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                                                        <span>Marque: {product.brand}</span>
                                                        <span>Qté: {product.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Seller Orders */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Commandes par vendeur</h3>
                        <div className="space-y-4">
                            {order?.suborder?.map((subOrder, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="text-md font-semibold text-gray-900">
                                                {(() => {
                                                    const seller = order.sellers?.find(s => s._id.toString() === subOrder.sellerId.toString());
                                                    return seller?.shopInfo?.shopName || seller?.name || `Vendeur ${index + 1}`;
                                                })()}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                Article(s) vendu par ce vendeur
                                            </p>
                                        </div>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subOrder.delivery_status)}`}>
                                            {translateStatus(subOrder.delivery_status)}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {subOrder.products?.map((product, productIndex) => (
                                            <div key={productIndex} className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex items-start space-x-3">
                                                    <img
                                                        className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="text-sm font-medium text-gray-900 truncate">
                                                            {product.name}
                                                        </h5>
                                                        <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
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
                                    
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <span className="text-sm font-medium text-gray-500">Prix de cette commande: </span>
                                        <span className="text-lg font-bold text-gray-900">{subOrder.price} FCFA</span>
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