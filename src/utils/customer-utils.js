import api from './api'
import { GET_ALL_CUSTOMERS, CREATE_CUSTOMER, UPDATE_CUSTOMER } from '../config/server-config'

export const getCustomerList = async (req) => {
    try {
        const response = await api.get(GET_ALL_CUSTOMERS)
        return response.data;
    } catch (error) {
        throw error
    }
}

export const createCustomer = async (req) => {
    try {
        const response = await api.post(CREATE_CUSTOMER, req)
        return response.data;
    } catch (error) {
        throw error
    }
}

export const updateCustomer = async (req) => {
    try {
        const response = await api.put(`${UPDATE_CUSTOMER}/${req.id}`, req)
        return response.data;
    } catch (error) {
        throw error
    }
}
