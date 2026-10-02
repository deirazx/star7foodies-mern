import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaUtensils,
    FaShoppingBag,
    FaHistory,
    FaUser,
    FaShieldAlt,
    FaUserCircle,
    FaPhoneAlt,
    FaSignOutAlt,
    FaTimes,
    FaChevronRight
} from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../Redux/Slices/auth.js';
import { logoutUser } from '../Api/axios';

const BottomNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isAccountSheetOpen, setIsAccountSheetOpen] = useState(false);

    const user = useSelector((state) => state?.auth?.user);
    const cartItems = useSelector((state) => state?.cart?.items || []);
    const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const isAccountActive = location.pathname === '/profile' || location.pathname === '/orders';

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            dispatch(clearUser());
            setIsAccountSheetOpen(false);
            navigate('/');
        }
    };

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
            name: 'Account',
            isAction: true,
            onClick: () => setIsAccountSheetOpen(true),
            icon: FaUser,
            isActive: isAccountActive || isAccountSheetOpen
        },
    ];

    return (
        <>
            {/* Mobile Bottom Navigation Bar */}
            <nav
                aria-label="Mobile Bottom Navigation"
                className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0c0c0e]/95 backdrop-blur-2xl border-t border-white/10 z-[999] px-2 py-1.5 pb-safe shadow-[0_-8px_32px_rgba(0,0,0,0.8)]"
            >
                <div className="flex items-center justify-around max-w-md mx-auto">
                    {navItems.map((item) => {
                        const isActive = item.isAction ? item.isActive : location.pathname === item.path;
                        const Icon = item.icon;

                        if (item.isAction) {
                            return (
                                <button
                                    key={item.name}
                                    onClick={item.onClick}
                                    className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 cursor-pointer ${isActive ? 'text-amber-400' : 'text-gray-400 hover:text-gray-200'
                                        }`}
                                >
                                    {isActive && (
                                        <span className="absolute -top-1.5 w-6 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-[0_0_12px_#f59e0b]"></span>
                                    )}
                                    <div className="relative p-1">
                                        <Icon
                                            className={`text-lg transition-transform duration-200 ${isActive
                                                    ? 'scale-115 text-amber-400 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                                                    : 'text-gray-400'
                                                }`}
                                        />
                                    </div>
                                    <span
                                        className={`text-[10px] font-bold tracking-tight transition-colors duration-200 ${isActive ? 'text-amber-400 font-extrabold' : 'text-gray-400'
                                            }`}
                                    >
                                        {item.name}
                                    </span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200 cursor-pointer ${isActive ? 'text-amber-400' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                {isActive && (
                                    <span className="absolute -top-1.5 w-6 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-[0_0_12px_#f59e0b]"></span>
                                )}

                                <div className="relative p-1">
                                    <Icon
                                        className={`text-lg transition-transform duration-200 ${isActive
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

                                <span
                                    className={`text-[10px] font-bold tracking-tight transition-colors duration-200 ${isActive ? 'text-amber-400 font-extrabold' : 'text-gray-400'
                                        }`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* ACCOUNT QUICK ACTIONS BOTTOM SHEET MODAL */}
            {isAccountSheetOpen && (
                <div className="md:hidden fixed inset-0 z-[1001] flex flex-col justify-end">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsAccountSheetOpen(false)}
                    />

                    {/* Bottom Sheet Modal Content */}
                    <div className="relative z-10 bg-[#121216] border-t border-white/10 rounded-t-3xl p-5 pb-8 space-y-4 max-h-[85vh] overflow-y-auto animate-slideUp shadow-2xl">
                        {/* Drag Handle Bar */}
                        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-2" />

                        {/* Sheet Header */}
                        <div className="flex items-center justify-between border-b border-white/8 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-black text-sm shadow-md">
                                    {user?.name ? user.name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : '👤')}
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-extrabold leading-tight">
                                        {user?.name || "Welcome to Star7Foodies"}
                                    </h3>
                                    <p className="text-gray-400 text-xs mt-0.5">
                                        {user?.phoneNumber || user?.email || "Village Fast Food Kitchen"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsAccountSheetOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                            >
                                <FaTimes className="text-xs" />
                            </button>
                        </div>

                        {/* Quick Sections: 1st My Orders, 2nd Profile */}
                        <div className="space-y-2.5">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500/90 px-1">
                                Choose Account Section
                            </p>

                            {/* SECTION 1: My Orders */}
                            <button
                                onClick={() => {
                                    setIsAccountSheetOpen(false);
                                    navigate('/orders');
                                }}
                                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 active:scale-[0.98] transition-all text-left group cursor-pointer"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black font-extrabold shadow-md">
                                        <FaHistory className="text-base" />
                                    </div>
                                    <div>
                                        <h4 className="text-white text-sm font-extrabold flex items-center gap-2">
                                            1. My Orders
                                            <span className="text-[9px] px-1.5 py-0.5 bg-amber-500 text-black font-black rounded-full uppercase">Live</span>
                                        </h4>
                                        <p className="text-gray-300 text-xs mt-0.5">
                                            Track live food preparation & order history
                                        </p>
                                    </div>
                                </div>
                                <FaChevronRight className="text-amber-400 text-xs group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* SECTION 2: Profile */}
                            <button
                                onClick={() => {
                                    setIsAccountSheetOpen(false);
                                    navigate('/profile');
                                }}
                                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 active:scale-[0.98] transition-all text-left group cursor-pointer"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-black font-extrabold shadow-md">
                                        <FaUserCircle className="text-base" />
                                    </div>
                                    <div>
                                        <h4 className="text-white text-sm font-extrabold flex items-center gap-2">
                                            2. Customer Profile
                                        </h4>
                                        <p className="text-gray-300 text-xs mt-0.5">
                                            Mobile number, Gmail & saved address
                                        </p>
                                    </div>
                                </div>
                                <FaChevronRight className="text-emerald-400 text-xs group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* ADMIN DASHBOARD (If Admin) */}
                            {user?.role === 'admin' && (
                                <button
                                    onClick={() => {
                                        setIsAccountSheetOpen(false);
                                        navigate('/admin');
                                    }}
                                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/25 hover:bg-orange-500/20 active:scale-[0.98] transition-all text-left group cursor-pointer"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white font-extrabold shadow-md">
                                            <FaShieldAlt className="text-base" />
                                        </div>
                                        <div>
                                            <h4 className="text-white text-sm font-extrabold flex items-center gap-2">
                                                Admin Kitchen Dashboard
                                            </h4>
                                            <p className="text-gray-300 text-xs mt-0.5">
                                                Manage live incoming orders & food menu
                                            </p>
                                        </div>
                                    </div>
                                    <FaChevronRight className="text-orange-400 text-xs group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>

                        {/* Village Friendly Help Call */}
                        <div className="pt-2 border-t border-white/8">
                            <a
                                href="tel:+917562926866"
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all"
                            >
                                <FaPhoneAlt className="text-xs" />
                                <span>Call Village Kitchen (+91 75629 26866)</span>
                            </a>
                        </div>

                        {/* Sign In or Logout */}
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                                <FaSignOutAlt />
                                <span>Log Out of Account</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setIsAccountSheetOpen(false);
                                    navigate('/login');
                                }}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <FaUser />
                                <span>Sign In / Create Account</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @supports (padding-bottom: env(safe-area-inset-bottom)) {
                    .pb-safe {
                        padding-bottom: calc(0.35rem + env(safe-area-inset-bottom));
                    }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slideUp {
                    animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </>
    );
};

export default BottomNavbar;
