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
    FaMapMarkerAlt,
    FaHeart
} from "react-icons/fa";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser } from '../Redux/Slices/auth.js';
import { currentUser, logoutUser } from '../Api/axios';

function Navbar({ cartCount = 0 }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [activeLocation, setActiveLocation] = useState('Mumbai, India');
    const [wishlistCount, setWishlistCount] = useState(2);

    const user = useSelector((state) => state?.auth?.user);
    const dispatch = useDispatch();

    // Check backend session on mount if user is not already populated in Redux
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const loggedInUser = await currentUser();
                if (loggedInUser) {
                    dispatch(setUser(loggedInUser));
                }
            } catch (error) {
                console.error("Navbar: Error fetching current user:", error);
            }
        };

        if (!user) {
            fetchCurrentUser();
        }
    }, [dispatch, user]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (e) {
            console.error("Logout error", e);
        } finally {
            dispatch(clearUser());
            setShowProfileDropdown(false);
        }
    };

    const locations = ['Mumbai, India', 'Delhi NCR, India', 'Bengaluru, India', 'Pune, India'];

    return (
        <>
            <nav className='w-full h-16 md:h-20 fixed top-0 left-0 z-[1000] bg-black/60 backdrop-blur-xl border-b border-white/5 flex items-center transition-all duration-300'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
                    <div className='flex items-center justify-between gap-4 h-full'>

                        {/* LEFT SECTION: Logo & Location */}
                        <div className='flex items-center gap-6 shrink-0'>
                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                                    <FaUtensils className="text-xs md:text-sm" />
                                </div>
                                <span className="text-lg md:text-xl font-bold tracking-tight text-white font-sans">
                                    Star7<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Foodies</span>
                                </span>
                            </Link>

                            {/* Location Picker */}
                            <div className="relative hidden sm:block">
                                <button
                                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-amber-500/30 text-gray-300 hover:text-white transition-all text-xs cursor-pointer"
                                >
                                    <FaMapMarkerAlt className="text-amber-500 text-[10px]" />
                                    <span>{activeLocation}</span>
                                    <FaChevronDown className={`text-[8px] opacity-60 transition-transform duration-300 ${showLocationDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showLocationDropdown && (
                                    <div className="absolute left-0 mt-2 w-48 bg-[#181818]/95 backdrop-blur-2xl border border-white/10 rounded-xl py-2 shadow-xl animate-fadeIn">
                                        {locations.map((loc) => (
                                            <button
                                                key={loc}
                                                onClick={() => {
                                                    setActiveLocation(loc);
                                                    setShowLocationDropdown(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:text-amber-500 hover:bg-white/5 transition-all cursor-pointer"
                                            >
                                                {loc}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CENTER SECTION: Nav Links */}
                        <div className='hidden md:flex items-center gap-6 lg:gap-8'>
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Menu', path: '/menu' },
                                { name: 'Offers', path: '/offers', badge: 'New' },
                                { name: 'About', path: '/about' },
                                { name: 'Contact', path: '/contact' }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className='relative text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200 flex items-center gap-1'
                                >
                                    {item.name}
                                    {item.badge && (
                                        <span className="px-1.5 py-0.5 text-[8px] font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full leading-none scale-90">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* RIGHT SECTION: Search, Cart, Wishlist, Profile */}
                        <div className='flex items-center gap-2 sm:gap-4'>
                            {/* Search Box */}
                            <div className="relative hidden lg:block">
                                <input
                                    type="text"
                                    placeholder="Search dishes..."
                                    className="w-40 xl:w-52 pl-8 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all"
                                />
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            </div>

                            {/* Wishlist */}
                            <button className="relative p-2 text-gray-300 hover:text-red-500 transition-colors cursor-pointer group">
                                <FaHeart className="text-base group-hover:scale-110 transition-transform duration-200" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-[8px] text-white font-bold rounded-full flex items-center justify-center leading-none">
                                        {wishlistCount}
                                    </span>
                                )}
                            </button>

                            {/* Cart */}
                            <button className="relative p-2 text-gray-300 hover:text-amber-500 transition-colors cursor-pointer group">
                                <FaShoppingBag className="text-base group-hover:scale-110 transition-transform duration-200" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-[8px] text-white font-bold rounded-full flex items-center justify-center leading-none">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            <div className="h-5 w-px bg-white/10 hidden sm:block"></div>

                            {/* Profile Dropdown or Login */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-white/5 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold border border-white/10">
                                            {user.name ? user.name[0].toUpperCase() : 'U'}
                                        </div>
                                        <FaChevronDown className={`text-gray-400 text-[9px] transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    {showProfileDropdown && (
                                        <div className="absolute right-0 mt-2 w-56 bg-[#181818]/95 backdrop-blur-2xl border border-white/10 rounded-2xl py-2 shadow-2xl animate-fadeIn overflow-hidden z-50">
                                            {/* User Details Header */}
                                            <div className="px-4 py-3 border-b border-white/10 mb-1 bg-white/5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-white text-xs font-bold truncate flex items-center gap-1.5">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                                                        {user.name || "Foodie User"}
                                                    </p>
                                                    {user.role && (
                                                        <span className="px-1.5 py-0.5 text-[8px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded uppercase tracking-wider shrink-0">
                                                            {user.role}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-400 text-[11px] truncate font-medium mt-1">
                                                    {user.email}
                                                </p>
                                            </div>

                                            <Link to="/orders" className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-amber-500 hover:bg-white/5 transition-all font-medium" onClick={() => setShowProfileDropdown(false)}>
                                                <FaHistory className="text-amber-500" /> My Orders
                                            </Link>

                                            <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-amber-500 hover:bg-white/5 transition-all font-medium" onClick={() => setShowProfileDropdown(false)}>
                                                <FaUtensils className="text-amber-500" /> Restaurant Profile
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-all font-semibold border-t border-white/5 mt-1 cursor-pointer"
                                            >
                                                <FaSignOutAlt /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login"
                                    className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full text-xs font-semibold shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                >
                                    <FaUser className="text-[10px]" />
                                    <span>Login</span>
                                </Link>
                            )}

                            {/* Mobile Toggle */}
                            <button onClick={toggleMobileMenu} className='md:hidden text-gray-300 hover:text-white p-1.5 cursor-pointer'>
                                {mobileMenuOpen ? <FaTimes className='w-5 h-5' /> : (
                                    <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`fixed top-16 left-0 right-0 bg-[#0f0f10]/95 backdrop-blur-xl border-b border-white/5 md:hidden transition-all duration-300 ease-in-out z-[999] overflow-hidden ${mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className='px-6 py-6 space-y-4'>
                    {/* User Profile in Mobile Menu if logged in */}
                    {user && (
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold border border-white/10 shadow-md">
                                {user.name ? user.name[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U')}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-white text-sm font-bold truncate">{user.name || "Foodie User"}</p>
                                <p className="text-gray-400 text-xs truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                    {/* Mobile Location Selector */}
                    <div className="py-2 border-b border-white/5 sm:hidden">
                        <p className="text-[10px] text-gray-400 uppercase mb-2">Deliver to:</p>
                        <div className="flex flex-wrap gap-2">
                            {locations.map((loc) => (
                                <button
                                    key={loc}
                                    onClick={() => {
                                        setActiveLocation(loc);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`px-3 py-1 rounded-full text-[10px] border transition-all cursor-pointer ${activeLocation === loc
                                        ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                                        : 'bg-white/5 border-white/10 text-gray-300'
                                        }`}
                                >
                                    {loc}
                                </button>
                            ))}
                        </div>
                    </div>

                    {[
                        { name: 'Home', path: '/' },
                        { name: 'Menu', path: '/menu' },
                        { name: 'Offers', path: '/offers' },
                        { name: 'About', path: '/about' },
                        { name: 'Contact', path: '/contact' },
                        user && { name: 'My Orders', path: '/orders' },
                        user && { name: 'Logout', path: '#', action: handleLogout }
                    ].filter(Boolean).map((item, index) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={item.action ? item.action : () => setMobileMenuOpen(false)}
                            className='block text-gray-300 text-base font-medium hover:text-amber-500 transition-colors'
                            style={{ animation: mobileMenuOpen ? `slideIn 0.3s ease-out ${index * 0.05}s both` : 'none' }}
                        >
                            {item.name}
                        </Link>
                    ))}

                    {!user && (
                        <Link
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold cursor-pointer"
                        >
                            <FaUser /> Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Overlay */}
            {(mobileMenuOpen || showProfileDropdown || showLocationDropdown) && (
                <div
                    className='fixed inset-0 bg-black/40 backdrop-blur-[1px] z-[997]'
                    onClick={() => {
                        setMobileMenuOpen(false);
                        setShowProfileDropdown(false);
                        setShowLocationDropdown(false);
                    }}
                ></div>
            )}

            {/* Content Spacer */}
            <div className='h-16 md:h-20'></div>

            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
            `}</style>
        </>
    );
}

export default Navbar;