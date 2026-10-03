import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaHome,
    FaUtensils,
    FaShoppingBag,
    FaHistory,
    FaUser
} from 'react-icons/fa';
import { useSelector } from 'react-redux';

const BottomNavbar = () => {
    const location = useLocation();

    const user = useSelector((state) => state?.auth?.user);
    const cartItems = useSelector((state) => state?.cart?.items || []);
    const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const navItems = [
        {
            name: 'Home',
            path: '/',
            icon: FaHome,
            isCenter: false,
        },
        {
            name: 'Menu',
            path: '/menu',
            icon: FaUtensils,
            isCenter: false,
        },
        {
            name: 'Orders',
            path: '/orders',
            altPaths: ['/my-orders'],
            icon: FaHistory,
            isCenter: true, // CENTER HERO BUTTON (Highest mobile usage: Live tracking & past orders)
        },
        {
            name: 'Cart',
            path: '/cart',
            icon: FaShoppingBag,
            badge: cartCount,
            isCenter: false,
        },
        {
            name: 'Account',
            path: '/profile',
            altPaths: ['/account'],
            icon: FaUser,
            isCenter: false,
        },
    ];

    return (
        <>
            {/* Mobile Bottom Navigation Bar (5 Items with Center Hero Button) */}
            <nav
                aria-label="Mobile Bottom Navigation"
                className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0c0c0e]/95 backdrop-blur-2xl border-t border-white/10 z-[999] px-2 py-1.5 pb-safe shadow-[0_-8px_32px_rgba(0,0,0,0.85)]"
            >
                <div className="flex items-center justify-around max-w-md mx-auto">
                    {navItems.map((item) => {
                        const isActive =
                            location.pathname === item.path ||
                            (item.altPaths && item.altPaths.includes(location.pathname));
                        const Icon = item.icon;

                        // ── CENTER HERO BUTTON: My Orders ──
                        if (item.isCenter) {
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    aria-label="View My Orders"
                                    className="relative flex flex-col items-center justify-center flex-1 -top-3.5 group cursor-pointer"
                                >
                                    {/* Elevated glowing circle */}
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-xl ${
                                            isActive
                                                ? 'bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 text-black scale-105 shadow-[0_6px_20px_rgba(245,158,11,0.6)] ring-4 ring-[#0c0c0e]'
                                                : 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-black shadow-[0_4px_16px_rgba(245,158,11,0.4)] ring-4 ring-[#0c0c0e] group-hover:scale-105 active:scale-95'
                                        }`}
                                    >
                                        <Icon className="text-xl filter drop-shadow transition-transform duration-200 group-hover:scale-110" />
                                    </div>

                                    {/* Label */}
                                    <span
                                        className={`text-[10px] font-black tracking-tight mt-1 transition-colors duration-200 ${
                                            isActive ? 'text-amber-400 font-black' : 'text-gray-300 font-bold'
                                        }`}
                                    >
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        }

                        // ── STANDARD NAVIGATION ITEMS: Home, Menu, Cart, Account ──
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                aria-label={item.name}
                                className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                                    isActive ? 'text-amber-400' : 'text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                {isActive && (
                                    <span className="absolute -top-1.5 w-6 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-[0_0_12px_#f59e0b]"></span>
                                )}

                                <div className="relative p-1">
                                    {/* If Account and user is logged in, show personalized initial */}
                                    {item.name === 'Account' && user?.name ? (
                                        <div
                                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                                isActive
                                                    ? 'bg-amber-400 text-black ring-2 ring-amber-400/50'
                                                    : 'bg-white/10 text-gray-300 border border-white/20'
                                            }`}
                                        >
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    ) : (
                                        <Icon
                                            className={`text-lg transition-transform duration-200 ${
                                                isActive
                                                    ? 'scale-115 text-amber-400 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                                                    : 'text-gray-400'
                                            }`}
                                        />
                                    )}

                                    {/* Cart Badge counter */}
                                    {item.badge > 0 && (
                                        <span className="absolute -top-1 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[9px] font-black min-w-[17px] h-[17px] px-1 flex items-center justify-center rounded-full border-2 border-[#0c0c0e] shadow-md animate-pulse">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>

                                <span
                                    className={`text-[10px] font-bold tracking-tight transition-colors duration-200 ${
                                        isActive ? 'text-amber-400 font-extrabold' : 'text-gray-400'
                                    }`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <style>{`
                @supports (padding-bottom: env(safe-area-inset-bottom)) {
                    .pb-safe {
                        padding-bottom: calc(0.35rem + env(safe-area-inset-bottom));
                    }
                }
            `}</style>
        </>
    );
};

export default BottomNavbar;
