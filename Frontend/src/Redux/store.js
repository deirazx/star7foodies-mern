import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./Slices/auth"

export const store = configureStore({
    reducer: {
        auth: authReducer
    },
})