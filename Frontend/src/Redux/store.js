import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./Slices/auth.js"
import cartReducer from './Slices/cart.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer
    },
})