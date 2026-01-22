import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { overrideStyle } from '../../utils/utils';
import { seller_reset_password, messageClear } from '../../store/Reducers/authReducer';
import { validatePassword } from '../../utils/passwordValidation';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, errorMessage, successMessage } = useSelector(state => state.auth);
    
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }

        // Validation du mot de passe robuste
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            passwordValidation.errors.forEach(error => toast.error(error));
            return;
        }

        dispatch(seller_reset_password({
            token,
            password: formData.password
        }));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            setTimeout(() => {
                dispatch(messageClear());
                navigate('/login');
            }, 2000);
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

                    <div className='text-center mb-4'>
                        <div className='mx-auto w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-3'>
                            <FaLock className='text-xl text-white' />
                        </div>
                        <h2 className='text-xl mb-2 font-bold'>
                            Nouveau mot de passe
                        </h2>
                        <p className='text-sm mb-4 font-medium text-slate-300'>
                            Saisissez votre nouveau mot de passe
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className='flex flex-col w-full gap-1 mb-3'>
                            <label htmlFor='password'>Nouveau mot de passe</label>
                            <div className='relative'>
                                <input 
                                    value={formData.password}
                                    onChange={handleChange}
                                    className='px-3 py-2 pr-10 outline-none border border-slate-400 bg-transparent rounded-md w-full' 
                                    type={showPassword ? 'text' : 'password'} 
                                    name='password' 
                                    id='password' 
                                    placeholder='••••••••' 
                                    required 
                                    minLength={8}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white'
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <PasswordStrengthIndicator password={formData.password} />
                            <div className='text-xs text-gray-300 mt-1'>
                                💡 Min. 8 caractères avec majuscule, minuscule, chiffre et caractère spécial
                            </div>
                        </div>

                        <div className='flex flex-col w-full gap-1 mb-4'>
                            <label htmlFor='confirmPassword'>Confirmer le mot de passe</label>
                            <div className='relative'>
                                <input 
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className='px-3 py-2 pr-10 outline-none border border-slate-400 bg-transparent rounded-md w-full' 
                                    type={showConfirmPassword ? 'text' : 'password'} 
                                    name='confirmPassword' 
                                    id='confirmPassword' 
                                    placeholder='••••••••' 
                                    required 
                                    minLength={8}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white'
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button 
                            disabled={loader}
                            type='submit'
                            className='bg-slate-800 w-full hover:shadow-blue-300/ hover:shadow-lg text-white rounded-md px-7 py-2 mb-4'
                        >
                            {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Réinitialiser le mot de passe'}
                        </button>
                    </form>

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

export default ResetPassword;