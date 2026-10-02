import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, deleteFromCart, clearCart } from '../Redux/Slices/cart.js';
import { Link } from 'react-router-dom';
import {
    FaShoppingBag,
    FaTrash,
    FaArrowLeft,
    FaArrowRight,
    FaStar,
    FaMotorcycle,
    FaShieldAlt,
    FaMinus,
    FaPlus,
    FaRegDotCircle,
    FaPercent,
} from 'react-icons/fa';

const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state?.cart?.items || []);
    const totalCartAmount = useSelector((state) => state?.cart?.totalCartAmount || 0);

    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    /* ── Empty Cart ─────────────────────────────────────────── */
    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-8 text-center">
                <div className="relative w-28 h-28 mb-6">
                    <div className="w-28 h-28 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <FaShoppingBag className="text-5xl text-amber-500/60" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-7 h-7 bg-[#1a1a1d] border border-white/10 rounded-full flex items-center justify-center text-sm font-bold text-gray-400">
                        0
                    </span>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Your cart is empty</h2>
                <p className="text-gray-400 text-sm mb-8 max-w-xs">
                    Looks like you haven't added anything yet. Browse our menu and add something delicious!
                </p>
                <Link
                    to="/"
                    className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-orange-500/20 hover:from-amber-600 hover:to-orange-600 hover:scale-105 active:scale-95 transition-all"
                >
                    <FaArrowLeft className="text-xs" /> Explore Menu
                </Link>
            </div>
        );
    }

    /* ── Filled Cart ─────────────────────────────────────────── */
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 animate-fadeIn">

            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                        Your{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                            Selection
                        </span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl text-xs font-semibold transition-all"
                    >
                        <FaArrowLeft className="text-[10px]" /> Continue Shopping
                    </Link>
                    <button
                        onClick={() => dispatch(clearCart())}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/20 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                        <FaTrash className="text-[10px]" /> Clear All
                    </button>
                </div>
            </div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* ── LEFT: Cart Items ── */}
                <div className="lg:col-span-2 space-y-3">
                    {cartItems.map((item) => {
                        const itemId = item._id || item.id;
                        const cartKey = item.cartItemId || `${itemId}-${item.portion || item.selectedPortion || 'std'}`;
                        const imageUrl = item.imageUrl || item.image || item.image_url;
                        const isVeg = item.isVeg !== undefined
                            ? item.isVeg
                            : !(/chicken|beef|meat|mutton|pork|fish|egg/i.test(item.name));
                        const rating = item.rating || (4.0 + (item.name?.length % 10) / 10).toFixed(1);
                        const portionName = item.portion || item.selectedPortion || 'Standard Serving';
                        const isHalf = /half/i.test(portionName);
                        const isFull = /full/i.test(portionName);

                        return (
                            <div
                                key={cartKey}
                                className="group flex flex-col sm:flex-row gap-4 bg-[#111113] border border-white/5 hover:border-amber-500/20 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-black/30"
                            >
                                {/* Image */}
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-neutral-900">
                                    <img
                                        src={imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className={`absolute top-1.5 left-1.5 inline-flex items-center justify-center p-0.5 border rounded-sm bg-black/60 ${isVeg ? 'border-emerald-500 text-emerald-500' : 'border-red-500 text-red-500'}`}>
                                        <FaRegDotCircle className="text-[8px]" />
                                    </span>
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                    <div>
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-amber-400 transition-colors line-clamp-1">
                                                    {item.name}
                                                </h3>

                                                {/* HIGHLY PROMINENT PORTION BADGE (HALF VS FULL CLEAR DISPLAY) */}
                                                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                                                    {isHalf ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-amber-500/15 border border-amber-500/40 text-amber-400 shadow-sm">
                                                            <span>Half Plate</span>
                                                        </span>
                                                    ) : isFull ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-orange-500/15 border border-orange-500/40 text-orange-400 shadow-sm">
                                                            <span>Full Plate</span>
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-gray-300">
                                                            {portionName}
                                                        </span>
                                                    )}

                                                    <span className="text-xs text-gray-400 font-medium">
                                                        ₹{item.price} / plate
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => dispatch(deleteFromCart(cartKey))}
                                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0 cursor-pointer"
                                                title={`Remove ${portionName} of ${item.name}`}
                                            >
                                                <FaTrash className="text-xs" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="flex items-center gap-1 text-[11px] font-bold text-gray-300 bg-white/5 px-2 py-0.5 rounded-full">
                                                <FaStar className="text-amber-500 text-[9px]" />
                                                {rating}
                                            </span>
                                            {item.category && (
                                                <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                                                    {item.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Price + Qty Stepper */}
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                        <div>
                                            <span className="text-base font-black text-amber-400">
                                                ₹{item.price * item.quantity}
                                            </span>
                                            {item.quantity > 1 && (
                                                <span className="text-[10px] text-gray-500 ml-1.5">
                                                    (₹{item.price} × {item.quantity})
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center bg-amber-500 text-black font-extrabold rounded-xl overflow-hidden shadow-md">
                                            <button
                                                onClick={() => dispatch(removeFromCart(cartKey))}
                                                className="px-3 py-1.5 hover:bg-amber-600 hover:text-white transition-all font-black cursor-pointer"
                                                title="Decrease quantity"
                                            >
                                                <FaMinus className="text-[9px]" />
                                            </button>
                                            <span className="px-3 font-black text-sm min-w-[28px] text-center select-none">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
                                                className="px-3 py-1.5 hover:bg-amber-600 hover:text-white transition-all font-black cursor-pointer"
                                                title="Increase quantity"
                                            >
                                                <FaPlus className="text-[9px]" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                        {[
                            { icon: FaMotorcycle, label: 'Fast Delivery', sub: 'Local area prep' },
                            { icon: FaShieldAlt, label: 'Safe & Hygienic', sub: 'Village kitchen quality' },
                            { icon: FaPercent, label: 'Best Desi Taste', sub: 'Fresh daily spices' },
                        ].map(({ icon: Icon, label, sub }) => (
                            <div key={label} className="flex flex-col items-center gap-2 p-3 bg-white/3 border border-white/5 rounded-xl text-center">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <Icon className="text-sm" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-white/80">{label}</p>
                                    <p className="text-[10px] text-gray-500">{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT: Order Summary (No Promo Code suggestions as requested) ── */}
                <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-24">
                    {/* Bill Details */}
                    <div className="bg-[#111113] border border-white/5 rounded-2xl p-5 space-y-4">
                        <h4 className="text-sm font-bold text-white">Bill Overview</h4>
                        <div className="space-y-3 text-xs text-gray-400">
                            <div className="flex justify-between items-center">
                                <span>Items Subtotal ({totalItems} items)</span>
                                <span className="text-white font-extrabold text-sm">₹{totalCartAmount}</span>
                            </div>

                            <div className="flex justify-between items-center text-gray-400">
                                <span>Delivery Fee</span>
                                <span className="text-amber-400/90 font-medium">Calculated at checkout</span>
                            </div>

                            <div className="pt-2 border-t border-white/8 flex justify-between items-center">
                                <span className="text-white font-black text-sm">Total Subtotal</span>
                                <span className="text-xl font-black text-amber-400">₹{totalCartAmount}</span>
                            </div>
                        </div>

                        {/* Serviceable Pincodes Notice */}
                        <div className="px-3.5 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-gray-300 space-y-1">
                            <p className="font-bold text-amber-400 flex items-center gap-1.5">
                                <span>📍 Serviceable Pincodes Only</span>
                            </p>
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                We deliver exclusively to: <strong className="text-white font-mono">843323, 843314, 843320, 843313, 843328</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <Link
                        to="/checkout"
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Proceed to Checkout
                        <FaArrowRight className="text-xs" />
                    </Link>

                    <p className="text-center text-[10px] text-gray-500 px-4">
                        By placing your order, you agree to our{' '}
                        <span className="text-amber-500/80 cursor-pointer">Terms of Service</span> and{' '}
                        <span className="text-amber-500/80 cursor-pointer">Privacy Policy</span>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
};

export default Cart;