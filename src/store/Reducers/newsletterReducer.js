import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// Actions asynchrones
export const get_newsletter_stats = createAsyncThunk(
    'newsletter/get_newsletter_stats',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/newsletter/stats');
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const get_newsletter_subscribers = createAsyncThunk(
    'newsletter/get_newsletter_subscribers',
    async ({ page = 1, limit = 50 }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/newsletter/subscribers?page=${page}&limit=${limit}`);
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const delete_newsletter_subscriber = createAsyncThunk(
    'newsletter/delete_newsletter_subscriber',
    async (id, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.delete(`/newsletter/subscriber/${id}`);
            return fulfillWithValue({ data, id });
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const newsletterReducer = createSlice({
    name: 'newsletter',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        stats: {
            total: 0,
            today: 0,
            thisWeek: 0,
            thisMonth: 0
        },
        subscribers: [],
        totalPages: 0,
        currentPage: 1,
        totalSubscribers: 0
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_newsletter_stats.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_newsletter_stats.fulfilled, (state, action) => {
                state.loader = false;
                state.stats = action.payload;
            })
            .addCase(get_newsletter_stats.rejected, (state, action) => {
                state.loader = false;
                state.errorMessage = action.payload.message;
            })
            .addCase(get_newsletter_subscribers.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_newsletter_subscribers.fulfilled, (state, action) => {
                state.loader = false;
                state.subscribers = action.payload.subscribers;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalSubscribers = action.payload.total;
            })
            .addCase(get_newsletter_subscribers.rejected, (state, action) => {
                state.loader = false;
                state.errorMessage = action.payload.message;
            })
            .addCase(delete_newsletter_subscriber.pending, (state) => {
                state.loader = true;
            })
            .addCase(delete_newsletter_subscriber.fulfilled, (state, action) => {
                state.loader = false;
                state.successMessage = action.payload.data.message;
                state.subscribers = state.subscribers.filter(sub => sub._id !== action.payload.id);
                state.totalSubscribers -= 1;
            })
            .addCase(delete_newsletter_subscriber.rejected, (state, action) => {
                state.loader = false;
                state.errorMessage = action.payload.message;
            });
    }
});

export const { messageClear } = newsletterReducer.actions;
export default newsletterReducer.reducer;