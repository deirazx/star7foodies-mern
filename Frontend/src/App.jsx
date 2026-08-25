import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';

const App = () => {
    const [cartItems, setCartItems] = useState({});

    const handleAddToCart = (id) => {
        setCartItems(prev => ({
            ...prev,
            [id]: (prev[id] || 0) + 1
        }));
    };

    const handleRemoveFromCart = (id) => {
        setCartItems(prev => {
            const updated = { ...prev };
            if (updated[id] > 1) {
                updated[id] -= 1;
            } else {
                delete updated[id];
            }
            return updated;
        });
    };

    const clearCart = () => {
        setCartItems({});
    };

    // Calculate total items in cart for Navbar badge
    const totalCartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white font-sans selection:bg-amber-500 selection:text-black">
            {/* Top Navigation */}
            <Navbar cartCount={totalCartCount} />
            
            {/* Main Content (Home Page Component) */}
            <Home 
                cartItems={cartItems} 
                handleAddToCart={handleAddToCart} 
                handleRemoveFromCart={handleRemoveFromCart} 
                clearCart={clearCart} 
            />

            {/* Global Footer */}
            <footer className="bg-[#080809] border-t border-white/5 py-8 mt-12 text-center text-xs text-gray-500">
                <p className="font-semibold text-gray-400">Star7 Foodies</p>
                <p className="mt-1">© 2026. Made with ❤️ for Star7Foodies - Swiggy & Blinkit Inspired UI.</p>
            </footer>
        </div>
    );
};

export default App;