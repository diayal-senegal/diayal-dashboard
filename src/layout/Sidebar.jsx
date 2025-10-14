import React, { useEffect, useState } from 'react';
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { getNav } from '../navigation/index';
import { BiLogOutCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../store/Reducers/authReducer';
import { getAllSupportMessages } from '../api/customerSupport';
import logo from '../assets/logo.svg'

const Sidebar = ({showSidebar, setShowSidebar}) => {

    const dispatch = useDispatch()
    const { role } = useSelector(state => state.auth)
    const navigate = useNavigate()

    const {pathname} = useLocation()
    const [allNav,setAllNav] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    
    useEffect(() => {
        const navs = getNav(role)
        setAllNav(navs)
    },[role])

    // Compter les messages non lus
    const loadUnreadCount = async () => {
        if (role === 'admin') {
            try {
                const data = await getAllSupportMessages();
                if (data.success) {
                    const unread = data.messages.filter(msg => msg.status === 'unseen' && !msg.isFromAdmin).length;
                    setUnreadCount(unread);
                }
            } catch (error) {
                console.error('Erreur lors du comptage des messages:', error);
            }
        }
    };

    useEffect(() => {
        loadUnreadCount();
        // Actualiser toutes les 30 secondes
        const interval = setInterval(loadUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [role]);


    return (
        <div>
            <div onClick={()=> setShowSidebar(false)} className={`fixed duration-200 ${!showSidebar ? 'invisible' : 'visible'} w-screen h-screen bg-[#8cbce780] top-0 left-0 z-10`} > 
            </div>

    <div className={`w-[260px] fixed bg-[#e6e7fb] z-50 top-0 h-screen shadow-[0_0_15px_0_rgb(34_41_47_/_5%)] transition-all ${showSidebar ? 'left-0' : '-left-[260px] lg:left-0'} `}>
        <div className='h-[70px] flex justify-center items-center'>
            <Link to='/' className='w-[180px] h-[50px]'>
                <img className='w-full h-full' src={logo} alt="" />
            </Link> 
        </div>

        <div className='px-[16px]'>
            <ul>
                {
                    allNav.map((n,i) =><li key={i}>
                       <Link to={n.path} className={`${pathname === n.path ? 'bg-blue-600 shadow-indigo-500/50 text-white duration-500' : 'text-[#030811] font-bold duration-200 ' } px-[12px] py-[9px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1 `} >
                        <span>{n.icon}</span>
                        <span className="flex-1">{n.title}</span>
                        {n.path === '/admin/dashboard/customer-support' && unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                        </Link>

                    </li> )
                }

            <li>
                <button onClick={() => dispatch(logout({navigate,role }))} className='text-[#030811] font-bold duration-200 px-[12px] py-[9px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1'>
                <span><BiLogOutCircle /></span>
                <span>Déconnexion</span>
                </button>
            </li>
 


            </ul>

        </div>
        
    </div>

        </div>
    );
};

export default Sidebar;