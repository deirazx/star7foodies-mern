import React, { useEffect, useState, useMemo } from 'react';
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaClock,
    FaShoppingBag,
    FaBan,
    FaCheckCircle,
    FaUtensils,
    FaMotorcycle,
    FaPhoneAlt,
    FaUser,
    FaExclamationTriangle,
    FaReceipt,
    FaGoogle,
    FaLock
} from 'react-icons/fa';
import { myOrders, cancelOrderApi, googleLoginUser } from '../Api/axios';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../Redux/Slices/auth.js';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Utils/firebase';

const DISH_FALLBACK_IMAGES = {
    biryani: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60",
    pizza: "https://images.unsplash.com/photo-1601924582970-9238b4ead50c?w=500&auto=format&fit=crop&q=60",
    burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    paneer: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60",
    naan: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=60",
    manchurian: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60",
    default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"
};

const getDishImage = (item) => {
    // 1. Try real product image from populated database reference
    const p = item.productId;
    if (p && typeof p === 'object') {
        if (p.image_url) return p.image_url;
        if (p.imageUrl) return p.imageUrl;
        if (p.image) return p.image;
    }

    // 2. Try direct item image
    if (item.image_url) return item.image_url;
    if (item.imageUrl) return item.imageUrl;
    if (item.image) return item.image;

    // 3. Fallback based on name keywords
    const name = (item.name || p?.name || '').toLowerCase();
    if (name.includes('biryani')) return DISH_FALLBACK_IMAGES.biryani;
    if (name.includes('pizza')) return DISH_FALLBACK_IMAGES.pizza;
    if (name.includes('burger')) return DISH_FALLBACK_IMAGES.burger;
    if (name.includes('paneer')) return DISH_FALLBACK_IMAGES.paneer;
    if (name.includes('naan') || name.includes('roti')) return DISH_FALLBACK_IMAGES.naan;
    if (name.includes('manchurian') || name.includes('chinese')) return DISH_FALLBACK_IMAGES.manchurian;

    return DISH_FALLBACK_IMAGES.default;
};

