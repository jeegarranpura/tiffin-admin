import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardOverview } from '../../utils/dashboard-utils';

export const fetchDashboardOverview = createAsyncThunk(
    'dashboard/fetchDashboardOverview',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getDashboardOverview();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        stats: [],
        recentActivity: [],
        deliveryTrend: [],
        revenueOverview: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardOverview.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload.stats;
                state.recentActivity = action.payload.recentActivity;
                state.deliveryTrend = action.payload.deliveryTrend;
                state.revenueOverview = action.payload.revenueOverview;
            })
            .addCase(fetchDashboardOverview.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default dashboardSlice.reducer;
