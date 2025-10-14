import React from 'react';
import { Link } from 'react-router-dom';

const VendorRules = () => {
    return (
        <div className='min-w-screen min-h-screen bg-[#cdcae9] flex justify-center items-center p-4'>
            <div className='w-full max-w-4xl text-[#ffffff]'>
                <div className='bg-[#6f68d1] p-6 rounded-md'>
                    <h2 className='text-2xl mb-4 font-bold text-center'>
                        Règlement Vendeurs - Diayal
                    </h2>
                    
                    <div className='space-y-4 text-sm'>
                        <section>
                            <h3 className='text-lg font-semibold mb-2'>1. Conditions d'inscription</h3>
                            <p>Pour devenir vendeur sur Diayal, vous devez être majeur et fournir des informations exactes lors de votre inscription.</p>
                        </section>

                        <section>
                            <h3 className='text-lg font-semibold mb-2'>2. Qualité des produits</h3>
                            <p>Tous les produits mis en vente doivent être conformes aux descriptions et de bonne qualité. Les produits défectueux ou non conformes peuvent entraîner la suspension du compte.</p>
                        </section>

                        <section>
                            <h3 className='text-lg font-semibold mb-2'>3. Service client</h3>
                            <p>Les vendeurs s'engagent à répondre aux questions des clients dans un délai de 24h et à traiter les commandes rapidement.</p>
                        </section>

                        <section>
                            <h3 className='text-lg font-semibold mb-2'>4. Commissions</h3>
                            <p>Diayal prélève une commission sur chaque vente. Les détails des commissions sont disponibles dans votre espace vendeur.</p>
                        </section>

                        <section>
                            <h3 className='text-lg font-semibold mb-2'>5. Respect des règles</h3>
                            <p>Le non-respect de ce règlement peut entraîner la suspension ou la fermeture définitive du compte vendeur.</p>
                        </section>
                    </div>

                    <div className='mt-6 text-center'>
                        <Link to='/register' className='bg-[#0a0827] hover:bg-[#1a1537] text-white font-bold py-2 px-6 rounded mr-4'>
                            J'accepte et je m'inscris
                        </Link>
                        <Link to='/login' className='bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded'>
                            Retour
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorRules;