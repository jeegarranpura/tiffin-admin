import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    getSubscriptionList, 
    createSubscription, 
    updateSubscription, 
    deleteSubscription,
    getCustomerSubscriptionHistory,
    addSubscriptionSkip,
    getSubscriptionSkips
} from '../../utils/subscribe-utils';

export const fetchAddSubscriptionSkip = createAsyncThunk('subscribe/fetchAddSubscriptionSkip', async (data) => {
    try {
        const response = await addSubscriptionSkip(data);
        return response;
    } catch (error) {
        throw error;
    }
});

export const fetchGetSubscriptionSkips = createAsyncThunk('subscribe/fetchGetSubscriptionSkips', async () => {
    try {
        const response = await getSubscriptionSkips();
        return response;
    } catch (error) {
        throw error;
    }
});

export const fetchSubscribeList = createAsyncThunk('subscribe/fetchSubscribeList', async () => {
    try {
        const response = await getSubscriptionList();
        return response;
    } catch (error) {
        throw error;
    }
});

export const fetchCreateSubscribe = createAsyncThunk('subscribe/fetchCreateSubscribe', async (data) => {
    try {
        const response = await createSubscription(data);
        return response;
    } catch (error) {
        throw error;
    }
});

export const fetchUpdateSubscribe = createAsyncThunk('subscribe/fetchUpdateSubscribe', async ({ id, data }) => {
    try {
        const response = await updateSubscription(id, data);
        return response;
    } catch (error) {
        throw error;
    }
});

export const fetchDeleteSubscribe = createAsyncThunk('subscribe/fetchDeleteSubscribe', async (id) => {
    try {
        const response = await deleteSubscription(id);
        return response;
    } catch (error) {
        throw error;
    }
});

export const fetchCustomerHistory = createAsyncThunk('subscribe/fetchCustomerHistory', async (customerId) => {
    try {
        const response = await getCustomerSubscriptionHistory(customerId);
        return response;
    } catch (error) {
        throw error;
    }
});

const subscribeSlice = createSlice({
    name: 'subscribe',
    initialState: {
        subscribeList: [],
        isLoading: false,
        error: null,
        message: null,
        history: [],
        skips: [],
    },
    reducers: {
        clearMessage: (state) => {
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSubscribeList.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchSubscribeList.fulfilled, (state, action) => {
            state.subscribeList = action.payload;
            state.isLoading = false;
        });
        builder.addCase(fetchSubscribeList.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });

        builder.addCase(fetchCreateSubscribe.fulfilled, (state) => {
            state.message = 'Subscription created successfully';
        });

        builder.addCase(fetchUpdateSubscribe.fulfilled, (state) => {
            state.message = 'Subscription updated successfully';
        });

        builder.addCase(fetchDeleteSubscribe.fulfilled, (state) => {
            state.message = 'Subscription deleted successfully';
        });

        builder.addCase(fetchCustomerHistory.fulfilled, (state, action) => {
            state.history = action.payload;
        });

        builder.addCase(fetchGetSubscriptionSkips.fulfilled, (state, action) => {
            state.skips = action.payload;
        });

        builder.addCase(fetchAddSubscriptionSkip.fulfilled, (state) => {
            state.message = 'Subscription skip added successfully';
        });
    },
});

export const { clearMessage } = subscribeSlice.actions;
export default subscribeSlice.reducer;
