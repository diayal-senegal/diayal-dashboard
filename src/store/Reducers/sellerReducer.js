import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api"; 

 
 
export const get_seller_request = createAsyncThunk(
    'seller/get_seller_request',
    async({ parPage,page,searchValue },{rejectWithValue, fulfillWithValue}) => {
        
        try {
             
            const {data} = await api.get(`/request-seller-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,{withCredentials: true}) 
             console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

  // End Method 

  
export const get_seller = createAsyncThunk(
    'seller/get_seller',
    async(sellerId ,{rejectWithValue, fulfillWithValue}) => {
        
        try {
             
            const {data} = await api.get(`/get-seller/${sellerId}`,{withCredentials: true}) 
             console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

  // End Method 


  export const seller_status_update = createAsyncThunk(
    'seller/seller_status_update',
    async(info ,{rejectWithValue, fulfillWithValue}) => {
        
        try {
             
            const {data} = await api.post(`/seller-status-update`,info,{withCredentials: true}) 
             console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

  // End Method 


  export const get_active_sellers = createAsyncThunk(
    'seller/get_active_sellers',
    async({ parPage,page,searchValue },{rejectWithValue, fulfillWithValue}) => {
        
        try {
             
            const {data} = await api.get(`/get-sellers?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,{withCredentials: true}) 
           
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

  // End Method 

  export const get_deactive_sellers = createAsyncThunk(
    'seller/get_deactive_sellers',
    async({ parPage,page,searchValue },{rejectWithValue, fulfillWithValue}) => {
        
        try {
             
            const {data} = await api.get(`/get-deactive-sellers?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,{withCredentials: true}) 
           
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

  // End Method 

  export const create_stripe_connect_account = createAsyncThunk(
    'seller/create_stripe_connect_account',
    async() => { 
        try { 
            const {data: {url}} = await api.get(`/payment/create-stripe-connect-account`,{withCredentials: true}) 
            window.location.href = url
        } catch (error) {
            // console.log(error.response.data) 
        }
    }
)

  // End Method 

  export const active_stripe_connect_account = createAsyncThunk(
    'seller/active_stripe_connect_account',
    async(activeCode, {rejectWithValue, fulfillWithValue}) => { 
        try { 
            const {data } = await api.put(`/payment/active-stripe-connect-account/${activeCode}`,{},{withCredentials: true}) 
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data) 
            return rejectWithValue(error.response.data)
        }
    }
)

  // End Method 

// Actions pour les notifications
export const get_seller_notifications = createAsyncThunk(
    'seller/get_seller_notifications',
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/notifications', {withCredentials: true});
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const mark_notification_read = createAsyncThunk(
    'seller/mark_notification_read',
    async(notificationId, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.put(`/notifications/${notificationId}/read`, {}, {withCredentials: true});
            return fulfillWithValue({data, notificationId});
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_unread_notifications_count = createAsyncThunk(
    'seller/get_unread_notifications_count',
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/notifications/unread-count', {withCredentials: true});
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_chat_counts = createAsyncThunk(
    'seller/get_chat_counts',
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/chat-counts', {withCredentials: true});
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const sellerReducer = createSlice({
    name: 'seller',
    initialState:{
        successMessage :  '',
        errorMessage : '',
        loader: false,
        sellers : [], 
        totalSeller: 0,
        seller: '',
        notifications: [],
        unreadCount: 0,
        chatCounts: {
            customerMessages: 0,
            supportMessages: 0
        }
    },
    reducers : {

        messageClear : (state,_) => {
            state.successMessage = ""
            state.errorMessage = ""
        }

    },
    extraReducers: (builder) => {
        builder
          
        .addCase(get_seller_request.fulfilled, (state, { payload }) => {
            state.sellers = payload.sellers;
            state.totalSeller = payload.totalSeller; 
        })
        .addCase(get_seller.fulfilled, (state, { payload }) => {
            state.seller = payload.seller; 
        })
        .addCase(seller_status_update.fulfilled, (state, { payload }) => {
            state.seller = payload.seller; 
            state.successMessage = payload.message; 
        })
        .addCase(get_active_sellers.fulfilled, (state, { payload }) => {
            state.sellers = payload.sellers; 
            state.totalSeller = payload.totalSeller; 
        })
        .addCase(get_deactive_sellers.fulfilled, (state, { payload }) => {
            state.sellers = payload.sellers; 
            state.totalSeller = payload.totalSeller; 
        })

        .addCase(active_stripe_connect_account.pending, (state, { payload }) => {
            state.loader = true;  
        })
        .addCase(active_stripe_connect_account.rejected, (state, { payload }) => {
            state.loader = false; 
            state.errorMessage = payload.message; 
        })
        .addCase(active_stripe_connect_account.fulfilled, (state, { payload }) => {
            state.loader = false; 
            state.successMessage = payload.message; 
        })
        
        // Notifications
        .addCase(get_seller_notifications.fulfilled, (state, { payload }) => {
            state.notifications = payload.notifications;
        })
        .addCase(mark_notification_read.fulfilled, (state, { payload }) => {
            const notificationIndex = state.notifications.findIndex(n => n._id === payload.notificationId);
            if (notificationIndex !== -1) {
                state.notifications[notificationIndex].status = 'read';
            }
            state.unreadCount = Math.max(0, state.unreadCount - 1);
        })
        .addCase(get_unread_notifications_count.fulfilled, (state, { payload }) => {
            state.unreadCount = payload.count;
        })
        .addCase(get_chat_counts.fulfilled, (state, { payload }) => {
            state.chatCounts = payload;
        })

    }

})
export const {messageClear} = sellerReducer.actions
export default sellerReducer.reducer