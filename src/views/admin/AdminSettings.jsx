import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { change_password, messageClear } from '../../store/Reducers/authReducer';
import toast from 'react-hot-toast';
import { FaLock, FaEye, FaEyeSlash, FaCog, FaUser, FaShieldAlt } from 'react-icons/fa';

const AdminSettings = () => {
    const dispatch = useDispatch();
    const { loader, successMessage, errorMessage, userInfo } = useSelector(state => state.auth);
    
    const [activeTab, setActiveTab] = useState('password');
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
        if (successMessage && activeTab === 'password') {
            toast.success(successMessage);
            setState({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            dispatch(messageClear());
        }
        if (errorMessage && activeTab === 'password') {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, activeTab]);

    const tabs = [
        { id: 'password', label: 'Mot de passe', icon: FaLock },
        { id: 'profile', label: 'Profil', icon: FaUser },
        { id: 'security', label: 'Sécurité', icon: FaShieldAlt }
    ];

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='flex items-center gap-3 mb-6'>
                <FaCog className='text-3xl text-blue-600' />
                <h1 className='text-3xl font-bold text-gray-800'>Paramètres</h1>
            </div>

            <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                {/* Tabs */}
                <div className='flex border-b'>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                        >
                            <tab.icon />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className='p-6'>
                    {/* Onglet Mot de passe */}
                    {activeTab === 'password' && (
                        <div>
                            <h2 className='text-xl font-bold text-gray-800 mb-4'>Changer le mot de passe</h2>
                            <p className='text-gray-600 mb-6'>Assurez-vous d'utiliser un mot de passe fort et unique</p>
                            
                            <form onSubmit={submit} className='max-w-md'>
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
                    )}

                    {/* Onglet Profil */}
                    {activeTab === 'profile' && (
                        <div>
                            <h2 className='text-xl font-bold text-gray-800 mb-4'>Informations du profil</h2>
                            <div className='max-w-md space-y-4'>
                                <div className='p-4 bg-gray-50 rounded-lg'>
                                    <p className='text-sm text-gray-600'>Email</p>
                                    <p className='text-lg font-medium text-gray-800'>{userInfo?.email || 'Non disponible'}</p>
                                </div>
                                <div className='p-4 bg-gray-50 rounded-lg'>
                                    <p className='text-sm text-gray-600'>Nom</p>
                                    <p className='text-lg font-medium text-gray-800'>{userInfo?.name || 'Administrateur'}</p>
                                </div>
                                <div className='p-4 bg-gray-50 rounded-lg'>
                                    <p className='text-sm text-gray-600'>Rôle</p>
                                    <p className='text-lg font-medium text-gray-800'>Administrateur</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Onglet Sécurité */}
                    {activeTab === 'security' && (
                        <div>
                            <h2 className='text-xl font-bold text-gray-800 mb-4'>Paramètres de sécurité</h2>
                            <div className='max-w-md space-y-4'>
                                <div className='p-4 border border-gray-200 rounded-lg'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='font-medium text-gray-800'>Authentification à deux facteurs</p>
                                            <p className='text-sm text-gray-600'>Bientôt disponible</p>
                                        </div>
                                        <span className='px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full'>Prochainement</span>
                                    </div>
                                </div>
                                <div className='p-4 border border-gray-200 rounded-lg'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='font-medium text-gray-800'>Sessions actives</p>
                                            <p className='text-sm text-gray-600'>Gérer vos sessions</p>
                                        </div>
                                        <span className='px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full'>Prochainement</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
