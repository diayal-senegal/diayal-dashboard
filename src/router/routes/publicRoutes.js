import { lazy } from "react";    
const Login = lazy(()=> import('../../views/auth/Login'))   
const Register = lazy(()=> import('../../views/auth/Register')) 
const AdminLogin = lazy(()=> import('../../views/auth/AdminLogin')) 
const TermsConditions = lazy(()=> import('../../views/auth/TermsConditions')) 
const Home = lazy(()=> import('../../views/Home'))   
const UnAuthorized = lazy(()=> import('../../views/UnAuthorized'))   
const Success = lazy(()=> import('../../views/Success'))   

const publicRoutes = [
    {
        path: '/',
        element : <Home/>, 
    },
    {
        path : '/login',
        element : <Login/>
    },
    {
        path : '/register',
        element : <Register/>
    },
    {
        path : '/terms-conditions',
        element : <TermsConditions/>
    },
    {
        path : '/admin/login',
        element : <AdminLogin/>
    },
    {
        path : '/unauthorized',
        element : <UnAuthorized/>
    },
    {
        path : '/success?',
        element : <Success/>
    }
]

export default publicRoutes