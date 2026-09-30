import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaShoppingBag, FaHistory, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const BottomNavbar = () => {
    const location = useLocation();
    const cartItems = useSelector((state) => state?.cart?.items || []);
    const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const navItems = [
        { name: 'Home', path: '/', icon: FaHome },
        { name: 'Search', path: '/menu', icon: FaSearch },
        { name: 'Cart', path: '/cart', icon: FaShoppingBag, badge: cartCount },
        { name: 'Orders', path: '/orders', icon: FaHistory },
        { name: 'Profile', path: '/profile', icon: FaUser }, // Or /login if not authenticated
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f10]/95 backdrop-blur-xl border-t border-white/5 z-[999] px-2 py-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="relative flex flex-col items-center justify-center w-16 h-12 gap-1 group cursor-pointer transition-all"
                        >
                            {/* Active indicator dot */}
                            {isActive && (
                                <span className="absolute -top-3 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b]"></span>
                            )}

                            {/* Icon container */}
                            <div className="relative">
                                <Icon
                                    className={`text-lg transition-all duration-300 ${
                                        isActive
                                            ? 'text-amber-500 scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                            : 'text-gray-400 group-hover:text-gray-200'
                                    }`}
                                />
                                {/* Badge (for cart) */}
                                {item.badge > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-[#0f0f10] scale-110 animate-bounceIn">
                                        {item.badge}
                                    </span>
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`text-[9px] font-semibold transition-all duration-300 ${
                                    isActive ? 'text-amber-500' : 'text-gray-500 group-hover:text-gray-300'
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
                        padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
                    }
                }
                @keyframes bounceIn {
                    0% { transform: scale(0); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1.1); }
                }
                .animate-bounceIn {
                    animation: bounceIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
            `}</style>
        </div>
    );
};

export default BottomNavbar;
