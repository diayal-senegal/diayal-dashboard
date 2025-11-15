import React from 'react';

const BannerValidationTest = () => {
    return (
        <div className='px-2 lg:px-7 pt-5'>
            <h1 className='text-red-600 font-bold text-2xl mb-3'>TEST - Validation des Bannières</h1>
            <div className='bg-red-100 p-4 rounded border-2 border-red-500'>
                <p className='text-red-800 font-semibold'>✅ Cette page de test fonctionne !</p>
                <p className='text-red-700'>Date: {new Date().toLocaleString()}</p>
                <p className='text-red-700'>URL: {window.location.pathname}</p>
            </div>
        </div>
    );
};

export default BannerValidationTest;