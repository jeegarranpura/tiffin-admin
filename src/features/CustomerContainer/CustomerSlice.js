import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomerList, createCustomer, updateCustomer } from '../../utils/customer-utils';


export const fetchCustomerList = createAsyncThunk('customer/fetchCustomerList', async () => {
    try {
        const response = await getCustomerList();
        return response;
    } catch (error) {
        throw error
    }
})

export const fetchCreateCustomer = createAsyncThunk('customer/fetchCreateCustomer', async (customer) => {
    try {
        const response = await createCustomer(customer);
        return response;
    } catch (error) {
        throw error
    }
})

export const fetchUpdateCustomer = createAsyncThunk('customer/fetchUpdateCustomer', async (customer) => {
    try {
        const response = await updateCustomer(customer);
        return response;
    } catch (error) {
        throw error
    }
})

const customerSlice = createSlice({
    name: 'customer',
    initialState: {
        customerList: [],
        isLoading: false,
        error: null,
        message: null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCustomerList.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchCustomerList.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                state.customerList = action.payload;
                state.message = 'Customer list fetched successfully'
            }
            state.isLoading = false;
        });
        builder.addCase(fetchCustomerList.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
        builder.addCase(fetchCreateCustomer.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchCreateCustomer.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                // state.customerList = action.payload;
                state.message = 'Customer created successfully'
            }
            state.isLoading = false;
        });
        builder.addCase(fetchCreateCustomer.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
        builder.addCase(fetchUpdateCustomer.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchUpdateCustomer.fulfilled, (state, action) => {
            console.log(':: action', action.payload)
            if (action.payload) {
                // state.customerList = action.payload;
                state.message = 'Customer updated successfully'
            }
            state.isLoading = false;
        });
        builder.addCase(fetchUpdateCustomer.rejected, (state, action) => {
            state.error = action.error.message;
            state.isLoading = false;
        });
    },
});

export const { } = customerSlice.actions;
export default customerSlice.reducer;
