import api from './api'
import {
    DELIVERY_AGENT_LIST,
    CREATE_ROUTE,
    GET_ALL_ROUTES,
    UPDATE_ROUTE,
    DELETE_ROUTE,
    ASSIG_CUSTOMER,
    GET_ROUTE_MAP_DATA
} from '../config/server-config'

export const fetchDeliveryAgentList = async () => {
    try {
        const response = await api.get(DELIVERY_AGENT_LIST);
        return response.data;
    } catch (error) {
        console.error('Error fetching delivery agent list:', error);
        throw error;
    }
}

export const fetchCreateRoute = async (payload) => {
    try {
        const response = await api.post(CREATE_ROUTE, payload);
        return response.data;
    } catch (error) {
        console.error('Error creating route:', error);
        throw error;
    }
}

export const fetchRouteList = async (dateQuery, mealTime) => {
    try {
        const response = await api.get(GET_ALL_ROUTES, { params: { date: dateQuery, mealTime: mealTime } });
        return response.data;
    } catch (error) {
        console.error('Error fetching all routes:', error);
        throw error;
    }
}

export const fetchUpdateRoute = async (payload) => {
    try {
        const response = await api.put(`${UPDATE_ROUTE}/${payload.id}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating route:', error);
        throw error;
    }
}

export const fetchDeleteRoute = async (payload) => {
    try {
        const response = await api.delete(`${DELETE_ROUTE}/${payload.id}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error deleting route:', error);
        throw error;
    }
}

export const fetchGetRouteMapData = async (payload) => {
    try {
        const response = await api.get(GET_ROUTE_MAP_DATA, payload);
        return response.data;
    } catch (error) {
        console.error('Error fetching route map data:', error);
        throw error;
    }
}
