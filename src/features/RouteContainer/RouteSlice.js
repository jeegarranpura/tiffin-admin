import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCreateRoute, fetchDeleteRoute, fetchRouteList, fetchUpdateRoute, fetchDeliveryAgentList } from '../../utils/route-utils';


export const fetchRouteListReq = createAsyncThunk('route/fetchRouteList', async () => {
    try {
        const response = await fetchRouteList();
        return response;
    } catch (error) {
        throw error
    }
});

export const fetchDeliveryAgentListReq = createAsyncThunk('route/fetchDeliveryAgentList', async () => {
    try {
        const response = await fetchDeliveryAgentList();
        return response;
    } catch (error) {
        throw error
    }
});

export const fetchCreateRouteReq = createAsyncThunk('route/fetchCreateRoute', async (payload) => {
    try {
        const response = await fetchCreateRoute(payload);
        return response;
    } catch (error) {
        throw error
    }
});

export const fetchUpdateRouteReq = createAsyncThunk('route/fetchUpdateRoute', async (payload) => {
    try {
        const response = await fetchUpdateRoute(payload);
        return response;
    } catch (error) {
        throw error
    }
});

export const fetchDeleteRouteReq = createAsyncThunk('route/fetchDeleteRoute', async (payload) => {
    try {
        const response = await fetchDeleteRoute(payload);
        return response;
    } catch (error) {
        throw error
    }
});



const routeSlice = createSlice({
    name: 'route',
    initialState: {
        routeList: [],
        deliveryAgentList: [],
        liveLocations: {}, // { routeId: { lat, lng, agentName, timestamp } }
        isLoading: false,
        error: null,
        message: null
    },
    reducers: {
        updateLiveLocation: (state, action) => {
            const { routeId, lat, lng, agentName, timestamp } = action.payload;
            state.liveLocations[routeId] = { lat, lng, agentName, timestamp };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRouteListReq.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchRouteListReq.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                state.routeList = action.payload;
            }
            state.isLoading = false;
        });
        builder.addCase(fetchRouteListReq.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
        builder.addCase(fetchDeliveryAgentListReq.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchDeliveryAgentListReq.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                state.deliveryAgentList = action.payload;
            }
            state.isLoading = false;
        });
        builder.addCase(fetchDeliveryAgentListReq.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
        builder.addCase(fetchCreateRouteReq.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchCreateRouteReq.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                // state.routeList = action.payload;
                state.message = 'Route created successfully';

            }
            state.isLoading = false;
        });
        builder.addCase(fetchCreateRouteReq.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
        builder.addCase(fetchUpdateRouteReq.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchUpdateRouteReq.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                // state.routeList = action.payload;
                state.message = 'Route updated successfully';

            }
            state.isLoading = false;
        });
        builder.addCase(fetchUpdateRouteReq.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
        builder.addCase(fetchDeleteRouteReq.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchDeleteRouteReq.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                // state.routeList = action.payload;
                state.message = 'Route deleted successfully';

            }
            state.isLoading = false;
        });
        builder.addCase(fetchDeleteRouteReq.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
    },
});

export const { updateLiveLocation } = routeSlice.actions;
export default routeSlice.reducer;
