import React, { useEffect, useState } from 'react';
import { FaImages } from "react-icons/fa6";
import { FadeLoader } from 'react-spinners';
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { profile_image_upload,messageClear,profile_info_add, change_password } from '../../store/Reducers/authReducer'
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils'; 
import { create_stripe_connect_account } from '../../store/Reducers/sellerReducer';
import { add_mobile_payment_info, get_mobile_payment_info } from '../../store/Reducers/PaymentReducer';
import { get_all_categories } from '../../store/Reducers/categoryReducer';

const Profile = () => {

    const [state, setState] =  useState({
        division: '',
        district: '',
        shopName: '',
        sub_district: '',
        street: '',
        phone: '',
        sector: ''
    })

    const [editMode, setEditMode] = useState(false)
    const [userEditMode, setUserEditMode] = useState(false)
    const [editData, setEditData] = useState({
        name: '',
        email: '',
        shopName: '',
        division: '',
        district: '',
        sub_district: '',
        street: '',
        phone: ''
    })
    const [userEditData, setUserEditData] = useState({
        name: '',
        email: ''
    })
    
    const [mobilePaymentData, setMobilePaymentData] = useState({
        phoneNumber: '',
        provider: '',
        accountName: ''
    })
    const [showMobilePaymentForm, setShowMobilePaymentForm] = useState(false)

    const dispatch = useDispatch()
    const { userInfo,loader,successMessage,errorMessage } = useSelector(state => state.auth)
    const { mobilePaymentInfo, loader: paymentLoader } = useSelector(state => state.payment)
    const { allCategories } = useSelector(state => state.category)
  

    useEffect(() => {
        dispatch(get_mobile_payment_info())
        dispatch(get_all_categories())
        if (userInfo) {
            setUserEditData({
                name: userInfo.name || '',
                email: userInfo.email || ''
            })
            if (userInfo.shopInfo) {
                setEditData({
                    name: userInfo.name || '',
                    email: userInfo.email || '',
                    shopName: userInfo.shopInfo.shopName || '',
                    division: userInfo.shopInfo.division || '',
                    district: userInfo.shopInfo.district || '',
                    sub_district: userInfo.shopInfo.sub_district || '',
                    street: userInfo.shopInfo.street || '',
                    phone: userInfo.shopInfo.phone || '',
                    sector: userInfo.shopInfo.sector || ''
                })
            }
        }
        if (successMessage) {
            toast.success(successMessage)
            messageClear() 
        } 
    },[successMessage, userInfo, dispatch])

    const add_image = (e) => {
        if (e.target.files.length > 0) { 
            const formData = new FormData()
            formData.append('image',e.target.files[0])
            dispatch(profile_image_upload(formData))
        }

    }

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const add = (e) => {
        e.preventDefault()
        dispatch(profile_info_add(state))
    }

    const handleEdit = () => {
        setEditMode(true)
    }

    const handleSaveEdit = (e) => {
        e.preventDefault()
        dispatch(profile_info_add(editData))
        setEditMode(false)
    }

    const handleCancelEdit = () => {
        setEditMode(false)
        setEditData({
            name: userInfo.name || '',
            email: userInfo.email || '',
            shopName: userInfo.shopInfo?.shopName || '',
            division: userInfo.shopInfo?.division || '',
            district: userInfo.shopInfo?.district || '',
            sub_district: userInfo.shopInfo?.sub_district || '',
            street: userInfo.shopInfo?.street || '',
            phone: userInfo.shopInfo?.phone || ''
        })
    }

    const editInputHandle = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        })
    }

    const handleUserEdit = () => {
        setUserEditMode(true)
    }

    const handleUserSaveEdit = (e) => {
        e.preventDefault()
        // Ici vous pouvez ajouter une action Redux pour mettre à jour les infos utilisateur
        // dispatch(update_user_info(userEditData))
        setUserEditMode(false)
        toast.success('Fonctionnalité à implémenter côté backend')
    }

    const handleUserCancelEdit = () => {
        setUserEditMode(false)
        setUserEditData({
            name: userInfo.name || '',
            email: userInfo.email || ''
        })
    }

    const userEditInputHandle = (e) => {
        setUserEditData({
            ...userEditData,
            [e.target.name]: e.target.value
        })
    }

    const handleMobilePaymentSubmit = (e) => {
        e.preventDefault()
        dispatch(add_mobile_payment_info(mobilePaymentData))
        setShowMobilePaymentForm(false)
    }

    const mobilePaymentInputHandle = (e) => {
        setMobilePaymentData({
            ...mobilePaymentData,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (mobilePaymentInfo) {
            setMobilePaymentData({
                phoneNumber: mobilePaymentInfo.phoneNumber || '',
                provider: mobilePaymentInfo.provider || '',
                accountName: mobilePaymentInfo.accountName || ''
            })
        }
    }, [mobilePaymentInfo])

    //////// Change Password 
    const [passwordData, setPasswordData] = useState({
        email: "",
        old_password: "",
        new_password: ""
    }); 

    const pinputHandle = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        dispatch(change_password(passwordData));
    }

    useEffect(() => { 
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear()); 
        } 
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear()); 
        } 
    },[successMessage,errorMessage,dispatch])




    return (
        <div className='px-2 lg:px-7 py-5'>
<div className='w-full flex flex-wrap'>
    <div className='w-full md:w-6/12'>
        <div className='w-full p-4 bg-[#6a5fdf] rounded-md text-[#d0d2d6]'>
            <div className='flex justify-center items-center py-3'>
                {
                    userInfo?.image ? <label htmlFor="img" className='h-[150px] w-[200px] relative p-3 cursor-pointer overflow-hidden'>
                        <img src={userInfo.image} alt="" />
                        {
                        loader && <div className='bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20'>
                            <span>
                                <FadeLoader/>
                            </span>

                        </div>
                    }


                    </label> : <label className='flex justify-center items-center flex-col h-[150px] w-[200px] cursor-pointer border border-dashed hover:border-red-500 border-[#d0d2d6] relative' htmlFor="img">
                    <span><FaImages /> </span>
                    <span>Sélectionner Image</span>
                    {
                        loader && <div className='bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20'>
                            <span>
                                <FadeLoader/>
                            </span>

                        </div>
                    }

                </label>
                }
                <input onChange={add_image} type="file" className='hidden' id='img' /> 
            </div>

        <div className='px-0 md:px-5 py-2'>
            {userEditMode ? (
                <form onSubmit={handleUserSaveEdit} className='p-4 bg-slate-800 rounded-md'>
                    <div className='flex flex-col w-full gap-1 mb-2'>
                        <label>Nom</label>
                        <input value={userEditData.name} onChange={userEditInputHandle} name='name' className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" />
                    </div>
                    <div className='flex flex-col w-full gap-1 mb-2'>
                        <label>Email</label>
                        <input value={userEditData.email} onChange={userEditInputHandle} name='email' className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="email" />
                    </div>
                    <div className='flex gap-2 mt-3'>
                        <button type='submit' disabled={loader} className='bg-green-500 hover:shadow-green-300/50 hover:shadow-lg text-white rounded-md px-4 py-2'>
                            {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Sauvegarder'}
                        </button>
                        <button type='button' onClick={handleUserCancelEdit} className='bg-gray-500 hover:shadow-gray-300/50 hover:shadow-lg text-white rounded-md px-4 py-2'>
                            Annuler
                        </button>
                    </div>
                </form>
            ) : (
                <div className='flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative'>
                    <span onClick={handleUserEdit} className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer'><FaRegEdit /> </span>
                    <div className='flex gap-2'>
                        <span>Nom : </span>
                        <span>{userInfo.name}</span> 
                    </div>
                    <div className='flex gap-2'>
                        <span>Email : </span>
                        <span>{userInfo.email}</span> 
                    </div>
                    <div className='flex gap-2'>
                        <span>Rôle : </span>
                        <span>{userInfo.role}</span> 
                    </div>
                    <div className='flex gap-2'>
                        <span>Statut : </span>
                        <span>{userInfo.status}</span> 
                    </div>
                    <div className='flex gap-2'>
                        <span>Compte de paiement : </span>
                         <p>
        {
            userInfo.payment === 'active' ? <span className='bg-red-500 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded'>{userInfo.payment}</span> : <span onClick={()=> dispatch(create_stripe_connect_account())}  className='bg-blue-500 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded'>Cliquer ici pour activer</span>
        } 
                         </p>
                    </div> 
                </div>
            )}
        </div>


        <div className='px-0 md:px-5 py-2'>
            {
                !userInfo?.shopInfo ? <form onSubmit={add}>
                    <div className='flex flex-col w-full gap-1 mb-2'>
                <label htmlFor="Shop">Nom de la boutique</label>
                <input value={state.shopName} onChange={inputHandle} className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" name='shopName' id='Shop' placeholder='Nom de la boutique' />
            </div>

            <div className='flex flex-col w-full gap-1 mb-2'>
                <label htmlFor="sector">Catégorie d'activité</label>
                <select value={state.sector} onChange={inputHandle} name='sector' id='sector' className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'>
                    <option value=''>Sélectionner une catégorie</option>
                    {allCategories && allCategories.map((category) => (
                        <option key={category._id} value={category.slug}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>  

            <div className='flex flex-col w-full gap-1 mb-2'>
                <label htmlFor="division">Région</label>
                <input value={state.division} onChange={inputHandle} className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" name='division' id='division' placeholder='Région' />
            </div>  

            <div className='flex flex-col w-full gap-1 mb-2'>
                <label htmlFor="district">La commune</label>
                <input value={state.district} onChange={inputHandle} className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" name='district' id='district' placeholder='Ville' />
            </div>  

            <div className='flex flex-col w-full gap-1 mb-2'>
                <label htmlFor="sub">La ville</label>
                <input value={state.sub_district} onChange={inputHandle} className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" name='sub_district' id='sub' placeholder='Commune' />
            </div>

            <div className='flex flex-col w-full gap-1 mb-2'>
                <label htmlFor="street">Rue et numéro</label>
                <input value={state.street} onChange={inputHandle} className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" name='street' id='street' placeholder='Rue' />
            </div>

            <div className='flex flex-col w-full gap-1 mb-2'>
                <label htmlFor="phone">Téléphone</label>
                <input value={state.phone} onChange={inputHandle} className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="tel" name='phone' id='phone' placeholder='Numéro de téléphone' />
            </div>  

            <button disabled={loader ? true : false}  className='bg-red-500 w-[200px] hover:shadow-red-300/50 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
            {
               loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Valider la boutique'
            } 
            </button>

                </form> : editMode ? (
                    <form onSubmit={handleSaveEdit} className='p-4 bg-slate-800 rounded-md'>
                        <div className='flex flex-col w-full gap-1 mb-2'>
                            <label>Nom de la boutique</label>
                            <input value={editData.shopName} onChange={editInputHandle} name='shopName' className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" />
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-2'>
                            <label>Catégorie d'activité</label>
                            <select value={editData.sector} onChange={editInputHandle} name='sector' className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'>
                                <option value=''>Sélectionner une catégorie</option>
                                {allCategories && allCategories.map((category) => (
                                    <option key={category._id} value={category.slug}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-2'>
                            <label>Région</label>
                            <input value={editData.division} onChange={editInputHandle} name='division' className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" />
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-2'>
                            <label>Ville</label>
                            <input value={editData.district} onChange={editInputHandle} name='district' className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" />
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-2'>
                            <label>Commune</label>
                            <input value={editData.sub_district} onChange={editInputHandle} name='sub_district' className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" />
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-2'>
                            <label>Rue</label>
                            <input value={editData.street} onChange={editInputHandle} name='street' className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" />
                        </div>
                        <div className='flex flex-col w-full gap-1 mb-2'>
                            <label>Téléphone</label>
                            <input value={editData.phone} onChange={editInputHandle} name='phone' className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="tel" />
                        </div>
                        <div className='flex gap-2 mt-3'>
                            <button type='submit' disabled={loader} className='bg-green-500 hover:shadow-green-300/50 hover:shadow-lg text-white rounded-md px-4 py-2'>
                                {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Sauvegarder'}
                            </button>
                            <button type='button' onClick={handleCancelEdit} className='bg-gray-500 hover:shadow-gray-300/50 hover:shadow-lg text-white rounded-md px-4 py-2'>
                                Annuler
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className='flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative'>
                        <span onClick={handleEdit} className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer'><FaRegEdit /> </span>
                        <div className='flex gap-2'>
                            <span>Nom de la boutique : </span>
                            <span>{ userInfo.shopInfo?.shopName }</span> 
                        </div>
                        <div className='flex gap-2'>
                            <span>Catégorie d'activité : </span>
                            <span>{ userInfo.shopInfo?.sector ? (
                                allCategories?.find(cat => cat.slug === userInfo.shopInfo.sector)?.name || userInfo.shopInfo.sector
                            ) : 'Non renseigné' }</span> 
                        </div>
                        <div className='flex gap-2'>
                            <span>Région : </span>
                            <span>{ userInfo.shopInfo?.division }</span> 
                        </div>
                        <div className='flex gap-2'>
                            <span>Ville : </span>
                            <span>{ userInfo.shopInfo?.district }</span> 
                        </div>
                        <div className='flex gap-2'>
                            <span>Commune : </span>
                            <span>{ userInfo.shopInfo?.sub_district }</span> 
                        </div>
                        <div className='flex gap-2'>
                            <span>Rue : </span>
                            <span>{ userInfo.shopInfo?.street || 'Non renseigné' }</span> 
                        </div>
                        <div className='flex gap-2'>
                            <span>Téléphone : </span>
                            <span>{ userInfo.shopInfo?.phone || 'Non renseigné' }</span> 
                        </div>
                    </div>
                ) 
            }


        </div>

        <div className='px-0 md:px-5 py-2'>
            <div className='py-2 text-lg'>
                <h2>Informations de paiement mobile</h2>
            </div>
            {!showMobilePaymentForm ? (
                <div className='flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative'>
                    <span onClick={() => setShowMobilePaymentForm(true)} className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer'><FaRegEdit /> </span>
                    <div className='flex gap-2'>
                        <span>Fournisseur : </span>
                        <span>{mobilePaymentInfo?.provider ? (mobilePaymentInfo.provider === 'orange_money' ? 'Orange Money' : mobilePaymentInfo.provider === 'wave' ? 'Wave' : mobilePaymentInfo.provider === 'free_money' ? 'Free Money' : 'MTN Money') : 'Non configuré'}</span>
                    </div>
                    <div className='flex gap-2'>
                        <span>Numéro : </span>
                        <span>{mobilePaymentInfo?.phoneNumber || 'Non configuré'}</span>
                    </div>
                    <div className='flex gap-2'>
                        <span>Nom du compte : </span>
                        <span>{mobilePaymentInfo?.accountName || 'Non configuré'}</span>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleMobilePaymentSubmit} className='p-4 bg-slate-800 rounded-md'>
                    <div className='flex flex-col w-full gap-1 mb-2'>
                        <label>Fournisseur de paiement</label>
                        <select value={mobilePaymentData.provider} onChange={mobilePaymentInputHandle} name='provider' className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' required>
                            <option value=''>Sélectionner un fournisseur</option>
                            <option value='orange_money'>Orange Money</option>
                            <option value='wave'>Wave</option>
                            <option value='free_money'>Free Money</option>
                            <option value='mtn_money'>MTN Money</option>
                        </select>
                    </div>
                    <div className='flex flex-col w-full gap-1 mb-2'>
                        <label>Numéro de téléphone</label>
                        <input value={mobilePaymentData.phoneNumber} onChange={mobilePaymentInputHandle} name='phoneNumber' className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="tel" placeholder='77 123 45 67' required />
                    </div>
                    <div className='flex flex-col w-full gap-1 mb-2'>
                        <label>Nom du compte</label>
                        <input value={mobilePaymentData.accountName} onChange={mobilePaymentInputHandle} name='accountName' className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" placeholder='Nom complet' required />
                    </div>
                    <div className='flex gap-2 mt-3'>
                        <button type='submit' disabled={paymentLoader} className='bg-green-500 hover:shadow-green-300/50 hover:shadow-lg text-white rounded-md px-4 py-2'>
                            {paymentLoader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Sauvegarder'}
                        </button>
                        <button type='button' onClick={() => setShowMobilePaymentForm(false)} className='bg-gray-500 hover:shadow-gray-300/50 hover:shadow-lg text-white rounded-md px-4 py-2'>
                            Annuler
                        </button>
                    </div>
                </form>
            )}
        </div>

        </div> 
    </div>



    <div className='w-full md:w-6/12'>
        <div className='w-full pl-0 md:pl-7 mt-6 md:mt-0'>
        <div className='bg-[#6a5fdf] rounded-md text-[#d0d2d6] p-4'>
        <h1 className='text-[#d0d2d6] text-lg mb-3 font-semibold'>Changer le mot de passe</h1>
        
        
        <form  onSubmit={handlePasswordChange} >
             <div className='flex flex-col w-full gap-1 mb-2'>
                <label htmlFor="email">Email</label>
                <input className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="email" name='email' id='email' value={passwordData.email} onChange={pinputHandle} placeholder='email' />
            </div>  

            <div className='flex flex-col w-full gap-1 mb-2'>
                <label htmlFor="o_password">Ancien mote de passe</label>
                <input className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="password" name='old_password' id='o_password' 
                value={passwordData.old_password} onChange={pinputHandle} placeholder='Ancien mote de passe' />
            </div>  
 
            <div className='flex flex-col w-full gap-1 mb-2'>
                <label htmlFor="n_password">Nouveau mote de passe</label>
                <input className='px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="password" name='new_password' id='n_password' 
                 value={passwordData.new_password} onChange={pinputHandle} placeholder='Nouveau mote de passe' />
            </div>   
 

            <button disabled={loader} className='bg-red-500  hover:shadow-red-500/40 hover:shadow-md text-white rounded-md px-7 py-2 my-2'>
            {loader ? "Loading.." : "Valider changements"}
            </button>

      </form>

        </div>
        
        </div>

    </div>




</div>
            
        </div>
    );
};

export default Profile;