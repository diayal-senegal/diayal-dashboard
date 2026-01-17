import React from 'react';

const Pending = () => {
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='text-center'>
                <h1 className='text-4xl font-bold text-yellow-600 mb-4'>Compte en attente de validation</h1>
                <h2 className='text-2xl font-semibold mb-4'> </h2>
                <p className='text-gray-600 mb-6'>Votre compte vendeur est en cours de validation par notre équipe.</p>
                <p className='text-gray-600'>Vous recevrez un email dès que votre compte sera activé.</p>
            </div>
        </div>
    );
};

export default Pending;