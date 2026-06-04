import api from "./api";
import { AUTH_LOGIN, AUTH_REGISTER, AUTH_RESET_PASSWORD, AUTH_FORGOT_PASSWORD } from "../config/server-config";

export const loginUtils = async (req) => {
  try {
    const response = await api.post(AUTH_LOGIN, { ...req, platform: "web" });
    console.log(":: response", response.data);
    return response.data;
  } catch (error) {
    console.log(":: error", error.response.data);
    throw error;
  }
};
export const register = async (data) => {
  try {
    const response = await api.post(AUTH_REGISTER, data);
    return response.data;
  } catch (error) {
    console.log(":: error", error.response.data);
    throw error;
  }
};

export const forgotPasswordUtils = async (req) => {
  try {
    const response = await api.post(AUTH_FORGOT_PASSWORD, { ...req, platform: "web" });
    console.log(":: response", response.data);
    return response.data;
  } catch (error) {
    console.log(":: error", error.response.data);
    throw error;
  }
};

export const resetPasswordUtils = async (req) => {
  try {
    const response = await api.post(AUTH_RESET_PASSWORD, { ...req, platform: "web" });
    console.log(":: response", response.data);
    return response.data;
  } catch (error) {
    console.log(":: error", error.response.data);
    throw error;
  }
};
