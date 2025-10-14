import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { get_active_sellers } from '../../store/Reducers/sellerReducer';

const Sellers = () => {

    const dispatch = useDispatch()

    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [show, setShow] =  useState(false)

    const {sellers,totalSeller } = useSelector(state => state.seller)


    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_active_sellers(obj))
    },[searchValue,currentPage,parPage,dispatch])
 
    return (
        <div className='px-2 lg:px-7 pt-5'>
             <h1 className='text-[20px] font-bold mb-3'>Vendeur </h1>
             <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
            
             <div className='flex justify-between items-center'>
                    <select onChange={(e) => setParPage(parseInt(e.target.value))} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option> 
                    </select>
                    <input  onChange={e => setSearchValue(e.target.value)} value={searchValue} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]' type="text" placeholder='search' /> 
                </div>

                <div className='relative overflow-x-auto'>
    <table className='w-full text-sm text-left text-[#d0d2d6]'>
        <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
        <tr>
            <th scope='col' className='py-3 px-4'>N°</th>
            <th scope='col' className='py-3 px-4'>Image</th>
            <th scope='col' className='py-3 px-4'>Nom</th>
            <th scope='col' className='py-3 px-4'>Nom de boutique</th> 
            <th scope='col' className='py-3 px-4'>Statut paiement</th> 
            <th scope='col' className='py-3 px-4'>Email</th> 
            <th scope='col' className='py-3 px-4'>Statut</th> 
            <th scope='col' className='py-3 px-4'>Région</th> 
            <th scope='col' className='py-3 px-4'>Action</th> 
        </tr>
        </thead>

        <tbody>
            {
                sellers.map((d, i) => <tr key={i}>
                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{i+1}</th>
                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                    <img className='w-[45px] h-[45px]' src={ d.image } alt="" />
                </th>
                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{ d.name } </th>
                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{ d.shopInfo?.shopName }</th>
                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                    <span>{ d.payment }</span> </th>
                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{ d.email } </th>

                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{ d.status } </th>

                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{ d.shopInfo?.district } </th>
                 
                <h scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                    <div className='flex justify-start items-center gap-4'>
                    <Link to={`/admin/dashboard/seller/details/${d._id}`} className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'> <FaEye /> </Link> 
                    
                    </div>
                    
                    </h>
            </tr> )
            }

            
        </tbody> 
    </table> 
    </div>  

   {
     totalSeller <= parPage ? <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
     <Pagination 
         pageNumber = {currentPage}
         setPageNumber = {setCurrentPage}
         totalItem = {totalSeller}
         parPage = {parPage}
         showItem = {4}
     />
     </div> : ""
   }
    






             </div>
            
        </div>
    );
};

export default Sellers;