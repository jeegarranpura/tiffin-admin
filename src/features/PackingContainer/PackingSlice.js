import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRouteList } from '../../utils/route-utils';
import { updateOrderStatus, updateRouteStatus } from '../../utils/order-utils';

export const fetchPackingListReq = createAsyncThunk('packing/fetchPackingList', async () => {
    try {
        const response = await fetchRouteList();
        return response;
    } catch (error) {
        throw error
    }
});

export const updateOrderStatusReq = createAsyncThunk('packing/updateOrderStatus', async (payload) => {
    try {
        const response = await updateOrderStatus(payload);
        return response;
    } catch (error) {
        throw error
    }
});

export const updateRouteStatusReq = createAsyncThunk('packing/updateRouteStatus', async (payload) => {
    try {
        const response = await updateRouteStatus(payload);
        return response;
    } catch (error) {
        throw error
    }
});

const PackingSlice = createSlice({
    name: 'packing',
    initialState: {
        packingList: [],
        isLoading: false,
        error: null,
        message: null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPackingListReq.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchPackingListReq.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                state.packingList = action.payload;
            }
            state.isLoading = false;
        });
        builder.addCase(fetchPackingListReq.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });

        builder.addCase(updateOrderStatusReq.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateOrderStatusReq.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                state.message = 'Order status updated successfully'
            }
            state.isLoading = false;
        });
        builder.addCase(updateOrderStatusReq.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });

        builder.addCase(updateRouteStatusReq.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateRouteStatusReq.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                state.message = 'Route status updated successfully'
            }
            state.isLoading = false;
        });
        builder.addCase(updateRouteStatusReq.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
    },
});
export const { } = PackingSlice.actions;
export default PackingSlice.reducer;