import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_product } from '../../store/Reducers/productReducer';
import { FaArrowLeft } from 'react-icons/fa';

const ProductDetails = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const { product } = useSelector(state => state.product);

    useEffect(() => {
        dispatch(get_product(productId));
    }, [productId, dispatch]);

    if (!product) {
        return <div className='px-2 lg:px-7 pt-5'>Chargement...</div>;
    }

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='flex items-center justify-between mb-5'>
                <h1 className='text-[#000000] font-semibold text-lg'>Détails du Produit</h1>
                <Link to='/seller/dashboard/products' className='bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-md px-7 py-2 flex items-center gap-2'>
                    <FaArrowLeft /> Retour
                </Link>
            </div>

            <div className='w-full p-6 bg-[#6a5fdf] rounded-md'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Images */}
                    <div>
                        <h2 className='text-[#d0d2d6] text-lg font-semibold mb-3'>Images</h2>
                        <div className='grid grid-cols-2 gap-3'>
                            {product.images?.map((img, i) => (
                                <img key={i} className='w-full h-[200px] object-cover rounded-md' src={img} alt={`Product ${i + 1}`} />
                            ))}
                        </div>
                    </div>

                    {/* Informations */}
                    <div className='text-[#d0d2d6]'>
                        <h2 className='text-lg font-semibold mb-3'>Informations</h2>
                        <div className='space-y-3'>
                            <div>
                                <span className='font-semibold'>Nom:</span>
                                <p className='mt-1'>{product.name}</p>
                            </div>
                            <div>
                                <span className='font-semibold'>Catégorie:</span>
                                <p className='mt-1'>{product.category}</p>
                            </div>
                            <div>
                                <span className='font-semibold'>Marque:</span>
                                <p className='mt-1'>{product.brand}</p>
                            </div>
                            <div>
                                <span className='font-semibold'>Prix:</span>
                                <p className='mt-1'>{product.price} FCFA</p>
                            </div>
                            <div>
                                <span className='font-semibold'>Réduction:</span>
                                <p className='mt-1'>{product.discount}%</p>
                            </div>
                            <div>
                                <span className='font-semibold'>Stock:</span>
                                <p className='mt-1'>{product.stock}</p>
                            </div>
                            {product.isPreOrder && (
                                <div>
                                    <span className='font-semibold'>Précommande:</span>
                                    <p className='mt-1 text-amber-300'>Disponible en précommande</p>
                                    {product.preOrderDate && (
                                        <p className='text-sm mt-1'>Date estimée: {new Date(product.preOrderDate).toLocaleDateString('fr-FR')}</p>
                                    )}
                                </div>
                            )}
                            <div>
                                <span className='font-semibold'>Description:</span>
                                <p className='mt-1'>{product.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
