import api from './api'
import { GET_ALL_PLANS, CREATE_PLAN, UPDATE_PLAN, DELETE_PLAN, GET_PLAN_BY_ID } from '../config/server-config'

export const getPlanList = async (req) => {
    try {
        const response = await api.get(GET_ALL_PLANS)
        return response.data;
    } catch (error) {
        throw error
    }
}

export const getPlanById = async (req) => {
    try {
        const response = await api.get(`${GET_PLAN_BY_ID}/${req.id}`)
        return response.data;
    } catch (error) {
        throw error
    }
}

export const createPlan = async (req) => {
    try {
        const response = await api.post(CREATE_PLAN, { ...req, platform: 'web' })
        return response.data;
    } catch (error) {
        throw error
    }
}

export const updatePlan = async (req) => {
    try {
        const response = await api.put(`${UPDATE_PLAN}/${req.id}`, { ...req, platform: 'web' })
        return response.data;
    } catch (error) {
        throw error
    }
}

export const deletePlan = async (req) => {
    try {
        const response = await api.delete(`${DELETE_PLAN}/${req.id}`, { ...req, platform: 'web' })
        return response.data;
    } catch (error) {
        throw error
    }
}