import React from 'react';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
    return (
        <div className='min-w-screen min-h-screen bg-[#cdcae9] py-8'>
            <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800 mb-4'>Règlement Vendeurs - Diayal</h1>
                    <p className='text-gray-600'>Conditions générales pour les vendeurs sur la plateforme Diayal</p>
                </div>

                <div className='space-y-6 text-gray-700'>
                    <section>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>1. Objet</h2>
                        <p>Le présent règlement définit les obligations et responsabilités des vendeurs/artisans utilisant la plateforme Diayal pour vendre leurs produits aux acheteurs. Il complète les CGU générales et est exclusivement destiné aux vendeurs.</p>
                    </section>

                    <section>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>2. Acceptation</h2>
                        <ul className='list-disc pl-6 space-y-2'>
                            <li>La création d'un compte vendeur vaut acceptation intégrale de ce règlement.</li>
                            <li>Les vendeurs doivent accepter explicitement ce document via la case à cocher prévue lors de l'inscription.</li>
                            <li>Toute violation du règlement peut entraîner la suspension ou la fermeture du compte.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>3. Compte vendeur</h2>
                        <ul className='list-disc pl-6 space-y-2'>
                            <li>Les informations fournies doivent être exactes, complètes et à jour, notamment identité, coordonnées, numéro de téléphone et informations bancaires.</li>
                            <li>Le vendeur est responsable de la sécurité de son compte et de ses identifiants.</li>
                            <li>Toute activité effectuée avec son compte est présumée faite par le vendeur.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>4. Produits et contenus</h2>
                        <ul className='list-disc pl-6 space-y-2'>
                            <li>Les vendeurs sont responsables de l'exactitude et de la conformité des informations sur leurs produits : description, prix, images, caractéristiques techniques.</li>
                            <li>Les produits doivent respecter la législation en vigueur, ne pas être contrefaits, interdits ou dangereux.</li>
                            <li>Le vendeur garantit détenir tous les droits sur les photos et textes publiés.</li>
                            <li><strong>TAILLE DES PHOTOS A PRECISER</strong></li>
                        </ul>
                        
                        <div className='mt-4'>
                            <h3 className='text-lg font-semibold text-gray-800 mb-2'>4.1 Respect du concept Diayal</h3>
                            <ul className='list-disc pl-6 space-y-2'>
                                <li>Le vendeur s'engage à vendre uniquement des produits artisanaux sénégalais authentiques, fabriqués localement.</li>
                                <li>Tout produit ne respectant pas ce principe peut entraîner suspension ou suppression du compte.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>5. Préparation, emballage et expédition</h2>
                        <ul className='list-disc pl-6 space-y-2'>
                            <li>Les produits doivent être préparés soigneusement, complets, et dans leur emballage d'origine ou adéquat.</li>
                            <li>Le colis doit être intact et conforme à ce qui est décrit dans la fiche produit.</li>
                            <li>Les délais de livraison indiqués à l'acheteur doivent être strictement respectés. A défaut le vendeur se doit d'informer au plus vite l'acheteur du retard de livraison.</li>
                            <li>Tout retard ou défaut de préparation peut entraîner la suspension du compte ou le refus de remboursement.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>6. Paiement et commission</h2>
                        <ul className='list-disc pl-6 space-y-2'>
                            <li>Diayal prélève une commission automatique sur chaque vente.</li>
                            <li>Le montant de cette commission est confidentiel et n'est pas communiqué aux acheteurs.</li>
                            <li>Les paiements des ventes sont sécurisés via Stripe (cartes) et PayDunya / CinetPay (Mobile Money).</li>
                            <li>Le vendeur s'engage à fournir des informations bancaires correctes pour la réception des fonds.</li>
                            <li>La commission prélevée par Diayal sur chaque vente est définitive. En cas de retour du produit ou de remboursement à l'acheteur, la commission déjà prélevée n'est pas reversée au vendeur. Cette commission correspond à la rémunération de la plateforme pour la mise en relation et la sécurisation des paiements.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>7. Communication avec l'acheteur</h2>
                        <ul className='list-disc pl-6 space-y-2'>
                            <li>Les vendeurs doivent répondre rapidement aux questions et demandes des acheteurs.</li>
                            <li>Tout retard ou absence de réponse peut impacter la visibilité du vendeur sur la plateforme.</li>
                            <li>Les litiges doivent être traités de manière professionnelle et transparente.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>8. Gestion des retours et litiges</h2>
                        <ul className='list-disc pl-6 space-y-2'>
                            <li>Le vendeur est responsable de la conformité et de la livraison du produit.</li>
                            <li>Les retours ne sont acceptés que si le produit est renvoyé intact, non utilisé, complet, dans son emballage d'origine et accompagné de tous accessoires.</li>
                            <li>Les produits personnalisés, alimentaires ou périssables sont exclus des retours.</li>
                            <li>Le vendeur doit coopérer avec l'acheteur et Diayal pour résoudre les litiges dans un délai raisonnable.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>9. Obligations légales et fiscales</h2>
                        <ul className='list-disc pl-6 space-y-2'>
                            <li>Le vendeur est responsable de la déclaration de ses revenus, impôts et taxes.</li>
                            <li>Le vendeur s'engage à respecter la législation locale, notamment sur la consommation, la propriété intellectuelle et la protection des données.</li>
                            <li>Diayal n'est pas responsable de l'omission de ces obligations par le vendeur.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>10. Responsabilités</h2>
                        <p className='mb-2'>Le vendeur est seul responsable de :</p>
                        <ul className='list-disc pl-6 space-y-2'>
                            <li>La qualité et conformité des produits.</li>
                            <li>Le respect des délais de livraison.</li>
                            <li>La gestion des litiges avec l'acheteur.</li>
                        </ul>
                        <p className='mt-2'>Diayal n'est responsable que de la mise en relation et de la sécurisation des paiements.</p>
                    </section>

                    <section>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>11. Contenu et propriété intellectuelle</h2>
                        <ul className='list-disc pl-6 space-y-2'>
                            <li>Tout contenu publié par le vendeur doit être original et conforme aux lois sur la propriété intellectuelle.</li>
                            <li>Diayal peut retirer tout contenu illicite, frauduleux ou inapproprié sans préavis.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>12. Suspension et résiliation</h2>
                        <p className='mb-2'>Diayal peut suspendre ou fermer le compte vendeur en cas de :</p>
                        <ul className='list-disc pl-6 space-y-2'>
                            <li>Non-respect de ce règlement.</li>
                            <li>Fraude ou abus.</li>
                            <li>Produits dangereux ou interdits.</li>
                        </ul>
                        <p className='mt-2'>En cas de fermeture, le vendeur reste redevable des commissions sur les ventes déjà réalisées.</p>
                    </section>

                    <section>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>13. Modification du règlement</h2>
                        <ul className='list-disc pl-6 space-y-2'>
                            <li>Diayal peut modifier ce règlement à tout moment.</li>
                            <li>Les modifications sont applicables aux ventes futures et aux comptes actifs.</li>
                            <li>Les vendeurs seront informés via leur espace personnel ou par email.</li>
                            <li>La poursuite de l'utilisation du service après modification vaut acceptation des nouvelles conditions.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>14. Loi applicable et juridiction</h2>
                        <ul className='list-disc pl-6 space-y-2'>
                            <li>Ce règlement est régi par la loi sénégalaise.</li>
                            <li>Les juridictions sénégalaises sont compétentes pour tout litige relatif à ce règlement.</li>
                        </ul>
                    </section>
                </div>

                <div className='mt-8 pt-6 border-t border-gray-200 text-center'>
                    <Link 
                        to="/register" 
                        className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200'
                    >
                        Retour à l'inscription
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;