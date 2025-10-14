import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get_seller, seller_status_update, messageClear } from '../../store/Reducers/sellerReducer';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const SellerDetails = () => {
    const dispatch = useDispatch();
    const { seller, successMessage } = useSelector(state => state.seller);
    const { sellerId } = useParams();
    const [status, setStatus] = useState('');

    useEffect(() => {
        dispatch(get_seller(sellerId));
    }, [sellerId, dispatch]);

    const submit = (e) => {
        e.preventDefault();
        dispatch(seller_status_update({
            sellerId,
            status
        }));
    }    
    
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
    }, [successMessage, dispatch]);

    useEffect(() => {
        if (seller) {
            setStatus(seller.status);
        }
    }, [seller]);
           
    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[20px] font-bold mb-3'>
                Détails du vendeur
            </h1>
            
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <div className='w-full flex flex-wrap text-[#d0d2d6]'>
                    <div className='w-3/12 flex justify-center items-center py-3'>
                        <div>
                            {
                                seller?.image ? <img src={seller.image} alt='' className='w-full h-[230px]' /> : 
                                <span>Image non chargée</span>
                            }
                        </div>
                    </div>

                    <div className='w-3/12'>
                        <div className='px-0 md:px-5 py-2'>
                            <div className='py-2 text-lg'>
                                <h2>Informations de base</h2>
                            </div>
                            <div className='flex justify-between text-sm flex-col gap-2 p-4 bg-[#9e97e9] rounded-md'>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Nom : </span>
                                    <span>{seller?.name}</span>
                                </div>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Email : </span>
                                    <span>{seller?.email}</span>
                                </div>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Rôle : </span>
                                    <span>{seller?.role}</span>
                                </div>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Statut : </span>
                                    <span>{seller?.status}</span>
                                </div>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Statut paiement : </span>
                                    <span>{seller?.payment}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-3/12'>
                        <div className='px-0 md:px-5 py-2'>
                            <div className='py-2 text-lg'>
                                <h2>Adresse</h2>
                            </div>
                            <div className='flex justify-between text-sm flex-col gap-2 p-4 bg-[#9e97e9] rounded-md'>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Nom de la boutique : </span>
                                    <span>{seller?.shopInfo?.shopName}</span>
                                </div>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Région : </span>
                                    <span>{seller?.shopInfo?.division}</span>
                                </div>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Département : </span>
                                    <span>{seller?.shopInfo?.district}</span>
                                </div>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Comune : </span>
                                    <span>{seller?.shopInfo?.sub_district}</span>
                                </div>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Rue : </span>
                                    <span>{seller?.shopInfo?.street || 'Non renseigné'}</span>
                                </div>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Téléphone : </span>
                                    <span>{seller?.shopInfo?.phone || 'Non renseigné'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-3/12'>
                        <div className='px-0 md:px-5 py-2'>
                            <div className='py-2 text-lg'>
                                <h2>Paiement mobile</h2>
                            </div>
                            <div className='flex justify-between text-sm flex-col gap-2 p-4 bg-[#9e97e9] rounded-md'>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Fournisseur : </span>
                                    <span>{seller?.mobilePaymentInfo?.provider ? (seller.mobilePaymentInfo.provider === 'orange_money' ? 'Orange Money' : seller.mobilePaymentInfo.provider === 'wave' ? 'Wave' : seller.mobilePaymentInfo.provider === 'free_money' ? 'Free Money' : 'MTN Money') : 'Non configuré'}</span>
                                </div>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Numéro : </span>
                                    <span>{seller?.mobilePaymentInfo?.phoneNumber || 'Non configuré'}</span>
                                </div>
                                <div className='flex gap-2 font-bold text-[#000000]'>
                                    <span>Nom du compte : </span>
                                    <span>{seller?.mobilePaymentInfo?.accountName || 'Non configuré'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <form onSubmit={submit}>
                        <div className='flex gap-4 py-3'>
                            <select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)} 
                                className='px-4 py-2 focus:border-indigo-500 rounded-md outline-none bg-[#6a5fdf] border border-slate-700 text-[#d0d2d6]' 
                                required 
                            >
                                <option value="">--Sélectionner le statut--</option>
                                <option value="active">Activer</option>
                                <option value="deactive">Désactiver</option>
                            </select>
                            <button className='bg-red-500 hover:shadow-red-700/40 hover:shadow-md text-[#d0d2d6] rounded-md px-7 py-2 mb-3'>
                                Confirmer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellerDetails;