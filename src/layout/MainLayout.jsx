import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; 
import Sidebar from './Sidebar';
import { socket } from '../utils/utils'
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomer, updateSellers } from '../store/Reducers/chatReducer';

const MainLayout = () => {

    const dispatch = useDispatch()
    const {userInfo } = useSelector(state => state.auth)

    useEffect(() => {
        if (userInfo && userInfo.role === 'seller') {
            console.log('Vendeur se connecte au socket:', userInfo._id, userInfo.name)
            console.log('Socket connecté?', socket.connected)
            console.log('Socket ID:', socket.id)
            
            // Forcer la reconnexion si nécessaire
            if (!socket.connected) {
                socket.connect()
            }
            
            // Attendre que le socket soit connecté
            if (socket.connected) {
                socket.emit('add_seller', userInfo._id, userInfo)
                console.log('Événement add_seller émis')
            } else {
                socket.on('connect', () => {
                    console.log('Socket connecté, émission de add_seller')
                    socket.emit('add_seller', userInfo._id, userInfo)
                })
            }
        } else if (userInfo) {
            console.log('Admin se connecte au socket:', userInfo)
            socket.emit('add_admin', userInfo)
        }
    },[userInfo])

    useEffect(() => {
        socket.on('activeCustomer',(customers)=>{
            dispatch(updateCustomer(customers))
        })
        socket.on('activeSeller',(sellers)=>{
            dispatch(updateSellers(sellers))
        })
    })

    const [showSidebar, setShowSidebar] = useState(false)

    return ( 
        <div className='bg-[#cdcae9] w-full min-h-screen'>
            <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
            <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

           <div className='ml-0 lg:ml-[260px] pt-[95px] transition-all'>
           <Outlet/>
           </div>
        </div>
    );
};

export default MainLayout;