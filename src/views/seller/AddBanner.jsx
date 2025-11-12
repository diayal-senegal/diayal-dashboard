import React, { useEffect, useState } from 'react';
import { FaRegImage } from "react-icons/fa";
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { add_banner,get_banner,messageClear, update_banner } from '../../store/Reducers/bannerReducer';
import toast from 'react-hot-toast';

const AddBanner = () => {
    
    const {productId} = useParams()
    const dispatch = useDispatch()

    const { loader,successMessage,errorMessage,banner } = useSelector(state => state.banner)
    const { userInfo } = useSelector(state => state.auth)
    const [imageShow, setImageShow] = useState('')
    const [image, setImage] = useState('')
    const [bannerType, setBannerType] = useState('gratuit')
    const [paymentStatus, setPaymentStatus] = useState('pending') // pending, completed, failed
    const [showPayment, setShowPayment] = useState(false)
    
    // Configuration des types de bannières
    const bannerTypes = {
        gratuit: {
            name: 'Gratuite',
            price: 0,
            limit: '1 bannière/mois',
            validation: '48-72h',
            features: ['Validation obligatoire', 'Affichage rotatif standard']
        },
        premium: {
            name: 'Premium',
            price: 5000,
            limit: '1 bannières pendant une semaine',
            validation: '24h',
            features: ['Validation prioritaire', 'Meilleur placement', 'Analytics de base']
        },
        vip: {
            name: 'VIP',
            price: 15000,
            limit: '1 bannières pendant 15 jours - échangeable',
            validation: '6h',
            features: ['Validation express', 'Placement premium garanti', 'Analytics avancés', 'Support dédié']
        }
    }

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    },[successMessage,errorMessage, dispatch])

    const imageHandle = (e) => {
        const files = e.target.files 
        const length = files.length

        if (length > 0) {
            const file = files[0]
            setImage(file)
            
            // Convertir et compresser l'image
            const reader = new FileReader()
            reader.onload = (e) => {
                const img = new Image()
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    
                    // Redimensionner pour réduire la taille
                    const maxWidth = 800
                    const maxHeight = 400
                    let { width, height } = img
                    
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width
                        width = maxWidth
                    }
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height
                        height = maxHeight
                    }
                    
                    canvas.width = width
                    canvas.height = height
                    ctx.drawImage(img, 0, 0, width, height)
                    
                    // Compresser à 70% de qualité
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7)
                    setImageShow(compressedDataUrl)
                }
                img.src = e.target.result
            }
            reader.readAsDataURL(file)
        } 
    }

    const add = (e) => {
        e.preventDefault()
        
        // Vérifier si une image est sélectionnée
        if (!image) {
            toast.error('Veuillez sélectionner une image pour la bannière')
            return
        }
        
        // Vérifier si un paiement est requis
        if (bannerTypes[bannerType].price > 0) {
            setShowPayment(true)
            return
        }
        
        // Soumettre la bannière gratuite
        submitBanner()
    }
    
    const submitBanner = () => {
        try {
            // Créer FormData pour l'API
            const formData = new FormData();
            formData.append('mainban', image);
            formData.append('productId', productId);
            formData.append('bannerType', bannerType);
            formData.append('price', bannerTypes[bannerType].price);
            
            // Utiliser Redux pour envoyer à l'API (logique originale)
            dispatch(add_banner(formData));
            
            // Réinitialiser le formulaire
            setImage('');
            setImageShow('');
            setBannerType('gratuit');
            
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            toast.error('Erreur lors de la soumission de la bannière');
        }
    }
    
    const handlePayment = () => {
        // Simulation du processus de paiement
        toast.loading('Traitement du paiement...')
        
        setTimeout(() => {
            setPaymentStatus('completed')
            setShowPayment(false)
            submitBanner()
            toast.dismiss()
            toast.success(`Paiement de ${bannerTypes[bannerType].price} FCFA effectué avec succès !`)
        }, 2000)
    }

    const update = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('mainban',image)
        dispatch(update_banner({info:formData,bannerId: banner._id}))
    }

    useEffect(() => {
        if (productId) {
            dispatch(get_banner(productId))
        }
    },[productId,dispatch])

    // Si pas de productId, on peut quand même afficher le formulaire
    // mais on désactive certaines fonctionnalités
    const hasProductId = Boolean(productId)

    return (
    <div className='px-2 lg:px-7 pt-5'>
        <h1 className='text-[#000000] font-semibold text-lg mb-3'>Ajouter une Bannière</h1>
        {!hasProductId && (
            <div className='mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-yellow-800'>
                <p>Attention: Aucun produit sélectionné. Veuillez accéder à cette page depuis la liste des produits.</p>
            </div>
        )}
        
        {/* Statut de validation */}
        <div className='mb-4 p-4 bg-blue-100 border border-blue-400 rounded text-blue-800'>
            <h3 className='font-semibold mb-2'>📝 Processus de validation</h3>
            <div className='text-sm space-y-1'>
                <p><span className='font-medium'>1. Soumission:</span> Votre bannière sera envoyée pour validation</p>
                <p><span className='font-medium'>2. Vérification:</span> Notre équipe vérifiera le contenu et la qualité</p>
                <p><span className='font-medium'>3. Validation:</span> Vous recevrez une notification du résultat</p>
                <p><span className='font-medium'>4. Publication:</span> Si approuvée, votre bannière sera publiée</p>
            </div>
        </div>
        
        {/* Sélection du type de bannière */}
        <div className='mb-6'>
            <h2 className='text-white font-semibold text-md mb-4'>Choisissez votre type de bannière</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {Object.entries(bannerTypes).map(([key, type]) => (
                    <div 
                        key={key}
                        onClick={() => setBannerType(key)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            bannerType === key 
                                ? 'border-yellow-400 bg-yellow-400 bg-opacity-20' 
                                : 'border-gray-400 hover:border-yellow-300 bg-gray-800 bg-opacity-50'
                        }`}
                    >
                        <div className='flex justify-between items-center mb-2'>
                            <h3 className='font-bold text-white text-lg'>{type.name}</h3>
                            <span className='text-yellow-300 font-bold text-sm'>
                                {type.price === 0 ? 'Gratuite' : `${type.price} FCFA`}
                            </span>
                        </div>
                        <p className='text-gray-100 text-sm mb-2 font-medium'>{type.limit}</p>
                        <p className='text-gray-200 text-sm mb-3'>Validation: <span className='font-semibold'>{type.validation}</span></p>
                        <ul className='text-sm text-gray-100'>
                            {type.features.map((feature, index) => (
                                <li key={index} className='mb-1 flex items-center'>
                                    <span className='text-yellow-300 mr-2'>✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div> 
        <div className='w-full p-4 bg-[#6a5fdf] rounded-md'> 
        

        {
            !banner && <div>
                <form onSubmit={add}>
         <div className='mb-4'>
            <label className='flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-red-500 w-full text-white' htmlFor="image">
                <span className='text-4xl'><FaRegImage /></span>
                <span>Sélect image bannière </span>
            </label>
            <input required onChange={imageHandle} className='hidden' type="file" id='image' />
            </div>

            {
                imageShow && <div className='mb-4'>
                    <img className='w-full h-[300px]' src={imageShow} alt="" />
                </div>
            }

            <button disabled={loader ? true : false}  className='bg-red-500 w-[280px] hover:shadow-red-300/50 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
            {
               loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 
               bannerTypes[bannerType].price > 0 
                   ? `Procéder au paiement (${bannerTypes[bannerType].price} FCFA)`
                   : `Ajouter bannière ${bannerTypes[bannerType].name}`
            } 
            </button>
            
            {/* Modal de paiement */}
            {showPayment && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-6 rounded-lg max-w-md w-full mx-4'>
                        <h3 className='text-lg font-bold text-gray-800 mb-4'>Confirmer le paiement</h3>
                        <div className='mb-4'>
                            <p className='text-gray-600'>Type de bannière: <span className='font-semibold'>{bannerTypes[bannerType].name}</span></p>
                            <p className='text-gray-600'>Montant: <span className='font-semibold text-red-600'>{bannerTypes[bannerType].price} FCFA</span></p>
                            <p className='text-gray-600'>Validation: <span className='font-semibold'>{bannerTypes[bannerType].validation}</span></p>
                        </div>
                        <div className='flex gap-3'>
                            <button 
                                onClick={handlePayment}
                                className='flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'
                            >
                                Confirmer le paiement
                            </button>
                            <button 
                                onClick={() => setShowPayment(false)}
                                className='flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600'
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </form> 

            </div>
        }

        {
            banner && <div>
                {
                    <div className='mb-4'>
                    <img className='w-full h-[300px]' src={banner.banner} alt="" />
                </div>
                }

<form onSubmit={update}>
         <div className='mb-4'>
            <label className='flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-red-500 w-full text-white' htmlFor="image">
                <span className='text-4xl'><FaRegImage /></span>
                <span>Sélectionner image bannière </span>
            </label>
            <input required onChange={imageHandle} className='hidden' type="file" id='image' />
            </div>

            {
                imageShow && <div className='mb-4'>
                    <img className='w-full h-[300px]' src={imageShow} alt="" />
                </div>
            }

            <button disabled={loader ? true : false}  className='bg-red-500 w-[280px] hover:shadow-red-300/50 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
            {
               loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Modifier Bannière'
            } 
            </button>

        </form> 

            </div>
        }
 
       
        
        </div> 
    </div>
    );
};

export default AddBanner;