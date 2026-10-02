import axios from "axios";

/**
 * Star7 Foodies API Client
 * 
 * Works seamlessly in both:
 * 1. Local Development: Uses Vite dev proxy (/api -> http://localhost:8000)
 * 2. Production (Netlify -> Render): Uses VITE_API_BASE_URL (e.g. https://star7foodies-backend.onrender.com)
 */
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
// Strip trailing slash if present to avoid double slashes like //api/...
const API_BASE_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Request Interceptor: Attach JWT Bearer token if stored in localStorage (vital for cross-domain cookie fallbacks)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("star7_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 unauthorized cleanup
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("star7_token");
        }
        return Promise.reject(error);
    }
);

export const allFoods = async () => {
    try {
        const response = await api.get("/api/products/");
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong while getting all Items. Please try again.";
        throw new Error(errorMessage);
    }
};

export const getProductByIdApi = async (id) => {
    try {
        const response = await api.get(`/api/products/${id}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong while getting dish details.";
        throw new Error(errorMessage);
    }
};

export const loginUser = async (loginData) => {
    try {
        const response = await api.post("/api/users/login", loginData);
        if (response.data?.token) {
            localStorage.setItem("star7_token", response.data.token);
        }
        return response.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "Something went wrong while logging in to your account. Please try again.";
        throw new Error(errorMessage);
    }
};

export const registerUser = async (registerData) => {
    try {
        const response = await api.post("/api/users/register", registerData);
        if (response.data?.token) {
            localStorage.setItem("star7_token", response.data.token);
        }
        return response.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "Something went wrong while registering your account. Please try again.";
        throw new Error(errorMessage);
    }
};

export const googleLoginUser = async (googleData) => {
    try {
        const response = await api.post("/api/users/google-login", googleData);
        if (response.data?.token) {
            localStorage.setItem("star7_token", response.data.token);
        }
        return response.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "Something went wrong while logging in with Google. Please try again.";
        throw new Error(errorMessage);
    }
};

export const currentUser = async () => {
    try {
        const response = await api.get("/api/users/current-user");
        return response.data?.user || response.data;
    } catch (error) {
        return null;
    }
};

export const logoutUser = async () => {
    try {
        const response = await api.post("/api/users/logout-user");
        localStorage.removeItem("star7_token");
        return response.data;
    } catch (error) {
        localStorage.removeItem("star7_token");
        return null;
    }
};

export const myOrders = async () => {
    try {
        const response = await api.get("/api/orders/my-orders");
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong while getting My Orders. Please try again.";
        throw new Error(errorMessage);
    }
};

export const createOrderApi = async (orderData) => {
    try {
        const response = await api.post("/api/orders", orderData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong while placing your order. Please try again.";
        throw new Error(errorMessage, { cause: error });
    }
};

export const allOrders = async () => {
    try {
        const response = await api.get("/api/orders");
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong while getting All Orders. Please try again.";
        throw new Error(errorMessage, { cause: error });
    }
};

export const updateOrderStatusApi = async (id, status) => {
    try {
        const response = await api.put(`/api/orders/${id}`, { id, status });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to update order status.";
        throw new Error(errorMessage, { cause: error });
    }
};

export const cancelOrderApi = async (id) => {
    try {
        const response = await api.put(`/api/orders/${id}/cancel`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to cancel order.";
        throw new Error(errorMessage, { cause: error });
    }
};

// ==========================================
// Admin Menu Management API Functions
// ==========================================

export const getAdminProducts = async (params = {}) => {
    try {
        const response = await api.get("/api/products/admin", { params });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to load admin menu items.";
        throw new Error(errorMessage, { cause: error });
    }
};

export const createProductApi = async (formData) => {
    try {
        const response = await api.post("/api/products", formData, {
            headers: formData instanceof FormData ? { "Content-Type": "multipart/form-data" } : {}
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to create menu item.";
        throw new Error(errorMessage, { cause: error });
    }
};

export const updateProductApi = async (id, formData) => {
    try {
        const response = await api.put(`/api/products/${id}`, formData, {
            headers: formData instanceof FormData ? { "Content-Type": "multipart/form-data" } : {}
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to update menu item.";
        throw new Error(errorMessage, { cause: error });
    }
};

export const deleteProductApi = async (id, permanent = false) => {
    try {
        const response = await api.delete(`/api/products/${id}`, {
            params: { permanent }
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to delete/archive menu item.";
        throw new Error(errorMessage, { cause: error });
    }
};

export const toggleProductStatusApi = async (id) => {
    try {
        const response = await api.patch(`/api/products/${id}/toggle-status`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to toggle item availability.";
        throw new Error(errorMessage, { cause: error });
    }
};

export default api;