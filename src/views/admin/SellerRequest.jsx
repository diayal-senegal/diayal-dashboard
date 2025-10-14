import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
import {  FaEye } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { get_seller_request } from '../../store/Reducers/sellerReducer';
import Search from '../components/Search';

const SellerRequest = () => {
    const dispatch = useDispatch();
    const { sellers, totalSeller } = useSelector(state => state.seller);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [parPage, setParPage] = useState(5);

    useEffect(() => {
        dispatch(get_seller_request({
            searchValue, 
            parPage, 
            page: currentPage
        }));
    }, [currentPage, parPage, searchValue, dispatch]);

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[20px] font-bold mb-3'>
                Demandes de vendeurs
            </h1>
         
            <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
                <Search setParPage={setParPage} setSearchValue={setSearchValue} searchValue={searchValue}/>

                <div className='relative overflow-x-auto'>
                    <table className='w-full text-sm text-[#d0d2d6] text-left'>
                        <thead className='text-sm text-[#d0d2d6] uppercase border-b border-slate-700'>
                            <tr>
                                <th scope='col' className='px-4 py-4'>n°</th>
                                <th scope='col' className='px-4 py-4'>Nom</th>
                                <th scope='col' className='px-4 py-4'>Email</th>
                                <th scope='col' className='px-4 py-4'>Statut paiement</th>
                                <th scope='col' className='px-4 py-4'>Statut</th>
                                <th scope='col' className='px-4 py-4'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                sellers.map((d, i) => <tr className='border-b border-slate-700' key={i}>
                                    <td className='px-4 py-2 font-medium whitespace-nowrap'>{i+1}</td>
                                    <td className='px-4 py-2 font-medium whitespace-nowrap'>{d.name}</td>
                                    <td className='px-4 py-2 font-medium whitespace-nowrap'>{d.email}</td>
                                    <td className='px-4 py-2 font-medium whitespace-nowrap'>
                                        <span className='bg-yellow-500 text-white px-2 py-1 rounded'>{d.status}</span>
                                    </td>
                                    <td className='px-4 py-2 font-medium whitespace-nowrap'>
                                        {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className='px-4 py-2 font-medium whitespace-nowrap'>
                                        <div className='flex justify-start items-center gap-4'>
                                            <Link to={`/admin/dashboard/seller/details/${d._id}`} className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'> 
                                                <FaEye />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>)
                            }
                        </tbody>
                    </table> 
                </div>
                
                <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
                    <Pagination 
                        pageNumber={currentPage}
                        setPageNumber={setCurrentPage}
                        totalItem={totalSeller}
                        parPage={parPage}
                        showItem={3}
                    />
                </div>
            </div>
        </div>
    );
};

export default SellerRequest;