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