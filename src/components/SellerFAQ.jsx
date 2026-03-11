import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const SellerFAQ = () => {
    const [openSection, setOpenSection] = useState(null);

    const faqData = [
        {
            id: 1,
            title: "1️⃣ Compte vendeur et inscription",
            questions: [
                {
                    q: "Comment créer un compte vendeur sur Diayal ?",
                    r: "Cliquez sur \"S'inscrire en tant que vendeur\", remplissez vos informations exactes (identité, contacts, coordonnées bancaires), acceptez le Règlement Vendeurs, puis validez. La création du compte vous permet de publier vos produits et gérer vos ventes."
                },
                {
                    q: "Que se passe-t-il si mes informations changent ?",
                    r: "Vous devez mettre à jour immédiatement votre profil (adresse, téléphone, coordonnées bancaires). Diayal ne peut être tenu responsable d'éventuels problèmes liés à des informations obsolètes."
                }
            ]
        },
        {
            id: 2,
            title: "2️⃣ Produits et contenu",
            questions: [
                {
                    q: "Quels types de produits puis-je vendre ?",
                    r: "Tous produits artisanaux légaux, sûrs et conformes à la législation sénégalaise et internationale. Les produits contrefaits, dangereux ou interdits sont strictement prohibés."
                },
                {
                    q: "Comment publier un produit ?",
                    r: "Ajoutez le titre, description détaillée, images claires, prix et options (taille, couleur, etc.). Assurez-vous que la description reflète exactement le produit livré."
                },
                {
                    q: "Qui est responsable du contenu publié ?",
                    r: "Vous êtes responsable de tout le contenu que vous publiez (images, textes). Vous devez détenir tous les droits nécessaires et garantir que le contenu n'enfreint pas la propriété intellectuelle d'un tiers."
                }
            ]
        },
        {
            id: 3,
            title: "3️⃣ Respect du concept Diayal",
            questions: [
                {
                    q: "Que signifie respecter le concept Diayal ?",
                    r: "Vous devez vendre uniquement des produits artisanaux sénégalais authentiques. Tout produit non conforme peut entraîner la suspension ou la suppression de votre compte."
                },
                {
                    q: "Dois-je prouver que mes produits sont artisanaux sénégalais ?",
                    r: "Oui, Diayal peut vous demander des preuves de l'origine et de la fabrication locale de vos produits. Fournir des informations exactes garantit votre crédibilité sur la plateforme."
                }
            ]
        },
        {
            id: 4,
            title: "4️⃣ Préparation et expédition",
            questions: [
                {
                    q: "Comment préparer mes colis ?",
                    r: "Chaque produit doit être soigneusement emballé, complet et dans son emballage d'origine ou adéquat. Les produits endommagés ou mal préparés peuvent entraîner des sanctions sur la plateforme."
                },
                {
                    q: "Qui est responsable de la livraison ?",
                    r: "Vous êtes responsable de l'expédition et de la livraison dans les délais annoncés. Respectez scrupuleusement les informations fournies à l'acheteur."
                },
                {
                    q: "Que faire si le produit est perdu ou endommagé en cours de livraison ?",
                    r: "Vous devez collaborer avec le transporteur et l'acheteur pour résoudre le problème. Si la responsabilité du dommage incombe au vendeur, vous devez assurer un remplacement ou remboursement conforme aux conditions."
                }
            ]
        },
        {
            id: 5,
            title: "5️⃣ Paiement et commission",
            questions: [
                {
                    q: "Quelle commission Diayal prélève-t-elle ?",
                    r: "Diayal prélève une commission sur chaque vente pour la mise en relation et la sécurisation des paiements. Le montant exact est confidentiel et non communiqué aux acheteurs."
                },
                {
                    q: "La commission est-elle remboursable ?",
                    r: "Non. En cas de retour ou de remboursement du produit, la commission déjà prélevée par Diayal n'est pas reversée au vendeur. Cette commission correspond au service fourni par la plateforme."
                },
                {
                    q: "Quand vais-je recevoir mes paiements ?",
                    r: "Les clients paient leurs commandes via mobile money. Après validation de la commande, Diayal vous envoie votre paiement directement sur votre numéro Wave, Orange Money ou autre service mobile money enregistré dans votre compte vendeur."
                }
            ]
        },
        {
            id: 6,
            title: "6️⃣ Retours et litiges",
            questions: [
                {
                    q: "Comment gérer un retour ?",
                    r: "Si un produit est retourné, assurez-vous qu'il est intact, complet et dans son emballage d'origine. Les produits personnalisés, alimentaires ou périssables peuvent être exclus des retours."
                },
                {
                    q: "Que faire en cas de litige avec un acheteur ?",
                    r: "Communiquez rapidement avec l'acheteur pour résoudre le problème. Si nécessaire, contactez Diayal pour assistance et médiation."
                },
                {
                    q: "Que se passe-t-il si un produit est retourné ou remboursé ?",
                    r: "Vous devez accepter le retour selon les conditions, mais la commission prélevée par Diayal ne sera pas remboursée."
                }
            ]
        },
        {
            id: 7,
            title: "7️⃣ Communication avec l'acheteur",
            questions: [
                {
                    q: "Comment répondre aux questions des acheteurs ?",
                    r: "Soyez réactif et clair dans vos réponses. La qualité de votre communication impacte votre réputation sur la plateforme et votre visibilité."
                },
                {
                    q: "Que faire si un acheteur ne répond pas ou conteste une transaction ?",
                    r: "Conservez toutes les preuves (messages, photos, factures) et contactez Diayal pour médiation si le litige ne peut être résolu directement."
                }
            ]
        },
        {
            id: 8,
            title: "8️⃣ Obligations légales et fiscales",
            questions: [
                {
                    q: "Suis-je responsable de la fiscalité ?",
                    r: "Oui. Vous êtes responsable de déclarer vos revenus et de payer vos taxes conformément à la législation sénégalaise et internationale. Diayal n'intervient pas dans cette gestion."
                },
                {
                    q: "Que faire si la législation change ?",
                    r: "Vous devez vous conformer aux nouvelles lois et régulations. Diayal peut mettre à jour le Règlement Vendeurs, mais le respect des obligations légales vous incombe."
                }
            ]
        },
        {
            id: 9,
            title: "9️⃣ Sécurité et confidentialité",
            questions: [
                {
                    q: "Mes informations sont-elles protégées ?",
                    r: "Oui. Diayal respecte la confidentialité et la sécurité de vos données, utilisées uniquement pour la gestion de votre compte et des paiements."
                },
                {
                    q: "Que faire si mon compte est compromis ?",
                    r: "Informez immédiatement Diayal et changez vos identifiants. Toute activité effectuée avant notification est présumée faite par vous."
                }
            ]
        },
        {
            id: 10,
            title: "🔟 Suspension et résiliation",
            questions: [
                {
                    q: "Dans quels cas mon compte peut-il être suspendu ?",
                    r: "Suspension possible en cas de non-respect du règlement, fraude, produits interdits ou non-respect des obligations de livraison."
                },
                {
                    q: "Que se passe-t-il si mon compte est résilié ?",
                    r: "Vos ventes passées restent valides et la commission prélevée par Diayal n'est jamais remboursée. Vous ne pourrez plus publier de nouveaux produits."
                }
            ]
        }
    ];

    const bestPractices = [
        "Préparer et emballer correctement chaque produit.",
        "Fournir des descriptions et images précises.",
        "Répondre rapidement aux questions des acheteurs.",
        "Respecter les délais et frais de livraison annoncés.",
        "Conserver toutes les preuves pour résoudre d'éventuels litiges.",
        "Toujours vérifier que vos informations personnelles sont à jour."
    ];

    const toggleSection = (sectionId) => {
        setOpenSection(openSection === sectionId ? null : sectionId);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">FAQ Vendeur Diayal</h1>
                <p className="text-gray-600">Trouvez rapidement les réponses à vos questions</p>
            </div>

            <div className="space-y-4">
                {faqData.map((section) => (
                    <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full px-6 py-4 text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200 flex justify-between items-center"
                        >
                            <h2 className="text-lg font-semibold text-gray-800">{section.title}</h2>
                            {openSection === section.id ? (
                                <FaChevronUp className="text-blue-600" />
                            ) : (
                                <FaChevronDown className="text-blue-600" />
                            )}
                        </button>
                        
                        {openSection === section.id && (
                            <div className="px-6 py-4 bg-white">
                                {section.questions.map((qa, index) => (
                                    <div key={index} className="mb-6 last:mb-0">
                                        <div className="flex items-start mb-2">
                                            <span className="inline-block w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">Q</span>
                                            <h3 className="font-semibold text-gray-800 leading-relaxed">{qa.q}</h3>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="inline-block w-6 h-6 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">R</span>
                                            <p className="text-gray-700 leading-relaxed">{qa.r}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                    <span className="mr-2">✨</span>
                    Bonnes pratiques pour bien vendre sur Diayal
                </h2>
                <ul className="space-y-2">
                    {bestPractices.map((practice, index) => (
                        <li key={index} className="flex items-start">
                            <span className="text-green-600 mr-2 mt-1">•</span>
                            <span className="text-gray-700">{practice}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 text-center">
                    <strong>Note importante :</strong> Pour tout détail légal, veuillez consulter le Règlement Vendeurs que vous avez accepté à l'inscription.
                </p>
            </div>
        </div>
    );
};

export default SellerFAQ;