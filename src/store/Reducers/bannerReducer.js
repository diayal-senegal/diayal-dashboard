import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api"; 
 
export const add_banner = createAsyncThunk(
    'banner/add_banner',
    async(info ,{rejectWithValue, fulfillWithValue}) => { 
        try {
             
            const {data} = await api.post(`/banners`,info,{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
)

  // End Method 


  export const get_banner = createAsyncThunk(
    'banner/get_banner',
    async(productId ,{rejectWithValue, fulfillWithValue}) => { 
        try {
             
            const {data} = await api.get(`/banners/${productId}`,{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
)

  // End Method 

  export const update_banner = createAsyncThunk(
    'banner/update_banner',
    async({bannerId,info} ,{rejectWithValue, fulfillWithValue}) => { 
        try {
             
            const {data} = await api.put(`/banners/${bannerId}`,info,{withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
)

  // End Method 

// Nouvelle action pour obtenir les bannières en attente (pour admin)
export const get_pending_banners = createAsyncThunk(
    'banner/get_pending_banners',
    async(_, {rejectWithValue, fulfillWithValue}) => { 
        try {
            const {data} = await api.get(`/banners/pending`, {withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
)

// Nouvelle action pour valider une bannière (pour admin)
export const validate_banner = createAsyncThunk(
    'banner/validate_banner',
    async({bannerId, status, reason}, {rejectWithValue, fulfillWithValue}) => { 
        try {
            const {data} = await api.put(`/banners/validate/${bannerId}`, 
                {status, reason}, {withCredentials: true})  
            return fulfillWithValue(data)
        } catch (error) { 
            return rejectWithValue(error.response.data)
        }
    }
)

// End Method 
 
 
export const bannerReducer = createSlice({
    name: 'banner',
    initialState:{
        successMessage :  '',
        errorMessage : '',
        loader: false,
        banners : [], 
        banner: '',
        pendingBanners: [], // Bannières en attente de validation
        validationStatus: 'idle' // idle, loading, success, error
    },
    reducers : {

        messageClear : (state,_) => {
            state.successMessage = ""
            state.errorMessage = ""
        }

    },
    extraReducers: (builder) => {
        builder
          
        .addCase(add_banner.pending, (state, { payload }) => {
            state.loader = true; 
        })
        .addCase(add_banner.rejected, (state, { payload }) => {
            state.loader = false; 
            state.errorMessage = payload.error; 
        })
        .addCase(add_banner.fulfilled, (state, { payload }) => {
            state.loader = false; 
            state.successMessage = payload.message; 
            state.banner = payload.banner; 
        })

        .addCase(get_banner.fulfilled, (state, { payload }) => {            
            state.banner = payload.banner; 
        })

        .addCase(update_banner.pending, (state, { payload }) => {
            state.loader = true; 
        })
        .addCase(update_banner.rejected, (state, { payload }) => {
            state.loader = false; 
            state.errorMessage = payload.error; 
        })
        .addCase(update_banner.fulfilled, (state, { payload }) => {
            state.loader = false; 
            state.successMessage = payload.message; 
            state.banner = payload.banner; 
        })

        // Nouveaux cas pour les bannières en attente
        .addCase(get_pending_banners.pending, (state) => {
            state.validationStatus = 'loading';
        })
        .addCase(get_pending_banners.fulfilled, (state, { payload }) => {
            state.validationStatus = 'success';
            state.pendingBanners = payload.banners || [];
        })
        .addCase(get_pending_banners.rejected, (state, { payload }) => {
            state.validationStatus = 'error';
            state.errorMessage = payload?.error || 'Erreur lors du chargement';
        })

        // Cas pour la validation des bannières
        .addCase(validate_banner.pending, (state) => {
            state.loader = true;
        })
        .addCase(validate_banner.fulfilled, (state, { payload }) => {
            state.loader = false;
            state.successMessage = payload.message;
            // Retirer la bannière validée de la liste en attente
            state.pendingBanners = state.pendingBanners.filter(
                banner => banner._id !== payload.bannerId
            );
        })
        .addCase(validate_banner.rejected, (state, { payload }) => {
            state.loader = false;
            state.errorMessage = payload?.error || 'Erreur lors de la validation';
        })
        

    }

})
export const {messageClear} = bannerReducer.actions
export default bannerReducer.reducer