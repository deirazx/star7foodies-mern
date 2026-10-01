import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../Redux/Slices/cart.js';
import { Link } from 'react-router-dom';
import {
    FaShoppingBag,
    FaTrash,
    FaArrowLeft,
    FaArrowRight,
    FaStar,
    FaTag,
    FaMotorcycle,
    FaShieldAlt,
    FaMinus,
    FaPlus,
    FaRegDotCircle,
    FaCheckCircle,
    FaPercent,
} from 'react-icons/fa';

const PROMO_CODES = [
    { code: 'STAR7WELCOME', label: '50% OFF up to ₹100 on 1st order', discount: 0.5 },
    { code: 'FREEDEL', label: 'Free Delivery on this order', discount: 0 },
];

const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state?.cart?.items || []);
    const totalCartAmount = useSelector((state) => state?.cart?.totalCartAmount || 0);

    const [promoInput, setPromoInput] = React.useState('');
    const [appliedPromo, setAppliedPromo] = React.useState(null);
    const [promoError, setPromoError] = React.useState('');
    const [promoSuccess, setPromoSuccess] = React.useState('');

    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const DELIVERY_FEE = totalCartAmount >= 199 ? 0 : 39;
    const PLATFORM_FEE = 3;
    const promoDiscount = appliedPromo
        ? appliedPromo.discount > 0
            ? Math.min(Math.round(totalCartAmount * appliedPromo.discount), 100)
            : DELIVERY_FEE
        : 0;
    const grandTotal = totalCartAmount + DELIVERY_FEE + PLATFORM_FEE - promoDiscount;

    const handleApplyPromo = () => {
        const found = PROMO_CODES.find((p) => p.code === promoInput.trim().toUpperCase());
        if (found) {
            setAppliedPromo(found);
            setPromoError('');
            setPromoSuccess(`"${found.code}" applied successfully!`);
        } else {
            setAppliedPromo(null);
            setPromoSuccess('');
            setPromoError('Invalid promo code. Try STAR7WELCOME or FREEDEL.');
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoInput('');
        setPromoSuccess('');
        setPromoError('');
    };

    /* ── Empty Cart ─────────────────────────────────────────── */
    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 pt-24 md:pt-28 text-center">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-24 animate-fadeIn">

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
                        const imageUrl = item.imageUrl || item.image;
                        const isVeg = item.isVeg !== undefined
                            ? item.isVeg
                            : !(/chicken|beef|meat|mutton|pork|fish|egg/i.test(item.name));
                        const rating = item.rating || (4.0 + (item.name?.length % 10) / 10).toFixed(1);

                        return (
                            <div
                                key={itemId}
                                className="group flex gap-4 bg-[#111113] border border-white/5 hover:border-amber-500/20 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-black/30"
                            >
                                {/* Image */}
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0">
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
                                            <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-amber-400 transition-colors line-clamp-1">
                                                {item.name}
                                            </h3>
                                            <button
                                                onClick={() => {
                                                    for (let i = 0; i < item.quantity; i++) {
                                                        dispatch(removeFromCart(itemId));
                                                    }
                                                }}
                                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0 cursor-pointer"
                                            >
                                                <FaTrash className="text-xs" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2 mt-1">
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

                                        {(item.desc || item.description) && (
                                            <p className="text-xs text-gray-500 mt-1.5 line-clamp-1">
                                                {item.desc || item.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Price + Qty */}
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                        <div>
                                            <span className="text-base font-black text-white">
                                                ₹{item.price * item.quantity}
                                            </span>
                                            {item.quantity > 1 && (
                                                <span className="text-[10px] text-gray-500 ml-1.5">
                                                    ₹{item.price} × {item.quantity}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center bg-amber-500 text-white rounded-xl overflow-hidden shadow-md">
                                            <button
                                                onClick={() => dispatch(removeFromCart(itemId))}
                                                className="px-3 py-2 hover:bg-amber-600 transition-all font-bold cursor-pointer"
                                            >
                                                <FaMinus className="text-[9px]" />
                                            </button>
                                            <span className="px-3 font-black text-sm min-w-[28px] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => dispatch(addToCart(item))}
                                                className="px-3 py-2 hover:bg-amber-600 transition-all font-bold cursor-pointer"
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
                            { icon: FaMotorcycle, label: 'Fast Delivery', sub: '30 mins avg' },
                            { icon: FaShieldAlt, label: 'Safe & Hygienic', sub: 'Quality assured' },
                            { icon: FaPercent, label: 'Best Prices', sub: 'No hidden charges' },
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

                {/* ── RIGHT: Order Summary ── */}
                <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-24">

                    {/* Promo Code */}
                    <div className="bg-[#111113] border border-white/5 rounded-2xl p-5">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                            <FaTag className="text-amber-500" />
                            Apply Promo Code
                        </h4>

                        {appliedPromo ? (
                            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <FaCheckCircle className="text-emerald-500 text-sm" />
                                    <div>
                                        <p className="text-xs font-bold text-emerald-400">{appliedPromo.code}</p>
                                        <p className="text-[10px] text-emerald-400/70">{appliedPromo.label}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleRemovePromo}
                                    className="text-[10px] text-red-400 hover:text-red-300 font-bold cursor-pointer underline"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={promoInput}
                                        onChange={(e) => setPromoInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                                        placeholder="Enter promo code..."
                                        className="flex-1 bg-white/5 border border-white/10 focus:border-amber-500/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-all"
                                    />
                                    <button
                                        onClick={handleApplyPromo}
                                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {promoError && <p className="text-red-400 text-[11px] mt-2 font-medium">{promoError}</p>}
                                {promoSuccess && <p className="text-emerald-400 text-[11px] mt-2 font-medium">{promoSuccess}</p>}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {PROMO_CODES.map((p) => (
                                        <button
                                            key={p.code}
                                            onClick={() => setPromoInput(p.code)}
                                            className="text-[10px] px-2.5 py-1 border border-dashed border-amber-500/30 text-amber-400/70 hover:text-amber-400 hover:border-amber-500/60 rounded-full transition-all cursor-pointer font-medium"
                                        >
                                            {p.code}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Bill Details */}
                    <div className="bg-[#111113] border border-white/5 rounded-2xl p-5">
                        <h4 className="text-sm font-bold text-white mb-4">Bill Details</h4>
                        <div className="space-y-3 text-xs text-gray-400">
                            <div className="flex justify-between">
                                <span>Item Total</span>
                                <span className="text-white font-semibold">₹{totalCartAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center gap-1.5">
                                    Delivery Fee
                                    {DELIVERY_FEE === 0 && (
                                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-bold">
                                            FREE
                                        </span>
                                    )}
                                </span>
                                <span className={`font-semibold ${DELIVERY_FEE === 0 ? 'line-through text-gray-500' : 'text-white'}`}>
                                    ₹{DELIVERY_FEE === 0 ? 39 : DELIVERY_FEE}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Platform Fee</span>
                                <span className="text-white font-semibold">₹{PLATFORM_FEE}</span>
                            </div>
                            {promoDiscount > 0 && (
                                <div className="flex justify-between text-emerald-400">
                                    <span className="font-semibold">Promo Discount</span>
                                    <span className="font-bold">- ₹{promoDiscount}</span>
                                </div>
                            )}
                            <div className="border-t border-white/8 pt-3 flex justify-between items-center">
                                <span className="text-white font-black text-sm">To Pay</span>
                                <span className="text-lg font-black text-white">₹{grandTotal}</span>
                            </div>
                        </div>

                        {totalCartAmount < 199 && (
                            <div className="mt-4 px-3 py-2.5 bg-amber-500/8 border border-amber-500/20 rounded-xl text-[11px] text-amber-400 font-medium">
                                🎉 Add items worth{' '}
                                <span className="font-black">₹{199 - totalCartAmount}</span> more for{' '}
                                <span className="font-black">FREE delivery!</span>
                            </div>
                        )}
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