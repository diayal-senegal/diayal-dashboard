import React, { useEffect, useState } from 'react';
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { getNav } from '../navigation/index';
import { BiLogOutCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../store/Reducers/authReducer';
import { useNotifications } from '../hooks/useNotifications';
import { useSelector as useReduxSelector } from 'react-redux';
import { get_unread_notifications_count, get_chat_counts } from '../store/Reducers/sellerReducer';
import logo from '../assets/logo.svg'

const Sidebar = ({showSidebar, setShowSidebar}) => {

    const dispatch = useDispatch()
    const { role } = useSelector(state => state.auth)
    const { unreadCount, chatCounts } = useReduxSelector(state => state.seller)
    const navigate = useNavigate()

    const {pathname} = useLocation()
    const [allNav,setAllNav] = useState([])
    const { notifications } = useNotifications()
    
    // Charger le nombre de notifications non lues pour les vendeurs
    useEffect(() => {
        if (role === 'seller') {
            dispatch(get_unread_notifications_count())
            dispatch(get_chat_counts())
        }
        
        // Écouter l'événement de rafraîchissement des notifications
        const handleRefreshNotifications = () => {
            if (role === 'seller') {
                dispatch(get_unread_notifications_count())
                dispatch(get_chat_counts())
            }
        };
        
        window.addEventListener('refreshNotifications', handleRefreshNotifications);
        return () => window.removeEventListener('refreshNotifications', handleRefreshNotifications);
    }, [dispatch, role])
    
    useEffect(() => {
        const navs = getNav(role)
        setAllNav(navs)
    },[role])

    const getNotificationCount = (path) => {
        // Pour les vendeurs
        if (role === 'seller') {
            switch(path) {
                case '/seller/dashboard/notifications':
                    return unreadCount || 0
                case '/seller/dashboard/chat-customer':
                    return chatCounts?.customerMessages || 0
                case '/seller/dashboard/chat-support':
                    return chatCounts?.supportMessages || 0
                default:
                    return 0
            }
        }
        
        // Pour les admins
        if (!notifications) return 0
        
        switch(path) {
            case '/admin/dashboard/newsletter':
                return notifications.newsletter || 0
            case '/admin/dashboard/vendor-teaser':
                return notifications.vendorTeaser || 0
            case '/admin/dashboard/customer-support':
                return notifications.support || 0
            case '/admin/dashboard/contact-messages':
                return notifications.contact || 0
            case '/admin/dashboard/sellers-request':
                return notifications.sellerRequest || 0
            case '/admin/dashboard/payment-request':
                return notifications.paymentRequest || 0
            case '/admin/dashboard/chat-sellers':
                return notifications.sellerSupport || 0
            case '/admin/dashboard/banner-validation':
                return notifications.bannerValidation || 0
            default:
                return 0
        }
    }


    return (
        <div>
            <div onClick={()=> setShowSidebar(false)} className={`fixed duration-200 ${!showSidebar ? 'invisible' : 'visible'} w-screen h-screen bg-[#8cbce780] top-0 left-0 z-10`} > 
            </div>

    <div className={`w-[260px] fixed bg-[#e6e7fb] z-50 top-0 h-screen shadow-[0_0_15px_0_rgb(34_41_47_/_5%)] transition-all ${showSidebar ? 'left-0' : '-left-[260px] lg:left-0'} flex flex-col`}>
        <div className='h-[70px] flex justify-center items-center'>
            <Link to='/' className='w-[180px] h-[50px]'>
                <img className='w-full h-full' src={logo} alt="" />
            </Link> 
        </div>

        <div className='px-[16px] flex-1 overflow-y-auto'>
            <ul>
                {
                    allNav.map((n,i) =><li key={i}>
                       <Link to={n.path} className={`${pathname === n.path ? 'bg-blue-600 shadow-indigo-500/50 text-white duration-500' : 'text-[#030811] font-bold duration-200 ' } px-[12px] py-[9px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1 `} >
                        <span>{n.icon}</span>
                        <span className="flex-1">{n.title}</span>
                        {getNotificationCount(n.path) > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                                {getNotificationCount(n.path) > 99 ? '99+' : getNotificationCount(n.path)}
                            </span>
                        )}
                        </Link>

                    </li> )
                }

            </ul>
        </div>
        
        <div className='px-[16px] pb-4 mt-auto'>
            <button onClick={() => dispatch(logout({navigate,role }))} className='text-[#030811] font-bold duration-200 px-[12px] py-[9px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1'>
            <span><BiLogOutCircle /></span>
            <span>Déconnexion</span>
            </button>
        </div>

        
    </div>

        </div>
    );
};

export default Sidebar;