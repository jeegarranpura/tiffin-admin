import api from './api'
import { GET_ALL_USERS, CREATE_USER, UPDATE_USER, DELETE_USER } from '../config/server-config'

export const fetchUsersUtils = async () => {
    try {
        const response = await api.get(GET_ALL_USERS);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createUserUtils = async (userData) => {
    try {
        const response = await api.post(CREATE_USER, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateUserUtils = async (userData) => {
    try {
        const response = await api.put(`${UPDATE_USER}${userData.id}`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteUserUtils = async (id) => {
    try {
        const response = await api.delete(`${DELETE_USER}${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
