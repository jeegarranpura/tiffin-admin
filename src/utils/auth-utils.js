import api from './api'
import { AUTH_LOGIN, AUTH_REGISTER } from '../config/server-config'

export const loginUtils = async (req) => {
    try {
        const response = await api.post(AUTH_LOGIN, { ...req, platform: 'web' })
        return response.data;
    } catch (error) {
        throw error
    }
}
export const register = async (data) => {
    try {
        const response = await api.post(AUTH_REGISTER, data)
        return response.data
    } catch (error) {
        throw error
    }
}