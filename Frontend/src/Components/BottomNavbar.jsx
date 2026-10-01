import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaHome,
    FaUtensils,
    FaShoppingBag,
    FaHistory,
    FaUser,
    FaShieldAlt
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
            icon: FaHome
        },
        {
            name: 'Menu',
            path: '/menu',
            icon: FaUtensils
        },
        {
            name: 'Cart',
            path: '/cart',
            icon: FaShoppingBag,
            badge: cartCount
        },
        {
            name: 'Orders',
            path: '/orders',
            icon: FaHistory
        },
        user?.role === 'admin'
            ? {
                name: 'Admin',
                path: '/admin',
                icon: FaShieldAlt
            }
            : user
                ? {
                    name: 'Account',
                    path: '/orders',
                    icon: FaUser
                }
                : {
                    name: 'Sign In',
                    path: '/login',
                    icon: FaUser
                },
    ];

    return (
        <nav
            aria-label="Mobile Bottom Navigation"
            className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0c0c0e]/95 backdrop-blur-2xl border-t border-white/10 z-[999] px-2 py-1.5 pb-safe shadow-[0_-8px_32px_rgba(0,0,0,0.8)]"
        >
            <div className="flex items-center justify-around max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                                isActive ? 'text-amber-400' : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            {/* Active Top Bar Pill Indicator */}
                            {isActive && (
                                <span className="absolute -top-1.5 w-6 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-[0_0_12px_#f59e0b]"></span>
                            )}

                            {/* Icon with Counter Badge */}
                            <div className="relative p-1">
                                <Icon
                                    className={`text-lg transition-transform duration-200 ${
                                        isActive
                                            ? 'scale-115 text-amber-400 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                                            : 'text-gray-400'
                                    }`}
                                />
                                {item.badge > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[9px] font-black min-w-[17px] h-[17px] px-1 flex items-center justify-center rounded-full border-2 border-[#0c0c0e] shadow-md animate-pulse">
                                        {item.badge}
                                    </span>
                                )}
                            </div>

                            {/* Label */}
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

            <style>{`
                @supports (padding-bottom: env(safe-area-inset-bottom)) {
                    .pb-safe {
                        padding-bottom: calc(0.35rem + env(safe-area-inset-bottom));
                    }
                }
            `}</style>
        </nav>
    );
};

export default BottomNavbar;
