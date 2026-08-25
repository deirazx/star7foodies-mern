import axios from "axios"

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