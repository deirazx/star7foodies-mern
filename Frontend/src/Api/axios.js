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