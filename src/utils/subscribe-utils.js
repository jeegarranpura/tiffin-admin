import api from "./api";
import {
    CREATE_SUBSCRIPTION,
    GET_ALL_SUBSCRIPTIONS,
    UPDATE_SUBSCRIPTION,
    DELETE_SUBSCRIPTION,
    GET_CUSTOMER_SUBSCRIPTIONS,
    ADD_SUBSCRIPTION_SKIP,
    GET_SUBSCRIPTION_SKIPS
} from "../config/server-config";

export const createSubscription = async (data) => {
    try {
        const response = await api.post(CREATE_SUBSCRIPTION, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSubscriptionList = async () => {
    try {
        const response = await api.get(GET_ALL_SUBSCRIPTIONS);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateSubscription = async (id, data) => {
    try {
        const response = await api.put(`${UPDATE_SUBSCRIPTION}${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteSubscription = async (id) => {
    try {
        const response = await api.delete(`${DELETE_SUBSCRIPTION}${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCustomerSubscriptionHistory = async (customerId) => {
    try {
        const response = await api.get(`${GET_CUSTOMER_SUBSCRIPTIONS}${customerId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addSubscriptionSkip = async (data) => {
    try {
        const response = await api.post(ADD_SUBSCRIPTION_SKIP, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSubscriptionSkips = async () => {
    try {
        const response = await api.get(GET_SUBSCRIPTION_SKIPS);
        return response.data;
    } catch (error) {
        throw error;
    }
};
