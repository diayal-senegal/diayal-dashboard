import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='text-center'>
                <h1 className='text-4xl font-bold text-red-600 mb-4'>403</h1>
                <h2 className='text-2xl font-semibold mb-4'>Accès non autorisé</h2>
                <p className='text-gray-600 mb-6'>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
                <Link to='/login' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                    Retour à la connexion
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;