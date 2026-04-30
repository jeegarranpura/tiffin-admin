import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { loginUtils } from '../../utils/auth-utils';

const initialState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  user: JSON.parse(localStorage.getItem('user')) || null,
};

export const loginUser = createAsyncThunk('auth/loginUser', async (userData) => {
  try {
    const response = await loginUtils(userData);
    return response;
  } catch (error) {
    return false;
  }
})


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      console.log(':: action', action.payload)
      if (action.payload) {
        const data = action.payload;
        state.isAuthenticated = true;
        state.user = data.user;
        const token = data.token;
        const user = data.user;
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
      }
    });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
