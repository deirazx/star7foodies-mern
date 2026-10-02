import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
    FaShoppingBag,
    FaArrowRight,
    FaPlus,
    FaMinus,
    FaTrash,
    FaChevronUp,
    FaChevronDown,
    FaTimes,
    FaUtensils,
    FaMotorcycle
} from 'react-icons/fa';
import { addToCart, removeFromCart, clearCart } from '../Redux/Slices/cart.js';

const FloatingCart = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isExpanded, setIsExpanded] = useState(false);

    const cartItems = useSelector((state) => state?.cart?.items || []);
    const totalCartAmount = useSelector((state) => state?.cart?.totalCartAmount || 0);
    const totalCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    // Routes where the floating cart should NOT be displayed
    const hiddenRoutes = [
        '/about',
        '/contact',
        '/admin',
        '/cart',
        '/checkout',
        '/login',
        '/register'
    ];

    const isHidden = hiddenRoutes.some(route =>
        location.pathname === route || location.pathname.startsWith('/admin')
    );

    if (isHidden || cartItems.length === 0) {
        return null;
    }

    const DELIVERY_FEE = totalCartAmount >= 299 ? 0 : 25;
    const PLATFORM_FEE = 0;
    const grandTotal = totalCartAmount + DELIVERY_FEE + PLATFORM_FEE;

    return (
        <>
            {/* ── EXPANDED MINI CART DRAWER (Blinkit / Zepto Style) ── */}
            {isExpanded && (
                <div className="fixed inset-0 z-[1000] flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
                    {/* Backdrop tap to close */}
                    <div className="flex-1" onClick={() => setIsExpanded(false)} />

                    {/* Drawer Content */}
                    <div className="bg-[#121215] border-t border-white/10 rounded-t-3xl max-w-xl w-full mx-auto p-5 space-y-4 shadow-2xl max-h-[80vh] flex flex-col z-10 animate-slideUp">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                    <FaShoppingBag className="text-sm" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-white text-sm">
                                        Your Cart ({totalCount} {totalCount === 1 ? 'item' : 'items'})
                                    </h3>
                                    <p className="text-[10px] text-gray-400">Quick adjust quantities or proceed</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => dispatch(clearCart())}
                                    className="text-[11px] text-gray-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                    <FaTrash className="text-[10px]" />
                                    <span>Clear</span>
                                </button>
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                                >
                                    <FaTimes className="text-xs" />
                                </button>
                            </div>
                        </div>

                        {/* Cart Items List with Quantity Controllers */}
                        <div className="overflow-y-auto space-y-3 pr-1 divide-y divide-white/5 flex-1">
                            {cartItems.map((item, idx) => {
                                const itemId = item._id || item.id;
                                const cartKey = item.cartItemId || `${itemId}-${item.portion || item.selectedPortion || 'std'}`;
                                const img = item.image_url || item.imageUrl || item.image;
                                const qty = item.quantity || 1;
                                const linePrice = item.price * qty;
                                const portionName = typeof item.portion === 'string' ? item.portion : 'Standard';
                                const isHalf = /half/i.test(portionName);
                                const isFull = /full/i.test(portionName);

                                return (
                                    <div key={cartKey} className="flex items-center justify-between gap-3 pt-3 first:pt-0">
                                        {/* Image & Title */}
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            {img ? (
                                                <img
                                                    src={img}
                                                    alt={item.name}
                                                    className="w-11 h-11 rounded-xl object-cover bg-neutral-900 border border-white/10 shrink-0"
                                                />
                                            ) : (
                                                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                                                    <FaUtensils className="text-xs" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-white truncate leading-snug">
                                                    {item.name}
                                                </h4>
                                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                                    <span className="text-[10px] text-gray-400">₹{item.price} •</span>
                                                    {isHalf ? (
                                                        <span className="text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                                                            Half Plate
                                                        </span>
                                                    ) : isFull ? (
                                                        <span className="text-[9px] font-black bg-orange-500/20 text-orange-300 border border-orange-500/30 px-1.5 py-0.2 rounded">
                                                            Full Plate
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-gray-400">{portionName}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quantity Stepper & Price */}
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-xs font-black text-white min-w-[45px] text-right">
                                                ₹{linePrice}
                                            </span>

                                            {/* Blinkit Style Stepper */}
                                            <div className="flex items-center bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black rounded-xl overflow-hidden shadow-sm">
                                                <button
                                                    onClick={() => dispatch(removeFromCart(cartKey))}
                                                    className="px-2.5 py-1.5 hover:bg-black/15 transition-colors cursor-pointer"
                                                    title={`Decrease ${portionName} quantity`}
                                                >
                                                    <FaMinus className="text-[9px]" />
                                                </button>
                                                <span className="px-2 text-xs select-none min-w-[20px] text-center font-black">
                                                    {qty}
                                                </span>
                                                <button
                                                    onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
                                                    className="px-2.5 py-1.5 hover:bg-black/15 transition-colors cursor-pointer"
                                                    title={`Increase ${portionName} quantity`}
                                                >
                                                    <FaPlus className="text-[9px]" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Free Delivery Incentive in Drawer */}
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 space-y-1.5 shrink-0">
                            <div className="flex items-center justify-between text-xs">
                                {totalCartAmount < 299 ? (
                                    <span className="text-amber-300 font-bold">
                                        Add ₹{299 - totalCartAmount} more for FREE Delivery 🛵
                                    </span>
                                ) : (
                                    <span className="text-emerald-400 font-bold">
                                        🎉 FREE Delivery Unlocked!
                                    </span>
                                )}
                                <span className="text-[10px] text-gray-400">Order ₹299+</span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(100, Math.round((totalCartAmount / 299) * 100))}%` }}
                                />
                            </div>
                        </div>

                        {/* Bill Breakdown Summary */}
                        <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs text-gray-400 shrink-0">
                            <div className="flex justify-between">
                                <span>Items Subtotal</span>
                                <span className="font-semibold text-white">₹{totalCartAmount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Delivery Fee</span>
                                {DELIVERY_FEE === 0 ? (
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                        FREE DELIVERY
                                    </span>
                                ) : (
                                    <span className="font-semibold text-white">₹{DELIVERY_FEE}</span>
                                )}
                            </div>
                            <div className="flex justify-between pt-1 border-t border-white/5 font-black text-white text-sm">
                                <span>Grand Total</span>
                                <span className="text-amber-400">₹{grandTotal}</span>
                            </div>
                        </div>

                        {/* Checkout & View Cart Action Buttons */}
                        <div className="flex items-center gap-2 pt-1 shrink-0">
                            <Link
                                to="/cart"
                                onClick={() => setIsExpanded(false)}
                                className="py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all text-center"
                            >
                                Full Cart
                            </Link>

                            <button
                                onClick={() => {
                                    setIsExpanded(false);
                                    navigate('/checkout');
                                }}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                                <span>Proceed to Checkout</span>
                                <FaArrowRight className="text-[10px]" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── COMPACT BOTTOM FLOATING BAR (Always visible when cart has items) ── */}
            <div className="fixed bottom-18 md:bottom-6 left-0 right-0 z-[980] px-4 pointer-events-none">
                <div className="max-w-xl mx-auto pointer-events-auto">
                    <div
                        onClick={() => setIsExpanded(true)}
                        className="bg-gradient-to-r from-[#18181c] via-[#1c1c22] to-[#18181c] border-2 border-amber-500/40 hover:border-amber-400 text-white p-2.5 sm:p-3 rounded-2xl shadow-2xl shadow-black/80 flex items-center justify-between gap-3 cursor-pointer group transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                        {/* Left: Cart Info & Quantity Preview */}
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black font-black text-xs shrink-0 shadow-md">
                                <FaShoppingBag className="text-sm" />
                            </div>

                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-white tracking-wide">
                                        {totalCount} {totalCount === 1 ? 'ITEM' : 'ITEMS'}
                                    </span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-sm font-black text-amber-400">
                                        ₹{totalCartAmount}
                                    </span>
                                </div>
                                <p className="text-[10px] truncate flex items-center gap-1">
                                    {totalCartAmount < 299 ? (
                                        <span className="text-amber-300 font-semibold truncate">
                                            Add ₹{299 - totalCartAmount} for FREE Delivery 🛵
                                        </span>
                                    ) : (
                                        <span className="text-emerald-400 font-bold">
                                            🎉 FREE Delivery Unlocked!
                                        </span>
                                    )}
                                    <FaChevronUp className="text-[8px] text-amber-400 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                                </p>
                            </div>
                        </div>

                        {/* Right: Checkout CTA Button */}
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/checkout');
                                }}
                                className="py-2 px-3.5 sm:px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                                <span>Checkout</span>
                                <FaArrowRight className="text-[9px]" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slideUp {
                    animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default FloatingCart;
