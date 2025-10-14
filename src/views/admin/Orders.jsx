import React, { useEffect, useState } from 'react';
import { LuSquareArrowDown} from "react-icons/lu";
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { get_admin_orders } from '../../store/Reducers/OrderReducer';

const Orders = () => {

    const dispatch = useDispatch()

    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [show, setShow] =  useState(false)
    const [loading, setLoading] = useState(false)

    const {adminOrders, adminTotalOrder } = useSelector(state => state.order)

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const obj = {
                parPage: parseInt(parPage),
                page: parseInt(currentPage),
                searchValue
            }
            await dispatch(get_admin_orders(obj))
            console.log('Orders fetched successfully')
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    },[searchValue,currentPage,parPage])

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchOrders()
        }, 30000)
        return () => clearInterval(interval)
    }, [currentPage, parPage, searchValue])

 
    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-3'>
                        <select onChange={(e) => setParPage(parseInt(e.target.value))} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option> 
                        </select>
                        <button 
                            onClick={fetchOrders}
                            disabled={loading}
                            className={`px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white rounded-md font-medium`}
                        >
                            {loading ? 'Chargement...' : 'Actualiser'}
                        </button>
                    </div>
                    <input onChange={e => setSearchValue(e.target.value)} value={searchValue} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" placeholder='Rechercher' /> 
                </div>


        <div className='relative mt-5 overflow-x-auto'>
            <div className='w-full text-sm text-left [#d0d2d6]'>
                <div className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>

            <div className=' flex justify-between items-center'>
                <div className='py-3 w-[20%] font-bold'>N° Commande</div>
                <div className='py-3 w-[12%] font-bold'>Prix</div>
                <div className='py-3 w-[15%] font-bold'>Statut paiement</div>
                <div className='py-3 w-[15%] font-bold'>Statut commande</div>
                <div className='py-3 w-[15%] font-bold'>Date</div>
                <div className='py-3 w-[15%] font-bold'>Action </div>
                <div className='py-3 w-[8%] font-bold'><LuSquareArrowDown />
         </div> 
            </div> 
                </div>

        {
            adminOrders.map((o,i) =>  <div className='text-[#d0d2d6] '>
            <div className=' flex justify-between items-start border-b border-slate-700'>
         <div className='py-3 w-[20%] font-medium whitespace-nowrap'>#{o._id}</div>
                <div className='py-3 w-[12%] font-medium'>{o.price} FCFA</div>
                <div className='py-3 w-[15%] font-medium'>
                    <span className={`px-2 py-1 rounded text-xs ${
                        o.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {o.payment_status === 'paid' ? 'Payé' : o.payment_status === 'unpaid' ? 'Non payé' : 'En attente'}
                    </span>
                </div>
                <div className='py-3 w-[15%] font-medium'>
                    <span className={`px-2 py-1 rounded text-xs ${
                        o.delivery_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        o.delivery_status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        o.delivery_status === 'warehouse' ? 'bg-purple-100 text-purple-800' :
                        o.delivery_status === 'placed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {o.delivery_status === 'pending' ? 'En attente' :
                         o.delivery_status === 'processing' ? 'En cours de préparation' :
                         o.delivery_status === 'warehouse' ? 'Entrepôt/Magasin' :
                         o.delivery_status === 'placed' ? 'Passée' :
                         o.delivery_status === 'cancelled' ? 'Annulée' : o.delivery_status}
                    </span>
                </div>
                <div className='py-3 w-[15%] font-medium'>{new Date(o.createdAt || o.date).toLocaleDateString('fr-FR')}</div>
                <div className='py-3 w-[15%] font-medium'>
                    <Link to={`/admin/dashboard/order/details/${o._id}`} >Voir</Link>
                     </div>
                <div onClick={(e) => setShow(o._id)} className='py-3 w-[8%] font-medium'><LuSquareArrowDown />
            </div> 
            </div> 
            
            
              <div className={show === o._id ? 'block border-b border-slate-700 bg-[#8288ed]' : 'hidden'}>
                   
            {
                o.suborder.map((so, i) =>  <div className=' flex justify-start items-start border-b border-slate-700'>
                <div className='py-3 w-[20%] font-medium whitespace-nowrap pl-3'>#{so._id}</div>
                <div className='py-3 w-[12%] font-medium'>{so.price} FCFA</div>
                <div className='py-3 w-[15%] font-medium'>
                    <span className={`px-2 py-1 rounded text-xs ${
                        so.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {so.payment_status === 'paid' ? 'Payé' : so.payment_status === 'unpaid' ? 'Non payé' : 'En attente'}
                    </span>
                </div>
                <div className='py-3 w-[15%] font-medium'>
                    <span className={`px-2 py-1 rounded text-xs ${
                        so.delivery_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        so.delivery_status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        so.delivery_status === 'warehouse' ? 'bg-purple-100 text-purple-800' :
                        so.delivery_status === 'placed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {so.delivery_status === 'pending' ? 'En attente' :
                         so.delivery_status === 'processing' ? 'En cours de préparation' :
                         so.delivery_status === 'warehouse' ? 'Entrepôt/Magasin' :
                         so.delivery_status === 'placed' ? 'Passée' :
                         so.delivery_status === 'cancelled' ? 'Annulée' : so.delivery_status}
                    </span>
                </div>
                <div className='py-3 w-[15%] font-medium'>{new Date(so.createdAt || so.date).toLocaleDateString('fr-FR')}</div> 
            </div>)
            }
             
                    </div>  
                </div> )
        }

 
 
 

            </div> 
        </div>

            {
                adminTotalOrder <= parPage ? "" : <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                <Pagination 
                    pageNumber = {currentPage}
                    setPageNumber = {setCurrentPage}
                    totalItem = {adminTotalOrder}
                    parPage = {parPage}
                    showItem = {4}
                />
                </div>
            }
                    



            </div> 
        </div>
    );
};

export default Orders;