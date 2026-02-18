import { AiOutlineDashboard, AiOutlineShoppingCart } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { FaUserTimes, FaUsers } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { FaCodePullRequest } from "react-icons/fa6";
import { IoIosChatbubbles } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { MdViewList } from "react-icons/md";
import { TbBasketDiscount } from "react-icons/tb";
import { BsCartCheck } from "react-icons/bs"; 
import { IoChatbubbles } from "react-icons/io5";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { MdAddPhotoAlternate } from "react-icons/md";
import { RiCoupon3Line } from "react-icons/ri";
import { MdVerified } from "react-icons/md";
import { MdPublish } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaHeadset } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { FaTruck, FaRoute, FaUsersCog, FaCog } from "react-icons/fa";

export const allNav = [
    {
        id : 1,
        title : 'Tableau de bord',
        icon : <AiOutlineDashboard />,
        role : 'admin',
        path: '/admin/dashboard'
    },
    {
        id : 2,
        title : 'Commandes',
        icon : <AiOutlineShoppingCart />,
        role : 'admin',
        path: '/admin/dashboard/orders'
    },
    {
        id : 3,
        title : 'Categories',
        icon : <BiCategory  />,
        role : 'admin',
        path: '/admin/dashboard/category'
    },
    {
        id : 4,
        title : 'Vendeurs',
        icon : <FaUsers   />,
        role : 'admin',
        path: '/admin/dashboard/sellers'
    },
    {
        id : 5,
        title : 'Demandes paiements',
        icon : <MdPayment />,
        role : 'admin',
        path: '/admin/dashboard/payment-request'
    },
    {
        id : 6,
        title : 'Vendeurs désactivés',
        icon : <FaUserTimes />,
        role : 'admin',
        path: '/admin/dashboard/deactive-sellers'
    },
    {
        id : 7,
        title : 'Demandes  vendeurs',
        icon : <FaCodePullRequest />,
        role : 'admin',
        path: '/admin/dashboard/sellers-request'
    },
    {
        id : 8,
        title : 'Support vendeurs',
        icon : <IoIosChatbubbles />,
        role : 'admin',
        path: '/admin/dashboard/chat-sellers'
    },
    {
        id : 20,
        title : 'Validation Bannières',
        icon : <MdVerified />,
        role : 'admin',
        path: '/admin/dashboard/banner-validation'
    },
    {
        id : 21,
        title : 'Bannières Publiées',
        icon : <MdPublish />,
        role : 'admin',
        path: '/admin/dashboard/published-banners'
    },
    {
        id : 22,
        title : 'Newsletter',
        icon : <MdEmail />,
        role : 'admin',
        path: '/admin/dashboard/newsletter'
    },
    {
        id : 25,
        title : 'Inscriptions Teaser',
        icon : <FaUsers />,
        role : 'admin',
        path: '/admin/dashboard/vendor-teaser'
    },
    {
        id : 23,
        title : 'Gestion Promotions',
        icon : <TbBasketDiscount />,
        role : 'admin',
        path: '/admin/dashboard/deals-manager'
    },
    {
        id : 24,
        title : 'Support Client',
        icon : <FaHeadset />,
        role : 'admin',
        path: '/admin/dashboard/customer-support'
    },
    {
        id : 26,
        title : 'Messages Contact',
        icon : <FaEnvelope />,
        role : 'admin',
        path: '/admin/dashboard/contact-messages'
    },
    {
        id : 27,
        title : 'Commissions Ventes',
        icon : <FaMoneyBillWave />,
        role : 'admin',
        path: '/admin/dashboard/commissions'
    },
    {
        id : 28,
        title : 'Commissions Livraisons',
        icon : <FaTruck />,
        role : 'admin',
        path: '/admin/dashboard/delivery-commissions'
    },
    {
        id : 29,
        title : 'Queue Livraisons',
        icon : <FaTruck />,
        role : 'admin',
        path: '/admin/dashboard/delivery-queue'
    },
    {
        id : 30,
        title : 'Gestion Couriers',
        icon : <FaUsersCog />,
        role : 'admin',
        path: '/admin/dashboard/courier-management'
    },
    {
        id : 31,
        title : 'Réassignation Livraisons',
        icon : <FaRoute />,
        role : 'admin',
        path: '/admin/dashboard/delivery-reassignment'
    },
    {
        id : 32,
        title : 'Suivi Livraisons',
        icon : <FaTruck />,
        role : 'admin',
        path: '/admin/dashboard/delivery-tracking'
    },
    {
        id : 33,
        title : 'Paramètres',
        icon : <FaCog />,
        role : 'admin',
        path: '/admin/dashboard/settings'
    },
    {
        id : 9,
        title : 'Tableau de bord',
        icon : <AiOutlineDashboard />,
        role : 'seller',
        path: '/seller/dashboard'
    },
    {
        id : 10,
        title : 'Ajouter articles',
        icon : <IoMdAdd />,
        role : 'seller',
        path: '/seller/dashboard/add-product'
    },     
    {
        id : 11,
        title : 'Catalogue',
        icon : <MdViewList />,
        role : 'seller',
        path: '/seller/dashboard/products'
    },
    {
        id : 12,
        title : 'Articles en promotion',
        icon : <TbBasketDiscount />,
        role : 'seller',
        path: '/seller/dashboard/discount-products'
    },
    {
        id : 13,
        title : 'Commandes',
        icon : <BsCartCheck />,
        role : 'seller',
        path: '/seller/dashboard/orders'
    },
    {
        id : 14,
        title : 'Revenus et retraits',
        icon : <MdPayment />,
        role : 'seller',
        path: '/seller/dashboard/payments'
    },
    {
        id : 15,
        title : 'Messages clients',
        icon : <IoChatbubbles />,
        role : 'seller',
        path: '/seller/dashboard/chat-customer'
    },
    {
        id : 16,
        title : 'Aide & support',
        icon : <BsFillChatQuoteFill />,
        role : 'seller',
        path: '/seller/dashboard/chat-support'
    },
    {
        id : 17,
        title : 'Profil',
        icon : <CgProfile />,
        role : 'seller',
        path: '/seller/dashboard/profile'
    },
    {
        id : 18,
        title : 'Ajouter Bannière',
        icon : <MdAddPhotoAlternate />,
        role : 'seller',
        path: '/seller/dashboard/add-banner'
    },
    {
        id : 19,
        title : 'Promotions',
        icon : <RiCoupon3Line />,
        role : 'seller',
        path: '/seller/dashboard/promotions'
    },
    {
        id : 28,
        title : 'Notifications',
        icon : <FaBell />,
        role : 'seller',
        path: '/seller/dashboard/notifications'
    }
]