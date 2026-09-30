import Navbar from './Components/Navbar';
import BottomNavbar from './Components/BottomNavbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import About from './Pages/About';
import Contact from './Pages/Contact';
import MyOrders from './Pages/MyOrders';
import { Routes, Route } from 'react-router-dom';
import Cart from './Pages/Cart';
import Admin from './Pages/Admin';
import Menu from './Pages/Menu';

const App = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white font-sans selection:bg-amber-500 selection:text-black pb-16 md:pb-0">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Content (Routes) */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/admin' element={<Admin />} />
            </Routes>

            {/* Global Footer */}
            <footer className="bg-[#080809] border-t border-white/5 py-8 mt-12 text-center text-xs text-gray-500 mb-4 md:mb-0">
                <p className="font-semibold text-gray-400">Star7 Foodies</p>
                <p className="mt-1">© 2026. Made with ❤️ for Star7Foodies - Swiggy & Blinkit Inspired UI.</p>
            </footer>

            {/* Mobile Bottom Navigation */}
            <BottomNavbar />
        </div>
    );
};

export default App;