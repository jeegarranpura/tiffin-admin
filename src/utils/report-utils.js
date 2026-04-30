import * as XLSX from 'xlsx';
import api from "./api";
import { 
    ORDER_REPORT, 
    CUSTOMER_REPORT, 
    PENDING_DELIVERIES, 
    EXPIRING_SUBSCRIPTIONS,
    ACTIVE_CUSTOMERS_REPORT,
    NON_RENEWED_REPORT,
    UPCOMING_PAYMENTS_REPORT,
    SEND_REMINDERS
} from "../config/server-config";

export const getDailyDeliveryReport = async () => {
    try {
        const response = await api.get(ORDER_REPORT);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCustomerStats = async () => {
    try {
        const response = await api.get(CUSTOMER_REPORT);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getActiveCustomersReport = async () => {
    try {
        const response = await api.get(ACTIVE_CUSTOMERS_REPORT);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getNonRenewedReport = async () => {
    try {
        const response = await api.get(NON_RENEWED_REPORT);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUpcomingPaymentsReport = async () => {
    try {
        const response = await api.get(UPCOMING_PAYMENTS_REPORT);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sendPaymentReminders = async (useMailinator = false) => {
    try {
        const response = await api.post(SEND_REMINDERS, { useMailinator });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPendingDeliveries = async () => {
    try {
        const response = await api.get(PENDING_DELIVERIES);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getExpiringSubscriptions = async () => {
    try {
        const response = await api.get(EXPIRING_SUBSCRIPTIONS);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Exports data to an Excel file
 * @param {Array} data - Array of objects to export
 * @param {String} fileName - Name of the file to save
 * @param {String} sheetName - Name of the sheet within the Excel file
 */
export const exportToExcel = (data, fileName = 'Report', sheetName = 'Sheet1') => {
    if (!data || data.length === 0) {
        console.warn('No data to export');
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `${fileName}_${date}.xlsx`);
};
