import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUsersUtils, createUserUtils, updateUserUtils, deleteUserUtils } from '../../utils/user-utils';

export const fetchUserList = createAsyncThunk(
    'user/fetchUserList',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchUsersUtils();
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch users');
        }
    }
);

export const fetchCreateUser = createAsyncThunk(
    'user/fetchCreateUser',
    async (userData, { rejectWithValue }) => {
        try {
            return await createUserUtils(userData);
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create user');
        }
    }
);

export const fetchUpdateUser = createAsyncThunk(
    'user/fetchUpdateUser',
    async (userData, { rejectWithValue }) => {
        try {
            return await updateUserUtils(userData);
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update user');
        }
    }
);

export const fetchDeleteUser = createAsyncThunk(
    'user/fetchDeleteUser',
    async (id, { rejectWithValue }) => {
        try {
            return await deleteUserUtils(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete user');
        }
    }
);

const initialState = {
    userList: [],
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserList.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userList = action.payload;
            })
            .addCase(fetchUserList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchCreateUser.fulfilled, (state, action) => {
                state.userList.push(action.payload);
            })
            .addCase(fetchUpdateUser.fulfilled, (state, action) => {
                const index = state.userList.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.userList[index] = action.payload;
                }
            })
            .addCase(fetchDeleteUser.fulfilled, (state, action) => {
                state.userList = state.userList.filter(u => u.id !== action.meta.arg);
            });
    },
});

export default userSlice.reducer;
