
import authReducer from './Reducers/authReducer';
import categoryReducer from './Reducers/categoryReducer';
import productReducer from './Reducers/productReducer';
import sellerReducer from './Reducers/sellerReducer';
import chatReducer from './Reducers/chatReducer';
import OrderReducer from './Reducers/OrderReducer';
import PaymentReducer from './Reducers/PaymentReducer';
import dashboardReducer from './Reducers/dashboardReducer';
import bannerReducer from './Reducers/bannerReducer';
import promotionReducer from './Reducers/promotionReducer';
import newsletterReducer from './Reducers/newsletterReducer';

const rootReducer =  {
   auth: authReducer,
   category: categoryReducer,
   product: productReducer,
   seller: sellerReducer,
   chat: chatReducer,
   order: OrderReducer,
   payment: PaymentReducer,
   dashboard: dashboardReducer,
   banner: bannerReducer,
   promotion: promotionReducer,
   newsletter: newsletterReducer
};

export default rootReducer;