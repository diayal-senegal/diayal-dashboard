import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { overrideStyle } from '../../utils/utils';
import { seller_forgot_password, messageClear } from '../../store/Reducers/authReducer';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Nettoyer les messages au montage du composant
    useEffect(() => {
        dispatch(messageClear());
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(seller_forgot_password(email));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            setIsSubmitted(true);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <div className='min-w-screen min-h-screen bg-[#cdcae9] flex justify-center items-center'>
            <div className='w-[350px] text-[#ffffff] p-2'>
                <div className='bg-[#6f68d1] p-4 rounded-md'>
                    <div className='h-[70px] flex justify-center items-center'>
                        <div className='w-[260px] h-[90px] mx-auto mb-4'>
                            <img className='w-full h-full' src="/images/logo.svg" alt="Diayal logo" />
                        </div>
                    </div>

                    {!isSubmitted ? (
                        <>
                            <div className='text-center mb-4'>
                                <div className='mx-auto w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-3'>
                                    <FaEnvelope className='text-xl text-white' />
                                </div>
                                <h2 className='text-xl mb-2 font-bold'>
                                    Mot de passe oublié ?
                                </h2>
                                <p className='text-sm mb-4 font-medium text-slate-300'>
                                    Saisissez votre adresse email pour recevoir un lien de réinitialisation
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className='flex flex-col w-full gap-1 mb-4'>
                                    <label htmlFor='email'>Adresse email</label>
                                    <input 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md' 
                                        type='email' 
                                        name='email' 
                                        id='email' 
                                        placeholder='votre@email.com' 
                                        required 
                                    />
                                </div>

                                <button 
                                    disabled={loader}
                                    type='submit'
                                    className='bg-slate-800 w-full hover:shadow-blue-300/ hover:shadow-lg text-white rounded-md px-7 py-2 mb-4'
                                >
                                    {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Envoyer le lien de réinitialisation'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className='text-center'>
                            <div className='mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-3'>
                                <FaEnvelope className='text-xl text-white' />
                            </div>
                            <h2 className='text-xl font-bold mb-2'>
                                Email envoyé !
                            </h2>
                            <p className='text-sm text-slate-300 mb-4'>
                                Un lien de réinitialisation a été envoyé à <strong>{email}</strong>. 
                                Vérifiez votre boîte de réception et vos spams.
                            </p>
                            <button 
                                onClick={() => setIsSubmitted(false)}
                                className='text-slate-300 hover:text-white font-medium hover:underline mb-4'
                            >
                                Renvoyer l'email
                            </button>
                        </div>
                    )}

                    <div className='text-center'>
                        <Link 
                            to='/login' 
                            className='inline-flex items-center gap-2 text-slate-300 hover:text-white font-medium transition duration-200'
                        >
                            <FaArrowLeft className='text-sm' />
                            Retour à la connexion
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;