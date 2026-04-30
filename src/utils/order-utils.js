
import api from './api'
import {
    ORDER_UPDATE_STATUS,
    UPDATE_ROUTE_STATUS
} from '../config/server-config'


export const updateOrderStatus = async (payload) => {

    try {
        const response = await api.put(`${ORDER_UPDATE_STATUS}/${payload.id}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating route:', error);
        throw error;
    }
}

export const updateRouteStatus = async (payload) => {
    try {
        const response = await api.put(`${UPDATE_ROUTE_STATUS}/${payload.id}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating route:', error);
        throw error;
    }
}