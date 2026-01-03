import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { seller_register,messageClear } from '../../store/Reducers/authReducer';
import toast from 'react-hot-toast';
import { validatePassword } from '../../utils/passwordValidation';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';

const Register = () => {

    const  navigate = useNavigate()

    const dispatch = useDispatch()

    const {loader,successMessage,errorMessage} = useSelector(state=>state.auth)

    const [state, setState] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    })

    const [acceptTerms, setAcceptTerms] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name] : e.target.value
        })
    }

    const submit = (e) => {
        e.preventDefault()
        if (!acceptTerms) {
            toast.error('Vous devez accepter les termes et conditions pour vous inscrire')
            return
        }
        
        // Validation du mot de passe
        const passwordValidation = validatePassword(state.password);
        if (!passwordValidation.isValid) {
            passwordValidation.errors.forEach(error => toast.error(error));
            return;
        }
        
        dispatch(seller_register(state))
    }

    useEffect(() => {

        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            navigate('/')  
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
        

    },[successMessage,errorMessage,navigate,dispatch])


      return (
        <div className='min-w-screen min-h-screen bg-[#cdcae9] flex justify-center items-center' >
          <div className='w-[350px] text-[#ffffff] p-2'>
            <div className='bg-[#6f68d1] p-4 rounded-md'>
            <div className='w-[260px] h-[90px] mx-auto mb-4'>
                <img className='w-full h-full' src="http://localhost:3001/images/logo.svg" alt="Diayal logo" />
            </div>
                <h2 className='text-xl mb-3 font-bold'>Bienvenue sur Diayal</h2>
                <p className='text-sm mb-3 font-medium'>Merci de vous insrire</p>

    <form onSubmit={submit}>
        <div className='flex flex-col w-full gap-1 mb-3'>
            <label htmlFor="name">Nom</label>
            <input onChange={inputHandle} value={state.name} className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md' type="text" name='name' placeholder='Nom' id='name' required />

        </div>


        <div className='flex flex-col w-full gap-1 mb-3'>
            <label htmlFor="email">Email</label>
            <input onChange={inputHandle} value={state.email} className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md' type="email" name='email' placeholder='Email' id='email' required />

        </div>

        <div className='flex flex-col w-full gap-1 mb-3'>
            <label htmlFor="phone">Téléphone</label>
            <input onChange={inputHandle} value={state.phone} className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md' type="tel" name='phone' placeholder='Ex: +221 77 123 45 67' id='phone' required />
            <div className='text-xs text-gray-300 mt-1'>
                💡 Utilisé pour la validation de votre compte par notre équipe
            </div>
        </div>

        <div className='flex flex-col w-full gap-1 mb-3'>
            <label htmlFor="password">Mot de passe</label>
            <div className='relative'>
                <input 
                    onChange={inputHandle} 
                    value={state.password} 
                    className='px-3 py-2 pr-10 outline-none border border-slate-400 bg-transparent rounded-md w-full' 
                    type={showPassword ? "text" : "password"} 
                    name='password' 
                    placeholder='Mot de passe' 
                    id='password' 
                    required 
                    minLength={8}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white'
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
            <PasswordStrengthIndicator password={state.password} />
            <div className='text-xs text-gray-300 mt-1'>
                💡 Min. 8 caractères avec majuscule, minuscule, chiffre et caractère spécial
            </div>
        </div>

        <div className='flex items-center w-full gap-3 mb-3'>
            <input 
                className='w-4 h-4 text-blue-600 overflow-hidden bg-gray-200 rounded border-gray-300 focus:ring-blue-500' 
                type="checkbox" 
                name="checkbox" 
                id="checkbox" 
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                required
            />
            <label htmlFor="checkbox"> 
                J'accepte les <Link to="/terms-conditions" className='text-blue-300 underline hover:text-blue-200'>termes et conditions</Link>
            </label> 
        </div>

        <button disabled={loader || !acceptTerms}  className={`w-full hover:shadow-lg text-white rounded-md px-7 py-2 mb-3 transition-colors duration-200 ${
            loader || !acceptTerms ? 'bg-gray-600 cursor-not-allowed' : 'bg-slate-800 hover:shadow-blue-300/'
        }`}>
            {
               loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'S\'inscrire'
            } 
            </button>

        <div className='flex items-center mb-3 gap-3 justify-center'>
            <p>Vous avez un compte ? <Link className='font-bold' to="/login">Se connecter</Link> </p> 
        </div>

        <div className='w-full flex justify-center items-center mb-3'>
            <div className='w-[45%] bg-slate-700 h-[1px]'></div>
            <div className='w-[10%] flex justify-center items-center'>
                <span className='pb-1'>Ou</span>
            </div>
            <div className='w-[45%] bg-slate-700 h-[1px] '></div>
        </div>

        <div className='flex justify-center items-center gap-3'>
            <div className='w-[135px] h-[35px] flex rounded-md bg-orange-700 shadow-lg hover:shadow-orange-700/50 justify-center cursor-pointer items-center overflow-hidden'>
            <span><FaGoogle /></span>
             </div>

             <div className='w-[135px] h-[35px] flex rounded-md bg-blue-700 shadow-lg hover:shadow-blue-700/50 justify-center cursor-pointer items-center overflow-hidden'>
            <span><FaFacebook /></span>
             </div>

        </div>


    </form>
 
            </div>
            </div>  
            
        </div>
    );
};

export default Register;