import React from 'react';

const Deactive = () => {
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='text-center'>
                <h1 className='text-4xl font-bold text-red-600 mb-4'>Compte désactivé</h1>
                <h2 className='text-2xl font-semibold mb-4'>Votre compte a été désactivé</h2>
                <p className='text-gray-600 mb-6'>Votre compte vendeur a été temporairement désactivé.</p>
                <p className='text-gray-600'>Contactez notre support pour plus d'informations.</p>
            </div>
        </div>
    );
};

export default Deactive;