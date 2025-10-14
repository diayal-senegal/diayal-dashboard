import React, { useEffect, useState } from 'react'; 
import Search from '../components/Search';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination'; 
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'; 
import { useDispatch, useSelector } from 'react-redux';
import { get_seller_orders } from '../../store/Reducers/OrderReducer';

const Orders = () => {

    const dispatch = useDispatch()

    const {myOrders,totalOrder } = useSelector(state => state.order)
    const {userInfo } = useSelector(state => state.auth)

    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)

    const formatDateFrench = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric'
        });
    };

    const fetchOrders = () => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue,
            sellerId: userInfo._id
        }
        dispatch(get_seller_orders(obj))
    }

    useEffect(() => {
        if (userInfo._id) {
            fetchOrders()
        }
    },[searchValue,currentPage,parPage,userInfo._id])

    // Auto-refresh every 30 seconds
    useEffect(() => {
        if (userInfo._id) {
            const interval = setInterval(() => {
                fetchOrders()
            }, 30000)
            return () => clearInterval(interval)
        }
    }, [currentPage, parPage, searchValue, userInfo._id])

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='flex justify-between items-center mb-3'>
                <h1 className='text-[#000000] font-semibold text-lg'>Commandes</h1>
                <button 
                    onClick={fetchOrders}
                    className='px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium'
                >
                    Actualiser
                </button>
            </div>

         <div className='w-full p-4 bg-[#6a5fdf] rounded-md'> 
         <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />


         <div className='relative overflow-x-auto mt-5'>
    <table className='w-full text-sm text-left text-[#d0d2d6]'>
        <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
        <tr>
             
            <th scope='col' className='py-3 px-4'>Commande n°</th>
            <th scope='col' className='py-3 px-4'>Prix</th>
            <th scope='col' className='py-3 px-4'>Statut paiement</th>
            <th scope='col' className='py-3 px-4'>Statut commande</th> 
            <th scope='col' className='py-3 px-4'>Date</th>
            <th scope='col' className='py-3 px-4'>Action</th> 
        </tr>
        </thead>

        <tbody>
            {
                myOrders.map((d, i) => (
                    <tr key={i}>
                        <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>#{d._id}</th>
                        <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{d.price} FCFA</th>
                        <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                            <span className={`px-2 py-1 rounded text-xs ${
                                d.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {d.payment_status === 'paid' ? 'Payé' : d.payment_status === 'unpaid' ? 'Non payé' : 'En attente'}
                            </span>
                        </th>
                        <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                            <span className={`px-2 py-1 rounded text-xs ${
                                d.delivery_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                d.delivery_status === 'warehouse' ? 'bg-blue-100 text-blue-800' :
                                d.delivery_status === 'shipping' ? 'bg-purple-100 text-purple-800' :
                                d.delivery_status === 'placed' ? 'bg-green-100 text-green-800' :
                                d.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                d.delivery_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {d.delivery_status === 'pending' ? 'En attente' :
                                 d.delivery_status === 'warehouse' ? 'En cours de préparation' :
                                 d.delivery_status === 'shipping' ? 'En cours de livraison' :
                                 d.delivery_status === 'placed' ? 'Passée' :
                                 d.delivery_status === 'delivered' ? 'Livrée' :
                                 d.delivery_status === 'cancelled' ? 'Annulée' : 
                                 d.delivery_status}
                            </span>
                        </th> 
                        <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{formatDateFrench(d.date)}</th> 
                        <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                            <div className='flex justify-start items-center gap-4'>
                                <Link to={`/seller/dashboard/order/details/${d._id}`} className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'> 
                                    <FaEye/> 
                                </Link>
                            </div>
                        </th>
                    </tr>
                ))
            }

            
        </tbody> 
    </table> 
    </div>  

    {
        totalOrder <= parPage ? "" : <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
        <Pagination 
            pageNumber = {currentPage}
            setPageNumber = {setCurrentPage}
            totalItem = {totalOrder}
            parPage = {parPage}
            showItem = {3}
        />
        </div>
    }

    


           
         </div>
        </div>
    );
};

export default Orders;