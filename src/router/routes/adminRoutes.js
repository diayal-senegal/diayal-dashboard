import { lazy } from "react";
import BannerValidation from '../../views/admin/BannerValidation';

const AdminDashboard = lazy(()=> import('../../views/admin/AdminDashboard'))  
const Orders = lazy(()=> import('../../views/admin/Orders')) 
const Category = lazy(()=> import('../../views/admin/Category'))  
const Sellers = lazy(()=> import('../../views/admin/Sellers'))
const PaymentRequest = lazy(()=> import('../../views/admin/PaymentRequest'))  
const DeactiveSellers = lazy(()=> import('../../views/admin/DeactiveSellers'))  
const SellerRequest = lazy(()=> import('../../views/admin/SellerRequest'))   
const SellerDetails = lazy(()=> import('../../views/admin/SellerDetails'))   
const ChatSeller = lazy(()=> import('../../views/admin/ChatSeller'))   
const OrderDetails = lazy(()=> import('../../views/admin/OrderDetails'))
const PublishedBanners = lazy(()=> import('../../views/admin/PublishedBanners'))
const Newsletter = lazy(()=> import('../../views/admin/Newsletter'))
const VendorTeaser = lazy(()=> import('../../views/admin/VendorTeaser'))
const DealsManager = lazy(()=> import('../../views/admin/DealsManager'))
const CustomerSupport = lazy(()=> import('../../views/admin/CustomerSupport'))
const ContactMessages = lazy(()=> import('../../views/admin/ContactMessages'))
const CommissionsPage = lazy(()=> import('../../views/admin/CommissionsPage'))
const DeliveryCommissionsPage = lazy(()=> import('../../views/admin/DeliveryCommissionsPage'))
const RevenueAnalytics = lazy(()=> import('../../views/admin/RevenueAnalytics'))  
const DeliveryQueue = lazy(()=> import('../../views/admin/delivery/DeliveryQueue'))
const DeliveryDetail = lazy(()=> import('../../views/admin/delivery/DeliveryDetail'))
const DeliveryCreate = lazy(()=> import('../../views/admin/delivery/DeliveryCreate'))
const CourierManagement = lazy(()=> import('../../views/admin/delivery/CourierManagement'))  
const DeliveryReassignment = lazy(()=> import('../../views/admin/delivery/DeliveryReassignment'))
const DeliveryTracking = lazy(()=> import('../../views/admin/delivery/DeliveryTracking'))  
const AdminSettings = lazy(()=> import('../../views/admin/AdminSettings'))  

export const adminRoutes = [
    {
        path: 'admin/dashboard',
        element : <AdminDashboard/>,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/orders',
        element : <Orders/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/category',
        element : <Category/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/sellers',
        element : <Sellers/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/payment-request',
        element : <PaymentRequest/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/deactive-sellers',
        element : <DeactiveSellers/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/sellers-request',
        element : <SellerRequest/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/seller/details/:sellerId',
        element : <SellerDetails/> ,
        role : 'admin'
    }, 
    {
        path: 'admin/dashboard/chat-sellers',
        element : <ChatSeller/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/chat-sellers/:sellerId',
        element : <ChatSeller/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/order/details/:orderId',
        element : <OrderDetails/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/order/:orderId',
        element : <OrderDetails/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/banner-validation',
        element : <BannerValidation/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/published-banners',
        element : <PublishedBanners/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/newsletter',
        element : <Newsletter/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/vendor-teaser',
        element : <VendorTeaser/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/deals-manager',
        element : <DealsManager/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/customer-support',
        element : <CustomerSupport/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/contact-messages',
        element : <ContactMessages/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/commissions',
        element : <CommissionsPage/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/delivery-commissions',
        element : <DeliveryCommissionsPage/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/revenue-analytics',
        element : <RevenueAnalytics/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/delivery-queue',
        element : <DeliveryQueue/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/delivery-create',
        element : <DeliveryCreate/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/deliveries/:id',
        element : <DeliveryDetail/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/courier-management',
        element : <CourierManagement/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/delivery-reassignment',
        element : <DeliveryReassignment/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/delivery-tracking',
        element : <DeliveryTracking/> ,
        role : 'admin'
    },
    {
        path: 'admin/dashboard/settings',
        element : <AdminSettings/> ,
        role : 'admin'
    },
 
]