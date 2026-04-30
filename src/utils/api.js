import axios from "axios";
// import { PATH_LOGIN } from "./RouteConstanst";
// import { logout } from "./commonUtils";
// import { notify } from "./notification";

/**
 * Determines and returns the base URL for API requests based on the current environment.
 * 
 * @returns {string} The base URL string (empty in development)
 */
function createBaseUrl() {
    if (process.env.NODE_ENV === "development") {
        return "";
    }
    return "";
}

const api = axios.create({
    withCredentials: true,
    baseURL: createBaseUrl(),
});

/**
 * Request Interceptor
 * Intercepts outgoing requests to attach the authorization token to the headers if it exists.
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Response Interceptor
 * Intercepts incoming responses to handle generic success and error states.
 * Resolves successful responses and catches common errors (like 401 Unauthorized) to process global behavior globally.
 */
api.interceptors.response.use(
    (response) => {
        // ✅ Only return data for successful responses (2xx)
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        // notify.error(response.data?.message || "Something went wrong");

        // ❌ Otherwise, reject manually
        return Promise.reject(response);
    },
    async (error) => {
        console.log('error', error)
        const { response } = error;

        if (!response) {
            // Network or CORS error
            // notify.error("Network error or server not responding");
            return Promise.reject(error);
        }

        if (response.status === 401) {
            // notify.error(response.data?.message || "Unauthorized");
            // logout();
            // window.location.pathname = PATH_LOGIN;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.pathname = "/login";
            return Promise.reject(error);
        }

        // Handle other errors globally
        // notify.error(response.data?.message || "Something went wrong");
        return Promise.reject(error);
    }
);

export default api;
