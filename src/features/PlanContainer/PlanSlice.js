import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPlanList, getPlanById, createPlan, updatePlan, deletePlan } from '../../utils/plan-utils';


export const fetchPlanList = createAsyncThunk('plan/fetchPlanList', async () => {
    try {
        const response = await getPlanList();
        return response;
    } catch (error) {
        throw error
    }
})

export const fetchPlanById = createAsyncThunk('plan/fetchPlanById', async (id) => {
    try {
        const response = await getPlanById(id);
        return response;
    } catch (error) {
        throw error
    }
})

export const fetchCreatePlan = createAsyncThunk('plan/fetchCreatePlan', async (plan) => {
    try {
        const response = await createPlan(plan);
        return response;
    } catch (error) {
        throw error
    }
})

export const fetchUpdatePlan = createAsyncThunk('plan/fetchUpdatePlan', async (plan) => {
    try {
        const response = await updatePlan(plan);
        return response;
    } catch (error) {
        throw error
    }
})

export const fetchDeletePlan = createAsyncThunk('plan/fetchDeletePlan', async (id) => {
    try {
        const response = await deletePlan(id);
        return response;
    } catch (error) {
        throw error
    }
})



const planSlice = createSlice({
    name: 'plan',
    initialState: {
        planList: [],
        isLoading: false,
        error: null,
        singlePlan: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPlanList.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchPlanList.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                state.planList = action.payload;
            }
            state.isLoading = false;
        });
        builder.addCase(fetchPlanList.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
        builder.addCase(fetchPlanById.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchPlanById.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                state.singlePlan = action.payload;
            }
            state.isLoading = false;
        });
        builder.addCase(fetchPlanById.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
        builder.addCase(fetchCreatePlan.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchCreatePlan.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                // state.planList = action.payload;
            }
            state.isLoading = false;
        });
        builder.addCase(fetchCreatePlan.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
        builder.addCase(fetchUpdatePlan.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchUpdatePlan.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                // state.planList = action.payload;
            }
            state.isLoading = false;
        });
        builder.addCase(fetchUpdatePlan.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
        builder.addCase(fetchDeletePlan.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchDeletePlan.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                // state.planList = action.payload;
            }
            state.isLoading = false;
        });
        builder.addCase(fetchDeletePlan.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
    },
});

export const { } = planSlice.actions;
export default planSlice.reducer;
