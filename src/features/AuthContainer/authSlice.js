import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  loginUtils,
  resetPasswordUtils,
  forgotPasswordUtils,
} from "../../utils/auth-utils";

const initialState = {
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  user: JSON.parse(localStorage.getItem("user")) || null,
  screenState: "login",
  email: "",
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData) => {
    try {
      const response = await loginUtils(userData);
      return response;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  },
);

export const resetPasswordReq = createAsyncThunk(
  "auth/resetPasswordReq",
  async (userData) => {
    try {
      const response = await resetPasswordUtils(userData);
      return response;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  },
);
export const forgotPasswordReq = createAsyncThunk(
  "auth/forgotPasswordReq",
  async (userData) => {
    try {
      const response = await forgotPasswordUtils(userData);
      return response;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setScreenState: (state, action) => {
      console.log(":: action", action.payload);
      state.screenState = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      console.log(":: action", action.payload);
      if (action.payload) {
        const data = action.payload;
        state.isAuthenticated = true;
        state.user = data.user;
        const token = data.token;
        const user = data.user;
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      }
    });
    builder.addCase(forgotPasswordReq.fulfilled, (state, action) => {
      console.log(":: action", action.payload);
      if (action.payload) {
        const data = action.payload;
        console.log('data', data)
      }
    });
    builder.addCase(resetPasswordReq.fulfilled, (state, action) => {
      console.log(":: action", action.payload);
      if (action.payload) {
        const data = action.payload;
        console.log('data', data)
      }
    });
  },
});

export const { login, logout, setScreenState, setEmail } = authSlice.actions;
export default authSlice.reducer;