const MyOrders = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.auth?.user);

    const [activeFilter, setActiveFilter] = useState('All');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [cancellingId, setCancellingId] = useState(null);
    const [cancelModalOrder, setCancelModalOrder] = useState(null);
    const [notification, setNotification] = useState(null);

    const filters = ['All', 'Active Orders', 'Delivered', 'Cancelled'];

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await myOrders();
            const fetched = response?.orders || response || [];

            // Sort newest first by creation timestamp
            const sorted = [...fetched].sort((a, b) => {
                const dateA = new Date(a.createdAt || a.date || 0).getTime();
                const dateB = new Date(b.createdAt || b.date || 0).getTime();
                return dateB - dateA;
            });

            setOrders(sorted);
        } catch (error) {
            console.error("Error fetching customer orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const name = result.user.displayName;
            const email = result.user.email;
            const response = await googleLoginUser({ name, email });
            const loggedInUser = response.user ? response.user : response;
            dispatch(setUser(loggedInUser));
        } catch (err) {
            console.error("Google sign-in error in MyOrders:", err);
            showNotice("Google Sign-In failed. Please try again.", true);
        } finally {
            setGoogleLoading(false);
        }
    };

    const showNotice = (msg, isErr = false) => {
        setNotification({ text: msg, isError: isErr });
        setTimeout(() => setNotification(null), 4000);
    };

    // Handle Order Cancellation
    const handleConfirmCancel = async () => {
        if (!cancelModalOrder) return;
        const orderId = cancelModalOrder._id || cancelModalOrder.id;

        try {
            setCancellingId(orderId);
            await cancelOrderApi(orderId);
            setOrders(prev =>
                prev.map(o => (o._id === orderId || o.id === orderId) ? { ...o, status: "Cancelled" } : o)
            );
            showNotice("Your order has been cancelled successfully.");
            setCancelModalOrder(null);
        } catch (err) {
            showNotice(err.message || "Failed to cancel order.", true);
        } finally {
            setCancellingId(null);
        }
    };

    // Helper to format status pill
    const getStatusBadge = (status) => {
        const s = (status || 'Pending').toLowerCase();
        if (s === 'delivered') {
            return {
                label: 'Delivered',
                classes: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                icon: <FaCheckCircle className="text-xs" />
            };
        }
        if (s === 'cancelled') {
            return {
                label: 'Cancelled',
                classes: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
                icon: <FaBan className="text-xs" />
            };
        }
        if (s === 'preparing') {
            return {
                label: 'Kitchen Preparing',
                classes: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
                icon: <FaUtensils className="text-xs animate-spin" />
            };
        }
        if (s === 'out for delivery') {
            return {
                label: 'Out for Delivery',
                classes: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
                icon: <FaMotorcycle className="text-xs animate-bounce" />
            };
        }
        return {
            label: 'Order Placed • Pending',
            classes: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
            icon: <FaClock className="text-xs animate-pulse" />
        };
    };

    // Filter orders
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const st = (order.status || 'Pending').toLowerCase();
            if (activeFilter.startsWith('All')) return true;
            if (activeFilter.startsWith('Active')) {
                return st === 'pending' || st === 'preparing' || st === 'out for delivery';
            }
            if (activeFilter.startsWith('Delivered')) {
                return st === 'delivered';
            }
            if (activeFilter.startsWith('Cancelled')) {
                return st === 'cancelled';
            }
            return true;
        });
    }, [orders, activeFilter]);

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white py-6 sm:py-8 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 rounded-full blur-3xl pointer-events-none"
                style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, rgba(0,0,0,0) 70%)' }}
            ></div>

            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 relative z-10">
                {/* Header & Tabs */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/8 pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                            <FaReceipt />
                            <span>Customer Order History</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                            My Orders
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">
                            Track live kitchen preparation, delivery progress, and past receipts.
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2">
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                    activeFilter === f
                                        ? 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20'
                                        : 'bg-[#121214] text-gray-300 border-white/8 hover:border-white/20 hover:text-white'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Toast Notification */}
                {notification && (
                    <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border animate-fadeIn ${
                        notification.isError
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    }`}>
                        {notification.isError ? <FaExclamationTriangle /> : <FaCheckCircle />}
                        <span>{notification.text}</span>
                    </div>
                )}

                {/* Orders Content */}
                {loading ? (
                    <div className="py-20 text-center space-y-3 bg-[#121214] border border-white/8 rounded-3xl">
                        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-sm font-bold text-white">Loading your orders...</p>
                    </div>
                ) : !user ? (
                    <div className="py-16 text-center bg-[#121214] border border-white/8 rounded-3xl space-y-5 px-6 max-w-lg mx-auto shadow-2xl">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                            <FaReceipt className="text-2xl" />
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-xl font-black text-white">Track Your Food Orders</h3>
                            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                                Please sign in to your Star7Foodies account to track live kitchen preparation, delivery progress, and view past receipts.
                            </p>
                        </div>
                        <div className="space-y-2.5 pt-1 max-w-xs mx-auto">
                            <button
                                onClick={handleGoogleLogin}
                                disabled={googleLoading}
                                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                            >
                                <FaGoogle className="text-amber-400 text-xs" />
                                <span>{googleLoading ? "Signing in..." : "1-Click Continue with Google"}</span>
                            </button>
                            <Link
                                to="/login?redirect=/orders"
                                className="block w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all text-center cursor-pointer"
                            >
                                Sign In with Email / Password
                            </Link>
                            <Link
                                to="/menu"
                                className="block w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl transition-all text-center border border-white/10"
                            >
                                Explore Menu First
                            </Link>
                        </div>
                        <div className="pt-3 border-t border-white/5">
                            <a
                                href="tel:+917562926866"
                                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-semibold"
                            >
                                <FaPhoneAlt className="text-[10px]" />
                                <span>Call Kitchen Hotline: +91 75629 26866</span>
                            </a>
                        </div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="py-20 text-center bg-[#121214] border border-white/8 rounded-3xl space-y-4 px-4">
                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                            <FaShoppingBag className="text-2xl" />
                        </div>
                        <h3 className="text-lg font-extrabold text-white">No Orders Found</h3>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto">
                            {activeFilter === 'All'
                                ? "You haven't placed any food orders yet. Browse our delicious village menu and treat yourself!"
                                : `No orders found with status "${activeFilter}".`}
                        </p>
                        <Link
                            to="/menu"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            <FaUtensils className="text-xs" />
                            <span>Explore Menu</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {filteredOrders.map((order, idx) => {
                            const orderId = order._id || order.id || `order-${idx}`;
                            const status = order.status || 'Pending';
                            const badge = getStatusBadge(status);
                            const canCancel = status.toLowerCase() === 'pending';
                            const dateStr = order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                                : order.date || 'Recent';

                            const address = order.address || {};
                            const recipientName = address.name || "Customer";
                            const recipientPhone = address.phone;
                            const fullAddress = [
                                address.street,
                                address.city,
                                address.state,
                                address.postalCode ? `PIN: ${address.postalCode}` : null
                            ].filter(Boolean).join(', ');

                            const paymentMethod = order.paymentMethod === 'COD' ? 'Cash on Delivery' : (order.paymentMethod || 'Online Paid');
                            const totalAmount = order.totalCartPrice || order.total || 0;

                            return (
                                <div
                                    key={orderId}
                                    className="bg-[#121214] border border-white/8 hover:border-amber-500/20 rounded-3xl p-5 sm:p-7 shadow-xl transition-all space-y-5"
                                >
                                    {/* ── 1. Top Bar: Order ID, Timestamp, Status Pill ── */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/8">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono font-bold text-amber-400">
                                                    #{orderId.slice(-8).toUpperCase()}
                                                </span>
                                                <span className="text-gray-600 text-xs">•</span>
                                                <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                                                    <FaCalendarAlt className="text-[10px] text-gray-500" />
                                                    {dateStr}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Pill Badge */}
                                        <div className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${badge.classes}`}>
                                            {badge.icon}
                                            <span>{badge.label}</span>
                                        </div>
                                    </div>

                                    {/* ── 2. Dishes List with Real Product Images ── */}
                                    <div className="space-y-3 divide-y divide-white/5">
                                        {(order.items || []).map((item, itemIdx) => {
                                            const dishImg = getDishImage(item);
                                            const dishName = item.productId?.name || item.name || "Delicious Dish";
                                            const dishPortion = typeof item.portion === 'string' ? item.portion : 'Standard Portion';
                                            const qty = item.qnty || item.quantity || 1;
                                            const price = Number(item.price) || 0;

                                            return (
                                                <div key={itemIdx} className="flex items-center justify-between gap-3 pt-3 first:pt-0">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <img
                                                            src={dishImg}
                                                            alt={dishName}
                                                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-white/10 shrink-0 bg-neutral-900 shadow-sm"
                                                            onError={(e) => {
                                                                e.target.src = DISH_FALLBACK_IMAGES.default;
                                                            }}
                                                        />
                                                        <div className="min-w-0">
                                                            <h4 className="text-xs sm:text-sm font-black text-white truncate">
                                                                {dishName}
                                                            </h4>
                                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                                {dishPortion}
                                                            </p>
                                                            <p className="text-[10px] text-amber-400 font-bold mt-0.5">
                                                                ₹{price} × {qty}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="text-right shrink-0">
                                                        <span className="text-sm sm:text-base font-black text-white">
                                                            ₹{price * qty}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* ── 3. Delivery Details (What user filled during checkout) ── */}
                                    <div className="bg-[#18181b] border border-white/5 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                                        {/* Recipient info */}
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                <FaUser className="text-[9px] text-amber-500" />
                                                <span>Recipient & Contact</span>
                                            </span>
                                            <p className="font-bold text-white text-sm">{recipientName}</p>
                                            {recipientPhone && (
                                                <p className="text-gray-300 font-medium flex items-center gap-1 mt-0.5">
                                                    <FaPhoneAlt className="text-[9px] text-emerald-400" />
                                                    <span>+91 {recipientPhone}</span>
                                                </p>
                                            )}
                                        </div>

                                        {/* Delivery address */}
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                <FaMapMarkerAlt className="text-[9px] text-amber-500" />
                                                <span>Delivery Address</span>
                                            </span>
                                            <p className="text-gray-300 font-medium leading-relaxed">
                                                {fullAddress || "Direct counter pickup / Village delivery"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ── 4. Card Bottom: Payment Mode, Total & Cancel Order Option ── */}
                                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/8">
                                        <div>
                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                                                Payment Method
                                            </span>
                                            <span className="text-xs font-semibold text-emerald-400">
                                                {paymentMethod}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                            <div className="text-left sm:text-right">
                                                <span className="text-[10px] text-gray-400 uppercase font-bold block">
                                                    Grand Total
                                                </span>
                                                <span className="text-lg sm:text-xl font-black text-amber-400">
                                                    ₹{totalAmount}
                                                </span>
                                            </div>

                                            {/* CANCEL ORDER BUTTON (Allowed while status is Pending) */}
                                            {canCancel ? (
                                                <button
                                                    onClick={() => setCancelModalOrder(order)}
                                                    className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500 text-rose-400 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                                                >
                                                    <FaBan className="text-xs" />
                                                    <span>Cancel Order</span>
                                                </button>
                                            ) : status.toLowerCase() === 'cancelled' ? (
                                                <span className="text-xs text-rose-400 font-semibold italic">
                                                    Order was cancelled
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 font-medium">
                                                    Kitchen preparing hot • Cannot cancel
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── CANCEL ORDER CONFIRMATION MODAL ── */}
            {cancelModalOrder && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-[#121215] border border-white/10 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-scaleUp">
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                            <FaExclamationTriangle className="text-2xl" />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-white">Cancel This Order?</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Are you sure you want to cancel order <strong>#{cancelModalOrder._id?.slice(-8).toUpperCase()}</strong>? The kitchen will stop preparation immediately.
                            </p>
                        </div>

                        <div className="flex gap-2.5 pt-2">
                            <button
                                onClick={() => setCancelModalOrder(null)}
                                className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                disabled={cancellingId !== null}
                                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/25 transition-all cursor-pointer disabled:opacity-50"
                            >
                                {cancellingId ? "Cancelling..." : "Yes, Cancel Order"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
