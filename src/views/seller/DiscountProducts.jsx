import React, { useState, useEffect } from 'react'; 
import Search from '../components/Search';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination'; 
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
// import { delete_product, get_products } from '../../store/Reducers/productReducer'; // Décommentez quand disponible 

const DiscountProducts = () => {
    const dispatch = useDispatch()
    const { products, totalProduct, loader } = useSelector(state => state.product)

    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [parPage, setParPage] = useState(5)
    const [deletedProducts, setDeletedProducts] = useState([])

    // Charger les produits au démarrage
    useEffect(() => {
        // dispatch(get_products({ parPage, page: currentPage, searchValue })); // Décommentez quand disponible
    }, [dispatch, parPage, currentPage, searchValue])

    // Filtrer les produits avec réduction et exclure les produits supprimés
    const discountProducts = products?.filter(product => 
        product.discount > 0 && !deletedProducts.includes(product._id)
    ) || []

    // Fonction pour supprimer un produit
    const handleDelete = (productId, productName) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${productName}" ?`)) {
            try {
                // Suppression locale temporaire
                setDeletedProducts(prev => [...prev, productId]);
                
                // dispatch(delete_product(productId)); // Décommentez quand l'action est disponible
                toast.success(`Produit "${productName}" supprimé avec succès`);
            } catch (error) {
                toast.error('Erreur lors de la suppression du produit');
            }
        }
    }

    // Fonction pour voir les détails - affiche les informations dans une alerte
    const handleViewDetails = (product) => {
        const details = `
        Nom: ${product.name}
        Catégorie: ${product.category}
        Marque: ${product.brand}
        Prix: ${product.price} FCFA
        Réduction: ${product.discount}%
        Stock: ${product.stock}
        Description: ${product.description || 'Aucune description'}
        `;
        alert(details);
    }

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-[#000000] font-semibold text-lg mb-3'>Articles en promotion</h1>

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
                discountProducts.length > 0 ? discountProducts.map((product, i) => <tr key={product._id}>
                <td className='py-1 px-4 font-medium whitespace-nowrap'>{i + 1}</td>
                <td className='py-1 px-4 font-medium whitespace-nowrap'>
                    {product.images?.[0] ? (
                        <img className='w-[45px] h-[45px] rounded' src={product.images[0]} alt={product.name} />
                    ) : (
                        <div className='w-[45px] h-[45px] bg-gray-300 rounded flex items-center justify-center text-gray-600 text-xs'>
                            Img
                        </div>
                    )}
                </td>
                <td className='py-1 px-4 font-medium whitespace-nowrap'>{product.name}</td>
                <td className='py-1 px-4 font-medium whitespace-nowrap'>{product.category}</td>
                <td className='py-1 px-4 font-medium whitespace-nowrap'>{product.brand}</td>
                <td className='py-1 px-4 font-medium whitespace-nowrap'>{product.price} FCFA</td>
                <td className='py-1 px-4 font-medium whitespace-nowrap'>- {product.discount} %</td>
                <td className='py-1 px-4 font-medium whitespace-nowrap'>{product.stock}</td>
                 
                <td className='py-1 px-4 font-medium whitespace-nowrap'>
                    <div className='flex justify-start items-center gap-4'>
                        <Link 
                            to={`/seller/dashboard/edit-product/${product._id}`}
                            className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'
                            title='Modifier le produit'
                        > 
                            <FaEdit/> 
                        </Link> 
                        <button 
                            onClick={() => handleViewDetails(product)}
                            className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'
                            title='Voir les détails'
                        > 
                            <FaEye/> 
                        </button>
                        <button 
                            onClick={() => handleDelete(product._id, product.name)}
                            className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'
                            title='Supprimer le produit'
                        > 
                            <FaTrash/> 
                        </button> 
                    </div>
                </td>
            </tr> ) : (
                <tr>
                    <td colSpan="9" className='py-4 px-4 text-center text-gray-400'>
                        Aucun article en promotion trouvé
                    </td>
                </tr>
            )
            }

            
        </tbody> 
    </table> 
    </div>  

    <div className='w-full flex justify-end mt-4 bottom-4 right-4'>
        <Pagination 
            pageNumber = {currentPage}
            setPageNumber = {setCurrentPage}
            totalItem = {discountProducts.length}
            parPage = {parPage}
            showItem = {3}
        />
        </div>


           
         </div>
        </div>
    );
};

export default DiscountProducts;