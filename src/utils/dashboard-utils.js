import api from "./api";
import { DASHBOARD_OVERVIEW } from "../config/server-config";

export const getDashboardOverview = async () => {
    try {
        const response = await api.get(DASHBOARD_OVERVIEW);
        return response.data;
    } catch (error) {
        throw error;
    }
};
