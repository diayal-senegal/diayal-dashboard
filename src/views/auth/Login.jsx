import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { overrideStyle } from '../../utils/utils';
import { seller_login,messageClear } from '../../store/Reducers/authReducer';

const Login = () => {

    const navigate = useNavigate()

    const dispatch = useDispatch()
    const {loader,errorMessage,successMessage} = useSelector(state=>state.auth)

    const [state, setState] = useState({ 
        email: "",
        password: ""
    })

    const [showPassword, setShowPassword] = useState(false)

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name] : e.target.value
        })
    }

    const submit = (e) => {
        e.preventDefault()
        dispatch(seller_login(state))
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
             <div className='h-[70px] flex justify-center items-center'>
            <div className='w-[260px] h-[90px] mx-auto mb-4'>
                <img className='w-full h-full' src="/images/logo.svg" alt="Diayal logo" />
            </div>
            </div>  
                <h2 className='text-xl mb-3 font-bold'>Bienvenue sur Diayal</h2>
                <p className='text-sm mb-3 font-medium'>Merci de vous connecter</p>

    <form onSubmit={submit}>
         
        <div className='flex flex-col w-full gap-1 mb-3'>
            <label htmlFor="email">Email</label>
            <input onChange={inputHandle} value={state.email}  className='px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md' type="email" name='email' placeholder='Email' id='email' required />

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
                    placeholder='Password' 
                    id='password' 
                    required 
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white'
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
        </div>
  

        <button disabled={loader ? true : false}  className='bg-slate-800 w-full hover:shadow-blue-300/ hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
            {
               loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Se connecter'
            } 
            </button>

        <div className='flex flex-col items-center mb-3 gap-2'>
            <div className='text-right w-full'>
                <Link 
                    to='/forgot-password' 
                    className='text-sm text-slate-300 hover:text-white font-medium hover:underline transition duration-200'
                >
                    Mot de passe oublié ?
                </Link>
            </div>
            <p>Vous n'avez pas de compte ?  </p>
            <div className='w-full'><Link className='bg-slate-800 w-full hover:shadow-blue-300/ hover:shadow-lg text-white font-semibold rounded-md px-7 py-2 mb-3  block text-center' to="/register">S'inscrire</Link></div> 
        </div>

        {/* <div className='w-full flex justify-center items-center mb-3'>
            <div className='w-[45%] bg-slate-700 h-[1px]'></div>
            <div className='w-[10%] flex justify-center items-center'>
                <span className='pb-1'>Ou</span>
            </div>
            <div className='w-[45%] bg-slate-700 h-[1px] '></div>
        </div> */}

        {/* <div className='flex justify-center items-center gap-3'>
            <div className='w-[135px] h-[35px] flex rounded-md bg-orange-700 shadow-lg hover:shadow-orange-700/50 justify-center cursor-pointer items-center overflow-hidden'>
            <span><FaGoogle /></span>
             </div>

             <div className='w-[135px] h-[35px] flex rounded-md bg-blue-700 shadow-lg hover:shadow-blue-700/50 justify-center cursor-pointer items-center overflow-hidden'>
            <span><FaFacebook /></span>
             </div>

        </div> */}


    </form>
 
            </div>
            </div>  
            
        </div>
    );
};

export default Login;