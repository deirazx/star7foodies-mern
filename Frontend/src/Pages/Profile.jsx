import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setUser, clearUser } from '../Redux/Slices/auth.js';
import { currentUser, myOrders, logoutUser, googleLoginUser } from '../Api/axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Utils/firebase';
import {
    FaUser,
    FaEnvelope,
    FaPhoneAlt,
    FaShoppingBag,
    FaHistory,
    FaMapMarkerAlt,
    FaSignOutAlt,
    FaUtensils,
    FaShieldAlt,
    FaCheckCircle,
    FaClock,
    FaMotorcycle,
    FaChevronRight,
    FaEdit,
    FaSave,
    FaTimes,
    FaAward,
    FaGoogle,
    FaLock,
    FaArrowRight,
    FaExclamationCircle
} from 'react-icons/fa';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state?.auth?.user);

    const [authChecking, setAuthChecking] = useState(!user);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    const [recentOrders, setRecentOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phoneInput, setPhoneInput] = useState('');
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);

    // 1. Sync User Session Smoothly on Mount (Avoids flickering/reload feeling)
    useEffect(() => {
        let isMounted = true;
        const syncSession = async () => {
            try {
                if (!user) {
                    const loggedIn = await currentUser();
                    if (loggedIn && isMounted) {
                        dispatch(setUser(loggedIn));
                    }
                }
            } catch (err) {
                console.warn("Session check error:", err);
            } finally {
                if (isMounted) {
                    setAuthChecking(false);
                }
            }
        };

        syncSession();
        return () => {
            isMounted = false;
        };
    }, [dispatch, user]);

    // 2. Fetch User Recent Orders (Only if logged in)
    useEffect(() => {
        let isMounted = true;
        const loadOrders = async () => {
            try {
                setLoadingOrders(true);
                const res = await myOrders();
                const fetched = res?.orders || res || [];
                const sorted = [...fetched].sort((a, b) => {
                    const dateA = new Date(a.createdAt || a.date || 0).getTime();
                    const dateB = new Date(b.createdAt || b.date || 0).getTime();
                    return dateB - dateA;
                });
                if (isMounted) {
                    setRecentOrders(sorted);

                    // If user has phone in state or latest order address, prefill
                    if (user?.phone) {
                        setPhoneInput(user.phone);
                    } else if (sorted.length > 0 && sorted[0].address?.phone) {
                        setPhoneInput(sorted[0].address.phone);
                    }
                }
            } catch (err) {
                console.warn("Could not load recent orders for profile:", err);
            } finally {
                if (isMounted) {
                    setLoadingOrders(false);
                }
            }
        };

        if (user) {
            loadOrders();
        } else {
            setLoadingOrders(false);
        }

        return () => {
            isMounted = false;
        };
    }, [user]);

    // Handle 1-Click Google Login directly on the Account page
    const handleGoogleLogin = async () => {
        setAuthError(null);
        setGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const name = result.user.displayName;
            const email = result.user.email;

            const response = await googleLoginUser({ name, email });
            const loggedInUser = response.user ? response.user : response;
            dispatch(setUser(loggedInUser));
        } catch (err) {
            console.error("Profile Google sign-in failed:", err);
            setAuthError(err.message || "Google Sign-In failed. Please try again.");
        } finally {
            setGoogleLoading(false);
        }
    };

    // Handle Phone Number Save (Stores in state & localStorage)
    const handleSavePhone = () => {
        const clean = phoneInput.replace(/\D/g, '').slice(-10);
        if (clean.length === 10) {
            const updated = { ...user, phone: clean };
            dispatch(setUser(updated));
            localStorage.setItem('user_phone', clean);
            setIsEditingPhone(false);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 2500);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (e) {
            console.error("Logout error", e);
        } finally {
            dispatch(clearUser());
            setLogoutModal(false);
            navigate('/');
        }
    };

    // ── STATE 1: INITIAL AUTH VERIFICATION LOADER (Prevents jarring page flashing) ──
    if (authChecking && !user) {
        return (
            <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 bg-[#0a0a0b] text-white">
                <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs text-gray-400 font-medium">Verifying your account status...</p>
            </div>
        );
    }

    // ── STATE 2: GUEST / NOT LOGGED IN VIEW ──
    // Clearly informs the guest to login and highlights all profile features accessible upon sign-in
    if (!user) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] text-white pt-12 md:pt-16 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Ambient Background Glows */}
                <div
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 rounded-full blur-3xl pointer-events-none"
                    style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, rgba(0,0,0,0) 70%)' }}
                />

                <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                    {/* Header Suggestion Card */}
                    <div className="bg-gradient-to-br from-[#16161a] via-[#121215] to-[#16161a] border border-white/10 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center text-black font-black text-2xl mx-auto shadow-xl shadow-amber-500/25">
                            <FaUser />
                        </div>

                        <div className="space-y-1.5">
                            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                Guest Customer Browsing
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                My Account & Profile
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                                Please sign in to your Star7Foodies account to view your complete profile status, saved delivery address, mobile number, and active orders.
                            </p>
                        </div>

                        {/* Error Message if Google Sign-In Fails */}
                        {authError && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-center gap-2">
                                <FaExclamationCircle className="shrink-0" />
                                <span>{authError}</span>
                            </div>
                        )}

                        {/* Direct Action Buttons */}
                        <div className="space-y-3 pt-2 max-w-md mx-auto">
                            {/* 1-Click Google Sign-In (Direct on this page) */}
                            <button
                                onClick={handleGoogleLogin}
                                disabled={googleLoading}
                                className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-md cursor-pointer hover:border-amber-500/40 disabled:opacity-60"
                            >
                                <FaGoogle className="text-amber-400 text-sm" />
                                <span>{googleLoading ? "Signing in with Google..." : "1-Click Continue with Google"}</span>
                            </button>

                            {/* Standard Email/Password Login with redirect parameter */}
                            <Link
                                to="/login?redirect=/profile"
                                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <FaLock className="text-xs" />
                                <span>Sign In with Email / Password</span>
                                <FaArrowRight className="text-[10px]" />
                            </Link>

                            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                                <span>Don't have an account?</span>
                                <Link
                                    to="/register?redirect=/profile"
                                    className="text-amber-400 font-bold hover:underline"
                                >
                                    Create Free Account →
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Benefit Cards: What User Can Check Once Logged In */}
                    <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 sm:p-7 space-y-5">
                        <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 text-amber-400">
                            <FaCheckCircle className="text-xs" />
                            <span>Why Sign In? All Features You Unlock:</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                            {/* Benefit 1 */}
                            <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                <div className="flex items-center gap-2 text-amber-400 font-bold">
                                    <FaPhoneAlt className="text-xs" />
                                    <span>1. Saved Mobile Number</span>
                                </div>
                                <p className="text-gray-400 text-[11px] leading-relaxed">
                                    Link your 10-digit mobile number for immediate order verification and live delivery updates.
                                </p>
                            </div>

                            {/* Benefit 2 */}
                            <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                                    <FaMapMarkerAlt className="text-xs" />
                                    <span>2. Saved Village Addresses</span>
                                </div>
                                <p className="text-gray-400 text-[11px] leading-relaxed">
                                    Save your home or village landmark across PIN codes 843323, 843314 for 1-click checkout.
                                </p>
                            </div>

                            {/* Benefit 3 */}
                            <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                <div className="flex items-center gap-2 text-sky-400 font-bold">
                                    <FaHistory className="text-xs" />
                                    <span>3. Live Order Tracking</span>
                                </div>
                                <p className="text-gray-400 text-[11px] leading-relaxed">
                                    Watch your meals get prepared hot in the kitchen and follow delivery riders in real time.
                                </p>
                            </div>

                            {/* Benefit 4 */}
                            <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                <div className="flex items-center gap-2 text-orange-400 font-bold">
                                    <FaUtensils className="text-xs" />
                                    <span>4. Instant Reordering</span>
                                </div>
                                <p className="text-gray-400 text-[11px] leading-relaxed">
                                    Access past receipts and reorder your favorite biryanis, rolls, and curries with a single tap.
                                </p>
                            </div>
                        </div>

                        {/* Direct Kitchen Call Hotline */}
                        <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <span className="text-xs text-gray-400">
                                Need phone ordering or help right now?
                            </span>
                            <a
                                href="tel:+917562926866"
                                className="w-full sm:w-auto px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <FaPhoneAlt className="text-[10px]" />
                                <span>Call Owner: +91 75629 26866</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── STATE 3: FULL LOGGED IN USER PROFILE ──
    const displayName = user.name || "Star7 Foodie Diner";
    const displayEmail = user.email || "No email linked";
    const displayPhone = user.phone || phoneInput || "Not added yet";
    const totalOrdersCount = recentOrders.length;
    const deliveredCount = recentOrders.filter(o => /delivered/i.test(o.status)).length;

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white pt-20 md:pt-24 pb-28 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* ── TOP HERO PROFILE CARD ── */}
                <div className="bg-gradient-to-br from-[#16161a] via-[#121215] to-[#16161a] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center text-black font-black text-2xl sm:text-3xl shadow-xl shadow-amber-500/20 shrink-0">
                                {displayName.charAt(0).toUpperCase()}
                            </div>

                            {/* Name & Badges */}
                            <div className="min-w-0 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-xl sm:text-2xl font-black text-white truncate">
                                        {displayName}
                                    </h1>
                                    {user.role === "admin" ? (
                                        <span className="px-2 py-0.5 text-[10px] font-black bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full">
                                            ADMIN
                                        </span>
                                    ) : (
                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                                            <FaAward className="text-[9px]" /> Star Diner
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 flex items-center gap-1.5 truncate">
                                    <FaEnvelope className="text-[10px] text-amber-400" />
                                    <span>{displayEmail}</span>
                                </p>
                                <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                                    <FaMapMarkerAlt className="text-[10px] text-emerald-400" />
                                    <span>Star7Foodies Village Delivery Hub • Muzaffarpur, Bihar</span>
                                </p>
                            </div>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex items-center gap-2.5 sm:self-start shrink-0">
                            <Link
                                to="/orders"
                                className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                <FaHistory className="text-xs" />
                                <span>My Orders</span>
                            </Link>
                            <button
                                onClick={() => setLogoutModal(true)}
                                className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                                title="Log Out"
                            >
                                <FaSignOutAlt className="text-xs" />
                                <span className="hidden sm:inline">Log Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Ribbon */}
                    <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/5 text-center">
                        <div className="p-2.5 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-base sm:text-xl font-black text-amber-400">{totalOrdersCount}</span>
                            <p className="text-[10px] text-gray-400 mt-0.5">Total Orders</p>
                        </div>
                        <div className="p-2.5 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-base sm:text-xl font-black text-emerald-400">{deliveredCount}</span>
                            <p className="text-[10px] text-gray-400 mt-0.5">Delivered Hot</p>
                        </div>
                        <div className="p-2.5 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-base sm:text-xl font-black text-white">843323</span>
                            <p className="text-[10px] text-gray-400 mt-0.5">Primary Hub</p>
                        </div>
                    </div>
                </div>

                {/* ── 2 MAIN SECTIONS ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* ════════════════════════════════════════════
                        SECTION 1: MY ORDERS
                    ════════════════════════════════════════════ */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-white/5">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                        <FaShoppingBag className="text-xs" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-black text-white">
                                            1. My Orders
                                        </h2>
                                        <p className="text-[10px] text-gray-400">Track active deliveries & meal history</p>
                                    </div>
                                </div>
                                <Link
                                    to="/orders"
                                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                                >
                                    <span>All Orders</span>
                                    <FaChevronRight className="text-[9px]" />
                                </Link>
                            </div>

                            {/* Recent Orders List Preview */}
                            {loadingOrders ? (
                                <div className="py-8 text-center text-xs text-gray-400">
                                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                    <span>Loading your meals...</span>
                                </div>
                            ) : recentOrders.length === 0 ? (
                                <div className="py-8 text-center space-y-3 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl p-4">
                                    <FaUtensils className="text-gray-500 text-2xl mx-auto" />
                                    <p className="text-xs text-gray-400 font-medium">No food orders placed yet.</p>
                                    <Link
                                        to="/menu"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs rounded-xl shadow cursor-pointer"
                                    >
                                        Order Hot Food Now
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentOrders.slice(0, 3).map((order) => {
                                        const orderId = order._id || order.id || 'ORDER';
                                        const status = order.status || 'Placed';
                                        const total = order.totalCartPrice || order.total || 0;
                                        const itemCount = order.items?.length || 1;
                                        const isDelivered = /delivered/i.test(status);
                                        const isCancelled = /cancelled/i.test(status);

                                        return (
                                            <div
                                                key={orderId}
                                                className="p-3.5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-amber-500/20 rounded-2xl transition-all space-y-2.5"
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[11px] font-mono text-gray-400">
                                                            #{orderId.slice(-6).toUpperCase()}
                                                        </span>
                                                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-md ${
                                                            isDelivered
                                                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                                : isCancelled
                                                                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                                                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse'
                                                        }`}>
                                                            {status}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-black text-amber-400">
                                                        ₹{total}
                                                    </span>
                                                </div>

                                                <p className="text-[11px] text-gray-300 truncate">
                                                    {order.items?.map(it => `${it.qnty || it.quantity || 1}× ${it.name} (${it.portion || 'Plate'})`).join(', ')}
                                                </p>

                                                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-white/5">
                                                    <span>{itemCount} {itemCount === 1 ? 'item' : 'items'} • COD Delivery</span>
                                                    <Link
                                                        to="/orders"
                                                        className="text-amber-400 hover:underline font-semibold"
                                                    >
                                                        View Status →
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {recentOrders.length > 3 && (
                                        <Link
                                            to="/orders"
                                            className="block text-center py-2 text-xs text-amber-400 hover:text-amber-300 font-bold bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                                        >
                                            View All {recentOrders.length} Orders →
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Quick Reorder Food Card */}
                        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/20 rounded-3xl p-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 text-lg shrink-0">
                                    🍛
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Craving Piping Hot Food?</h4>
                                    <p className="text-[10px] text-gray-400">Authentic desi village kitchen cooking ready to dispatch.</p>
                                </div>
                            </div>
                            <Link
                                to="/menu"
                                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-xs rounded-xl shadow transition-all shrink-0 cursor-pointer"
                            >
                                Open Menu
                            </Link>
                        </div>
                    </div>

                    {/* ════════════════════════════════════════════
                        SECTION 2: CUSTOMER PROFILE DETAILS
                    ════════════════════════════════════════════ */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                    <FaUser className="text-xs" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-white">
                                        2. Customer Profile
                                    </h2>
                                    <p className="text-[10px] text-gray-400">Name, mobile number & Gmail details</p>
                                </div>
                            </div>

                            {/* Details List */}
                            <div className="space-y-4 text-xs">
                                {/* Name Field */}
                                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                        Full Name
                                    </span>
                                    <p className="font-bold text-white text-sm">
                                        {displayName}
                                    </p>
                                </div>

                                {/* Gmail / Email Field */}
                                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                            Gmail / Email Address
                                        </span>
                                        <span className="text-[9px] bg-emerald-500/15 text-emerald-400 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                                            Verified ✓
                                        </span>
                                    </div>
                                    <p className="font-bold text-white text-sm break-all">
                                        {displayEmail}
                                    </p>
                                </div>

                                {/* Mobile Number Field (With Edit Option) */}
                                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                            Mobile Number
                                        </span>
                                        {!isEditingPhone ? (
                                            <button
                                                onClick={() => setIsEditingPhone(true)}
                                                className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                                            >
                                                <FaEdit className="text-[9px]" />
                                                <span>Edit</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setIsEditingPhone(false)}
                                                className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                                            >
                                                <FaTimes className="text-[9px]" />
                                                <span>Cancel</span>
                                            </button>
                                        )}
                                    </div>

                                    {!isEditingPhone ? (
                                        <div className="flex items-center gap-2">
                                            <FaPhoneAlt className="text-amber-400 text-xs" />
                                            <span className="font-bold text-white text-sm">
                                                {displayPhone !== "Not added yet" ? `+91 ${displayPhone}` : displayPhone}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex items-center bg-[#18181b] border border-amber-500/40 rounded-xl px-3 py-1.5">
                                                <span className="text-xs text-gray-400 mr-2 font-semibold">+91</span>
                                                <input
                                                    type="tel"
                                                    maxLength={10}
                                                    value={phoneInput}
                                                    onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                    placeholder="9876543210"
                                                    className="w-full bg-transparent text-white text-xs font-bold focus:outline-none placeholder-gray-500"
                                                />
                                            </div>
                                            <button
                                                onClick={handleSavePhone}
                                                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <FaSave className="text-xs" />
                                                <span>Save Mobile Number</span>
                                            </button>
                                        </div>
                                    )}

                                    {savedSuccess && (
                                        <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                                            <FaCheckCircle className="text-[9px]" />
                                            <span>Mobile number saved successfully!</span>
                                        </p>
                                    )}
                                </div>

                                {/* Village Delivery Hub Coverage */}
                                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                        Delivery Service Pincodes
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {["843323 (Hub)", "843314", "843320", "843313", "843328"].map((pin) => (
                                            <span key={pin} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300">
                                                {pin}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Village Customer Support Card */}
                        <div className="bg-[#121214] border border-white/5 rounded-3xl p-5 space-y-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <FaPhoneAlt className="text-xs" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Direct Village Support</h4>
                                    <p className="text-[10px] text-gray-400">Need help with an ongoing meal or custom request?</p>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-1">
                                <a
                                    href="tel:+917562926866"
                                    className="flex-1 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl text-center transition-all flex items-center justify-center gap-1.5"
                                >
                                    <FaPhoneAlt className="text-[10px]" />
                                    <span>Call Kitchen</span>
                                </a>
                                <Link
                                    to="/contact"
                                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold rounded-xl text-center transition-all"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {logoutModal && (
                <div
                    className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setLogoutModal(false)}
                >
                    <div
                        className="bg-[#141417] border border-white/10 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl">
                            <FaSignOutAlt />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-white">Log Out from Star7Foodies?</h3>
                            <p className="text-xs text-gray-400 mt-1">
                                Are you sure you want to log out from your customer account?
                            </p>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                onClick={() => setLogoutModal(false)}
                                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs border border-white/10 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs transition-all shadow-md shadow-rose-500/20 cursor-pointer"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
