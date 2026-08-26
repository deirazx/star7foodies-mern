import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
    totalCartAmount: 0
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item._id === newItem._id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.unshift({
                    ...newItem,
                    quantity: newItem.quantity || 1
                });
            }
            // Dynamically recalculate total cart amount
            state.totalCartAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        },

        removeFromCart: (state, action) => {
            const itemId = action.payload;
            const existingItem = state.items.find((item) => item._id === itemId);
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                } else {
                    state.items = state.items.filter((item) => item._id !== itemId);
                }
            }
            // Dynamically recalculate total cart amount
            state.totalCartAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        },

        clearCart: (state) => {
            state.items = [];
            state.totalCartAmount = 0;
        }
    },
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
const cartReducer = cartSlice.reducer;
export default cartReducer;