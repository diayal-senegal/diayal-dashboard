import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api"; 

export const get_admin_dashboard_data = createAsyncThunk(
    'dashboard/get_admin_dashboard_data',
    async( _ ,{rejectWithValue, fulfillWithValue}) => { 
        try {
            const {data} = await api.get('/admin/get-dashboard-data',{withCredentials: true})             
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
)
// End method

export const get_seller_dashboard_data = createAsyncThunk(
    'dashboard/get_seller_dashboard_data',
    async( _ ,{rejectWithValue, fulfillWithValue}) => { 
        try {
            const {data} = await api.get('/seller/get-dashboard-data',{withCredentials: true})             
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
)
// End method

export const get_seller_monthly_data = createAsyncThunk(
    'dashboard/get_seller_monthly_data',
    async( _ ,{rejectWithValue, fulfillWithValue}) => { 
        try {
            const {data} = await api.get('/seller/get-monthly-data',{withCredentials: true})             
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
)
// End method

export const get_admin_chat_counts = createAsyncThunk(
    'dashboard/get_admin_chat_counts',
    async(_, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.get('/admin/chat-counts', {withCredentials: true});
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const clear_admin_chat_counts_backend = createAsyncThunk(
    'dashboard/clear_admin_chat_counts_backend',
    async({sellerId}, {rejectWithValue, fulfillWithValue}) => {
        try {
            const {data} = await api.put('/admin/chat-counts/clear', {sellerId}, {withCredentials: true});
            return fulfillWithValue({data, sellerId});
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


  
export const dashboardReducer = createSlice({
    name: 'dashboard',
    initialState:{
        totalSale : 0,
        totalOrder : 0,
        totalProduct: 0,
        totalPendingOrder : 0,
        totalSeller:0,
        recentOrder: [],
        recentMessage: [],
        adminChatCounts: {
            sellerMessages: 0
        },
        ordersToday: 0,
        viewsToday: 0,
        monthlyData: []
    },
    reducers : {

        messageClear : (state,_) => {
            state.errorMessage = ""
        },
        
        clearAdminChatCounts : (state, action) => {
            state.adminChatCounts.sellerMessages = 0;
        }

    },
    extraReducers: (builder) => {
        builder 
        .addCase(get_admin_dashboard_data.fulfilled, (state, { payload }) => {
            state.totalSale = payload.totalSale
            state.totalOrder = payload.totalOrder
            state.totalProduct = payload.totalProduct 
            state.totalSeller = payload.totalSeller
            state.recentOrder = payload.recentOrders
            state.recentMessage = payload.messages
            state.ordersToday = payload.ordersToday || 0
            state.viewsToday = payload.viewsToday || 0
        })
        .addCase(get_seller_dashboard_data.fulfilled, (state, { payload }) => {
            state.totalSale = payload.totalSale
            state.totalOrder = payload.totalOrder
            state.totalProduct = payload.totalProduct 
            state.totalPendingOrder = payload.totalPendingOrder
            state.recentOrder = payload.recentOrders
            state.recentMessage = payload.messages
            state.ordersToday = payload.ordersToday || 0
            state.viewsToday = payload.viewsToday || 0
        })
        .addCase(get_admin_chat_counts.fulfilled, (state, { payload }) => {
            state.adminChatCounts = payload;
        })
        .addCase(clear_admin_chat_counts_backend.fulfilled, (state, { payload }) => {
            state.adminChatCounts.sellerMessages = 0;
        })
        .addCase(get_seller_monthly_data.fulfilled, (state, { payload }) => {
            state.monthlyData = payload.monthlyData;
        })
 
    }

})
export const {messageClear, clearAdminChatCounts} = dashboardReducer.actions
export default dashboardReducer.reducer