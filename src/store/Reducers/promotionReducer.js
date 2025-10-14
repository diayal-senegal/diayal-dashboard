import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'

// Get promotional settings
export const get_promotional_settings = createAsyncThunk(
    'promotion/get_promotional_settings',
    async (sellerId, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/promotional-settings/${sellerId}`, {
                withCredentials: true
            })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// Update promotional settings
export const update_promotional_settings = createAsyncThunk(
    'promotion/update_promotional_settings',
    async ({ sellerId, promotionData }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/promotional-settings/${sellerId}`, promotionData, {
                withCredentials: true
            })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const promotionReducer = createSlice({
    name: 'promotion',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        promotionalSettings: {
            isActive: false,
            message: '',
            minimumAmount: 0,
            regions: []
        }
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_promotional_settings.pending, (state) => {
                state.loader = true
            })
            .addCase(get_promotional_settings.rejected, (state, { payload }) => {
                state.loader = false
                state.errorMessage = payload.error
            })
            .addCase(get_promotional_settings.fulfilled, (state, { payload }) => {
                state.loader = false
                state.promotionalSettings = payload.promotionalSettings
            })
            .addCase(update_promotional_settings.pending, (state) => {
                state.loader = true
            })
            .addCase(update_promotional_settings.rejected, (state, { payload }) => {
                state.loader = false
                state.errorMessage = payload.error
            })
            .addCase(update_promotional_settings.fulfilled, (state, { payload }) => {
                state.loader = false
                state.successMessage = payload.message
            })
    }
})

export const { messageClear } = promotionReducer.actions
export default promotionReducer.reducer