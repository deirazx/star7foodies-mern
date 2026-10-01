import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
    totalCartAmount: 0
}

const getCartKey = (item) => {
    if (!item) return '';
    if (item.cartItemId) return item.cartItemId;
    const id = item._id || item.id || '';
    const portionStr = typeof item.portion === 'string'
        ? item.portion.trim().toLowerCase()
        : (item.selectedPortion ? item.selectedPortion.trim().toLowerCase() : 'std');
    return `${id}-${portionStr}`;
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const targetKey = getCartKey(newItem);
            const existingItem = state.items.find((item) => getCartKey(item) === targetKey);
            const qtyToAdd = Number(newItem.quantity) > 0 ? Number(newItem.quantity) : 1;

            if (existingItem) {
                existingItem.quantity += qtyToAdd;
            } else {
                state.items.unshift({
                    ...newItem,
                    cartItemId: targetKey,
                    portion: typeof newItem.portion === 'string' ? newItem.portion : (newItem.selectedPortion || 'Standard'),
                    quantity: qtyToAdd
                });
            }
            // Dynamically recalculate total cart amount
            state.totalCartAmount = state.items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
        },

        removeFromCart: (state, action) => {
            const targetId = action.payload;
            const existingIndex = state.items.findIndex(
                (item) => item.cartItemId === targetId || item._id === targetId || item.id === targetId || getCartKey(item) === targetId
            );

            if (existingIndex > -1) {
                if (state.items[existingIndex].quantity > 1) {
                    state.items[existingIndex].quantity -= 1;
                } else {
                    state.items.splice(existingIndex, 1);
                }
            }
            // Dynamically recalculate total cart amount
            state.totalCartAmount = state.items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
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