import axios from "axios"

axios.defaults.withCredentials = true;

export const allFoods = async () => {
    try {
        const response = await axios.get("/api/products/");
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong while getting all Items. Please try again."
        throw new Error(errorMessage);
    }
}

export const getProductByIdApi = async (id) => {
    try {
        const response = await axios.get(`/api/products/${id}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong while getting dish details.";
        throw new Error(errorMessage);
    }
}

export const loginUser = async (loginData) => {
    try {
        const response = await axios.post("/api/users/login", loginData);
        return response.data
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "Something went wrong while loging your account. Please try again."
        throw new Error(errorMessage)
    }
}

export const registerUser = async (registerData) => {
    try {
        const response = await axios.post("/api/users/register", registerData);
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
        const response = await axios.post("/api/users/google-login", googleData);
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
        const response = await axios.get("/api/users/current-user");
        return response.data?.user || response.data;
    } catch (error) {
        return null;
    }
};

export const logoutUser = async () => {
    try {
        const response = await axios.post("/api/users/logout-user");
        return response.data;
    } catch (error) {
        return null;
    }
};

export const myOrders = async () => {
    try {
        const response = await axios.get("/api/orders/my-orders");
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong while getting My Orders. Please try again."
        throw new Error(errorMessage);
    }
};


export const createOrderApi = async (orderData) => {
    try {
        const response = await axios.post("/api/orders", orderData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong while placing your order. Please try again.";
        throw new Error(errorMessage, { cause: error });
    }
};

export const allOrders = async () => {
    try {
        const response = await axios.get("/api/orders");
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong while getting All Orders. Please try again.";
        throw new Error(errorMessage, { cause: error });
    }
};

export const updateOrderStatusApi = async (id, status) => {
    try {
        const response = await axios.put(`/api/orders/${id}`, { id, status });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to update order status.";
        throw new Error(errorMessage, { cause: error });
    }
};

export const cancelOrderApi = async (id) => {
    try {
        const response = await axios.put(`/api/orders/${id}/cancel`);
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
        const response = await axios.get("/api/products/admin", { params });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to load admin menu items.";
        throw new Error(errorMessage, { cause: error });
    }
};

export const createProductApi = async (formData) => {
    try {
        const response = await axios.post("/api/products", formData, {
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
        const response = await axios.put(`/api/products/${id}`, formData, {
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
        const response = await axios.delete(`/api/products/${id}`, {
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
        const response = await axios.patch(`/api/products/${id}/toggle-status`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to toggle item availability.";
        throw new Error(errorMessage, { cause: error });
    }
};