import React, { useEffect, useState } from 'react';
import Search from '../components/Search';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination'; 
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'; 
import { useDispatch, useSelector } from 'react-redux';
import { get_products, delete_product, messageClear } from '../../store/Reducers/productReducer';
import { LuImageMinus } from "react-icons/lu";
import toast from 'react-hot-toast';


const Products = () => {

    const dispatch = useDispatch()
    const { products, totalProduct, successMessage, errorMessage } = useSelector(state=> state.product)
   
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)

    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            dispatch(delete_product(id))
        }
    }

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
            dispatch(get_products({ parPage: parseInt(parPage), page: parseInt(currentPage), searchValue }))
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [successMessage, errorMessage, dispatch, parPage, currentPage, searchValue])


    useEffect(() => {
        const obj = {
            parPage: parseInt(parPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_products(obj))
    }, [searchValue, currentPage, parPage, dispatch])

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[#000000] font-semibold text-lg mb-3'>Tous les articles</h1>

         <div className='w-full p-4 bg-[#6a5fdf] rounded-md'> 
         <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue} />


         <div className='relative overflow-x-auto mt-5'>
    <table className='w-full text-sm text-left text-[#d0d2d6]'>
        <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
        <tr>
            <th scope='col' className='py-3 px-4'>N°</th>
            <th scope='col' className='py-3 px-4'>Image</th>
            <th scope='col' className='py-3 px-4'>Nom</th>
            <th scope='col' className='py-3 px-4'>Catégorie</th>
            <th scope='col' className='py-3 px-4'>Marque</th>
            <th scope='col' className='py-3 px-4'>Prix</th>
            <th scope='col' className='py-3 px-4'>Réduction</th>
            <th scope='col' className='py-3 px-4'>Stock</th>
            <th scope='col' className='py-3 px-4'>Actions</th> 
        </tr>
        </thead>

        <tbody>
            {
                products.map((d, i) => <tr key={i}>
                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{i + 1}</th>
                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                    <img className='w-[45px] h-[45px]' src={ d.images[0]} alt="" />
                    {d.isPreOrder && (
                        <span className='text-xs bg-amber-500 text-white px-1 rounded'>Précommande</span>
                    )}
                </th>
                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{ d?.name?.slice(0,15)}...</th>
                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{ d.category }</th>
                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{d.brand} </th>
                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{d.price} FCFA</th>
                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
                    {
                        d.discount === 0 ? <span>Sans réduction</span> : 

                        <span>- {d.discount} % de réduction</span>
                    }
                    
                     </th>
                
                <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>{d.stock}</th>
                 
    <th scope='row' className='py-1 px-4 font-medium whitespace-nowrap'>
        <div className='flex justify-start items-center gap-4'>
        <Link to={`/seller/dashboard/edit-product/${d._id}`} className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'> <FaEdit/> </Link> 

        <Link to={`/seller/dashboard/add-banner/${d._id}`} className='p-[6px] bg-sky-500 rounded hover:shadow-lg hover:shadow-sky-500/50'> <LuImageMinus /> </Link> 

        <Link to={`/seller/dashboard/product-details/${d._id}`} className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'> <FaEye/> </Link>
        <button onClick={() => handleDelete(d._id)} className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'> <FaTrash/> </button> 
        </div>
        
        </th>
            </tr> )
            }

            
        </tbody> 
    </table> 
    </div>  

            {
                totalProduct <= parPage ? "" : <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                <Pagination 
                    pageNumber = {currentPage}
                    setPageNumber = {setCurrentPage}
                    totalItem = {50}
                    parPage = {parPage}
                    showItem = {3}
                />
                </div>
            }


           
         </div>
        </div>
    );
};

export default Products;