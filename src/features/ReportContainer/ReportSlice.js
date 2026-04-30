import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    getDailyDeliveryReport, 
    getCustomerStats, 
    getPendingDeliveries, 
    getExpiringSubscriptions 
} from '../../utils/report-utils';

export const fetchDailyDeliveryReport = createAsyncThunk(
    'report/fetchDailyDeliveryReport',
    async (_, { rejectWithValue }) => {
        try {
            return await getDailyDeliveryReport();
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchCustomerStats = createAsyncThunk(
    'report/fetchCustomerStats',
    async (_, { rejectWithValue }) => {
        try {
            return await getCustomerStats();
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchPendingDeliveries = createAsyncThunk(
    'report/fetchPendingDeliveries',
    async (_, { rejectWithValue }) => {
        try {
            return await getPendingDeliveries();
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchExpiringSubscriptions = createAsyncThunk(
    'report/fetchExpiringSubscriptions',
    async (_, { rejectWithValue }) => {
        try {
            return await getExpiringSubscriptions();
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const reportSlice = createSlice({
    name: 'report',
    initialState: {
        dailyDeliveryReport: null,
        customerStats: null,
        pendingDeliveries: [],
        expiringSubscriptions: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDailyDeliveryReport.pending, (state) => { state.isLoading = true; })
            .addCase(fetchDailyDeliveryReport.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dailyDeliveryReport = action.payload;
            })
            .addCase(fetchDailyDeliveryReport.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchCustomerStats.fulfilled, (state, action) => {
                state.customerStats = action.payload;
            })
            .addCase(fetchPendingDeliveries.fulfilled, (state, action) => {
                state.pendingDeliveries = action.payload;
            })
            .addCase(fetchExpiringSubscriptions.fulfilled, (state, action) => {
                state.expiringSubscriptions = action.payload;
            });
    },
});

export default reportSlice.reducer;
