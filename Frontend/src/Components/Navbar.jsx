import React, { useEffect, useState } from 'react';
import {
    FaUser,
    FaTimes,
    FaSignOutAlt,
    FaChevronDown,
    FaUtensils,
    FaHistory,
    FaShoppingBag,
    FaSearch,
    FaHeart,
    FaShieldAlt,
    FaPhoneAlt
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser } from '../Redux/Slices/auth.js';
import { currentUser, logoutUser } from '../Api/axios';

function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const user = useSelector((state) => state?.auth?.user);
    const cartItems = useSelector((state) => state?.cart?.items || []);
    const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    // Check backend session on mount if user is not already populated in Redux
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const loggedInUser = await currentUser();
                if (loggedInUser) {
                    dispatch(setUser(loggedInUser));
                }
            } catch (error) {
                // User is guest/not logged in
            }
        };

        if (!user) {
            fetchCurrentUser();
        }
    }, [dispatch, user]);

    // Close menus on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setShowProfileDropdown(false);
    }, [location.pathname]);

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (searchQuery.trim()) {
                navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
                setMobileMenuOpen(false);
            } else {
                navigate('/menu');
            }
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (e) {
            console.error("Logout error", e);
        } finally {
            dispatch(clearUser());
            setShowProfileDropdown(false);
            setMobileMenuOpen(false);
            navigate('/');
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Menu', path: '/menu' },
        ...(user?.role === "admin" ? [{ name: 'Admin', path: '/admin', isSpecial: true }] : []),
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <>
            <header className='w-full h-16 md:h-20 fixed top-0 left-0 z-[1000] bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-white/8 flex items-center transition-all duration-300 shadow-md'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
                    <div className='flex items-center justify-between gap-3 sm:gap-6 h-full'>

                        {/* LEFT SECTION: Brand Logo */}
                        <div className='flex items-center gap-3 shrink-0'>
                            <Link to="/" className="flex items-center gap-2.5 group">
                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-all duration-300">
                                    <FaUtensils className="text-sm md:text-base" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg md:text-xl font-black tracking-tight text-white leading-none">
                                        Star7<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Foodies</span>
                                    </span>
                                    <span className="text-[9px] text-gray-400 font-medium tracking-wider hidden sm:block">
                                        Desi Swad • Fast Village Delivery
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* CENTER SECTION: Navigation Links (Desktop) */}
                        <nav className='hidden md:flex items-center gap-1 lg:gap-2'>
                            {navLinks.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                                            isActive
                                                ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                                                : item.isSpecial
                                                    ? 'text-orange-400 hover:text-white hover:bg-orange-500/10'
                                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {item.isSpecial && <FaShieldAlt className="text-xs text-amber-500" />}
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* RIGHT SECTION: Search, Cart, Phone, Professional Login */}
                        <div className='flex items-center gap-2 sm:gap-3.5'>
                            {/* Functional Search Box */}
                            <div className="relative hidden lg:block">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearchSubmit}
                                    placeholder="Search samosa, biryani..."
                                    className="w-44 xl:w-56 pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/60 focus:bg-white/8 transition-all"
                                />
                                <FaSearch
                                    onClick={handleSearchSubmit}
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs cursor-pointer hover:text-amber-400"
                                />
                            </div>

                            {/* Quick Call Button (Village friendly) */}
                            <a
                                href="tel:+919876543210"
                                title="Call Restaurant Directly"
                                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all"
                            >
                                <FaPhoneAlt className="text-[10px]" />
                                <span className="hidden xl:inline">Call Order</span>
                            </a>

                            {/* Cart Icon Button with Badge */}
                            <Link
                                to="/cart"
                                className="relative p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-gray-300 hover:text-amber-400 transition-all cursor-pointer group"
                                title="View Food Cart"
                            >
                                <FaShoppingBag className="text-sm group-hover:scale-110 transition-transform duration-200" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] text-black font-black rounded-full flex items-center justify-center shadow-md">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* PROFESSIONAL LOGIN / USER ACCOUNT BUTTON */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 transition-all duration-200 cursor-pointer"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-extrabold text-xs shadow-md">
                                            {user.name ? user.name[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U')}
                                        </div>
                                        <span className="text-xs font-bold text-white max-w-[80px] sm:max-w-[100px] truncate hidden sm:block">
                                            {user.name?.split(' ')[0] || 'Account'}
                                        </span>
                                        <FaChevronDown className={`text-gray-400 text-[9px] transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Profile Dropdown Menu */}
                                    {showProfileDropdown && (
                                        <div className="absolute right-0 mt-2 w-60 bg-[#121215] border border-white/10 rounded-2xl py-2 shadow-2xl animate-fadeIn overflow-hidden z-50">
                                            {/* User Details */}
                                            <div className="px-4 py-3 border-b border-white/8 bg-white/[0.02]">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-white text-xs font-bold truncate">
                                                        {user.name || "Foodie Customer"}
                                                    </p>
                                                    {user.role && (
                                                        <span className="px-1.5 py-0.5 text-[8px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded uppercase">
                                                            {user.role}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-400 text-[11px] truncate mt-0.5">
                                                    {user.email}
                                                </p>
                                            </div>

                                            <div className="py-1">
                                                <Link
                                                    to="/orders"
                                                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-300 hover:text-amber-400 hover:bg-white/5 transition-all font-medium"
                                                >
                                                    <FaHistory className="text-amber-500 text-xs" />
                                                    <span>My Orders (ऑर्डर ट्रैक करें)</span>
                                                </Link>

                                                {user?.role === "admin" && (
                                                    <Link
                                                        to="/admin"
                                                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 transition-all font-semibold"
                                                    >
                                                        <FaShieldAlt className="text-xs" />
                                                        <span>Admin Dashboard</span>
                                                    </Link>
                                                )}

                                                <Link
                                                    to="/menu"
                                                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-300 hover:text-amber-400 hover:bg-white/5 transition-all font-medium"
                                                >
                                                    <FaUtensils className="text-amber-500 text-xs" />
                                                    <span>Explore Menu (मेन्यू देखें)</span>
                                                </Link>
                                            </div>

                                            <div className="pt-1 border-t border-white/8">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-all font-semibold cursor-pointer"
                                                >
                                                    <FaSignOutAlt className="text-xs" />
                                                    <span>Log Out (लॉग आउट)</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    <FaUser className="text-[10px]" />
                                    <span>Sign In</span>
                                </Link>
                            )}

                            {/* Mobile Hamburger Toggle Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle Mobile Menu"
                                className='md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white cursor-pointer'
                            >
                                {mobileMenuOpen ? <FaTimes className='w-4 h-4' /> : (
                                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Slide-down Menu Drawer */}
            <div className={`fixed top-16 left-0 right-0 bg-[#0c0c0e]/98 backdrop-blur-2xl border-b border-white/10 md:hidden transition-all duration-300 ease-in-out z-[999] overflow-hidden ${mobileMenuOpen ? 'max-h-[85vh] opacity-100 shadow-2xl' : 'max-h-0 opacity-0'}`}>
                <div className='p-5 space-y-4 max-h-[80vh] overflow-y-auto'>
                    {/* User Profile Banner in Mobile Menu */}
                    {user ? (
                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-black text-sm shadow-md">
                                {user.name ? user.name[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U')}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-white text-sm font-bold truncate">{user.name || "Customer"}</p>
                                <p className="text-gray-400 text-xs truncate">{user.email}</p>
                            </div>
                            {user.role === "admin" && (
                                <span className="px-2 py-0.5 text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md">
                                    ADMIN
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-between">
                            <div>
                                <p className="text-white font-bold text-xs">Welcome to Star7Foodies</p>
                                <p className="text-gray-400 text-[10px]">Sign in to order food & track delivery</p>
                            </div>
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs rounded-xl shadow cursor-pointer"
                            >
                                Sign In
                            </Link>
                        </div>
                    )}

                    {/* Mobile Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            placeholder="Search dishes (समोसा, बिरयानी)..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                        />
                        <FaSearch
                            onClick={handleSearchSubmit}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                        />
                    </div>

                    {/* Nav Links List */}
                    <div className="space-y-1 pt-1">
                        {navLinks.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className='flex items-center justify-between p-3 rounded-xl text-gray-300 text-sm font-semibold hover:bg-white/5 hover:text-amber-400 transition-colors'
                            >
                                <span className="flex items-center gap-2">
                                    {item.isSpecial && <FaShieldAlt className="text-amber-500" />}
                                    {item.name}
                                </span>
                                <span className="text-gray-600 text-xs">›</span>
                            </Link>
                        ))}

                        {user && (
                            <Link
                                to="/orders"
                                onClick={() => setMobileMenuOpen(false)}
                                className='flex items-center justify-between p-3 rounded-xl text-gray-300 text-sm font-semibold hover:bg-white/5 hover:text-amber-400 transition-colors'
                            >
                                <span className="flex items-center gap-2">
                                    <FaHistory className="text-amber-500 text-xs" />
                                    My Orders (ऑर्डर ट्रैक करें)
                                </span>
                                <span className="text-gray-600 text-xs">›</span>
                            </Link>
                        )}
                    </div>

                    {/* Quick Call Us for Village Users */}
                    <div className="pt-2 border-t border-white/5">
                        <a
                            href="tel:+919876543210"
                            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold transition-all"
                        >
                            <FaPhoneAlt className="text-xs" />
                            <span>Call Restaurant Directly (+91 98765 43210)</span>
                        </a>
                    </div>

                    {user && (
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl font-bold border border-rose-500/20 cursor-pointer"
                        >
                            <FaSignOutAlt />
                            <span>Log Out</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Backdrop overlay */}
            {(mobileMenuOpen || showProfileDropdown) && (
                <div
                    className='fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[997]'
                    onClick={() => {
                        setMobileMenuOpen(false);
                        setShowProfileDropdown(false);
                    }}
                ></div>
            )}

            {/* Content Spacer */}
            <div className='h-16 md:h-20'></div>
        </>
    );
}

export default Navbar;