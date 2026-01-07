import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { change_password, messageClear } from '../../store/Reducers/authReducer';
import toast from 'react-hot-toast';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePassword = () => {
    const dispatch = useDispatch();
    const { loader, successMessage, errorMessage } = useSelector(state => state.auth);
    
    const [state, setState] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (state.newPassword !== state.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }
        
        if (state.newPassword.length < 6) {
            toast.error('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }
        
        dispatch(change_password({
            oldPassword: state.oldPassword,
            newPassword: state.newPassword
        }));
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            setState({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage]);

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-white rounded-md shadow-lg'>
                <h2 className='text-2xl font-bold text-gray-800 pb-4 border-b'>Changer le mot de passe</h2>
                
                <form onSubmit={submit} className='mt-6 max-w-md'>
                    {/* Ancien mot de passe */}
                    <div className='flex flex-col w-full gap-1 mb-4'>
                        <label htmlFor="oldPassword" className='text-sm font-medium text-gray-700'>
                            Ancien mot de passe
                        </label>
                        <div className='relative'>
                            <FaLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                            <input
                                onChange={inputHandle}
                                value={state.oldPassword}
                                className='px-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                type={showPasswords.old ? 'text' : 'password'}
                                name='oldPassword'
                                placeholder='Ancien mot de passe'
                                id='oldPassword'
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({...showPasswords, old: !showPasswords.old})}
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                            >
                                {showPasswords.old ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Nouveau mot de passe */}
                    <div className='flex flex-col w-full gap-1 mb-4'>
                        <label htmlFor="newPassword" className='text-sm font-medium text-gray-700'>
                            Nouveau mot de passe
                        </label>
                        <div className='relative'>
                            <FaLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                            <input
                                onChange={inputHandle}
                                value={state.newPassword}
                                className='px-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                type={showPasswords.new ? 'text' : 'password'}
                                name='newPassword'
                                placeholder='Nouveau mot de passe'
                                id='newPassword'
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                            >
                                {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <p className='text-xs text-gray-500 mt-1'>Minimum 6 caractères</p>
                    </div>

                    {/* Confirmer mot de passe */}
                    <div className='flex flex-col w-full gap-1 mb-6'>
                        <label htmlFor="confirmPassword" className='text-sm font-medium text-gray-700'>
                            Confirmer le nouveau mot de passe
                        </label>
                        <div className='relative'>
                            <FaLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                            <input
                                onChange={inputHandle}
                                value={state.confirmPassword}
                                className='px-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                type={showPasswords.confirm ? 'text' : 'password'}
                                name='confirmPassword'
                                placeholder='Confirmer le mot de passe'
                                id='confirmPassword'
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                            >
                                {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        disabled={loader}
                        className='bg-blue-500 w-full hover:bg-blue-600 text-white rounded-md px-7 py-2 mb-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    >
                        {loader ? 'Changement en cours...' : 'Changer le mot de passe'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
