import React from 'react';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import About from './Pages/About';
import Contact from './Pages/Contact';
import MyOrders from './Pages/MyOrders';
import { Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white font-sans selection:bg-amber-500 selection:text-black">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Content (Routes) */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/orders" element={<MyOrders />} />
            </Routes>

            {/* Global Footer */}
            <footer className="bg-[#080809] border-t border-white/5 py-8 mt-12 text-center text-xs text-gray-500">
                <p className="font-semibold text-gray-400">Star7 Foodies</p>
                <p className="mt-1">© 2026. Made with ❤️ for Star7Foodies - Swiggy & Blinkit Inspired UI.</p>
            </footer>
        </div>
    );
};

export default App;