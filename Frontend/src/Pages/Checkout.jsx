import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clearCart } from '../Redux/Slices/cart.js';
import { setUser } from '../Redux/Slices/auth.js';
import { currentUser, createOrderApi, googleLoginUser } from '../Api/axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Utils/firebase';
import {
    MapPin,
    Phone,
    User,
    Mail,
    CreditCard,
    Banknote,
    Truck,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    ShoppingBag,
    Clock,
    ArrowRight,
    Lock,
    Tag,
    Copy,
    Check,
    Utensils
} from 'lucide-react';

const PROMO_CODES = [
    { code: 'STAR7WELCOME', label: '50% OFF up to ₹100 on 1st order', discount: 0.5 },
    { code: 'FREEDEL', label: 'Free Delivery on this order', discount: 0 },
];

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Redux State
    const user = useSelector((state) => state?.auth?.user);
    const cartItems = useSelector((state) => state?.cart?.items || []);
    const totalCartAmount = useSelector((state) => state?.cart?.totalCartAmount || 0);

    // Local Component State
    const [authChecking, setAuthChecking] = useState(!user);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const [placedOrder, setPlacedOrder] = useState(null);
    const [copiedOrderId, setCopiedOrderId] = useState(false);

    // Promo Code State
    const [promoInput, setPromoInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState('');

    // Delivery Form State
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        street: '',
        city: 'Muzaffarpur',
        state: 'Bihar',
        postalCode: '',
        deliveryNotes: '',
        paymentMethod: 'COD' // 'COD' | 'UPI' | 'CARD'
    });

    const [formErrors, setFormErrors] = useState({});

    // Keep form in sync when user loads
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: prev.fullName || user.name || '',
                email: prev.email || user.email || '',
                phone: prev.phone || user.phone || ''
            }));
            setAuthChecking(false);
        } else {
            // Attempt to check if backend session cookie exists
            const verifyUser = async () => {
                try {
                    const loggedInUser = await currentUser();
                    if (loggedInUser) {
                        dispatch(setUser(loggedInUser));
                    }
                } catch (e) {
                    // user not logged in
                } finally {
                    setAuthChecking(false);
                }
            };
            verifyUser();
        }
    }, [user, dispatch]);

    // Financial Calculations
    const totalItemsCount = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }, [cartItems]);

    const DELIVERY_FEE = totalCartAmount >= 199 ? 0 : 39;
    const PLATFORM_FEE = 3;
    const promoDiscount = appliedPromo
        ? appliedPromo.discount > 0
            ? Math.min(Math.round(totalCartAmount * appliedPromo.discount), 100)
            : DELIVERY_FEE
        : 0;
    const grandTotal = Math.max(0, totalCartAmount + DELIVERY_FEE + PLATFORM_FEE - promoDiscount);

    // Form Change Handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Promo Code Handlers
    const handleApplyPromo = () => {
        const found = PROMO_CODES.find((p) => p.code === promoInput.trim().toUpperCase());
        if (found) {
            setAppliedPromo(found);
            setPromoError('');
        } else {
            setAppliedPromo(null);
            setPromoError('Invalid promo code. Try STAR7WELCOME or FREEDEL.');
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoInput('');
        setPromoError('');
    };

    // Client-side Validation
    const validateForm = () => {
        const errors = {};
        if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
        if (!formData.phone.trim()) {
            errors.phone = 'Mobile number is required';
        } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
            errors.phone = 'Please enter a valid 10-digit Indian mobile number';
        }
        if (!formData.street.trim()) errors.street = 'Street address / Flat / Landmark is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.postalCode.trim()) {
            errors.postalCode = 'PIN code is required';
        } else if (!/^\d{6}$/.test(formData.postalCode.trim())) {
            errors.postalCode = 'PIN code must be exactly 6 digits';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // One-Click Google Login inside Checkout
    const handleGoogleQuickLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const name = result.user.displayName;
            const email = result.user.email;
            const response = await googleLoginUser({ name, email });
            const loggedInUser = response.user ? response.user : response;
            dispatch(setUser(loggedInUser));
        } catch (err) {
            console.error("Google login failed inside checkout:", err);
            setOrderError("Google login failed. Please try again or use email login.");
        }
    };

    // Place Order Handler
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setOrderError(null);

        if (!validateForm()) {
            window.scrollTo({ top: 100, behavior: 'smooth' });
            return;
        }

        if (cartItems.length === 0) {
            setOrderError("Your cart is empty. Please add items before checking out.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Format order payload matching Backend order.model.js
            const orderPayload = {
                items: cartItems.map(item => {
                    let formattedPortion = "Single Serving";
                    if (typeof item.portion === 'string' && item.portion.trim()) {
                        formattedPortion = item.portion.trim();
                    } else if (typeof item.portion === 'object' && item.portion !== null) {
                        if (item.portion.half && item.portion.full) {
                            formattedPortion = `Half (₹${item.portion.half}) / Full (₹${item.portion.full})`;
                        } else if (item.portion.half) {
                            formattedPortion = `Half (₹${item.portion.half})`;
                        } else if (item.portion.full) {
                            formattedPortion = `Full (₹${item.portion.full})`;
                        } else {
                            formattedPortion = "Standard Portion";
                        }
                    }

                    return {
                        productId: item._id || item.id,
                        name: item.name || "Food Item",
                        qnty: item.quantity || 1,
                        price: Number(item.price),
                        portion: formattedPortion
                    };
                }),
                totalCartPrice: grandTotal,
                address: {
                    name: formData.fullName.trim(),
                    street: formData.street.trim() + (formData.deliveryNotes ? ` (Note: ${formData.deliveryNotes.trim()})` : ''),
                    city: formData.city.trim(),
                    state: formData.state.trim() || 'Bihar',
                    postalCode: formData.postalCode.trim(),
                    country: 'India',
                    phone: formData.phone.trim()
                },
                paymentMethod: formData.paymentMethod
            };

            const response = await createOrderApi(orderPayload);
            const created = response.order || response;

            // Success: Clear cart & show confirmation screen
            dispatch(clearCart());
            setPlacedOrder(created);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error("Order placement failed:", err);
            setOrderError(err.message || "Failed to place your order. Please check your internet connection or login status.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyOrderId = (id) => {
        if (!id) return;
        navigator.clipboard.writeText(id);
        setCopiedOrderId(true);
        setTimeout(() => setCopiedOrderId(false), 2000);
    };

    // ==========================================
    // 1. ORDER CONFIRMATION SCREEN (POST-CHECKOUT)
    // ==========================================
    if (placedOrder) {
        return (
            <div className="min-h-[85vh] bg-[#0a0a0b] text-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="bg-[#121214] border border-white/10 rounded-3xl p-6 sm:p-10 max-w-xl w-full shadow-2xl text-center space-y-6 animate-fadeIn relative overflow-hidden">
                    {/* Decorative Background Glow */}
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Animated Check Icon */}
                    <div className="relative mx-auto w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 stroke-[2.5]" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping opacity-75" />
                    </div>

                    <div className="space-y-1.5">
                        <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                            Order Confirmed
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Thank You for Your Order!
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
                            The kitchen has received your order and our chefs have started preparing your meal hot and fresh.
                        </p>
                    </div>

                    {/* Order Reference Box */}
                    <div className="bg-[#18181b] border border-white/10 rounded-2xl p-4 text-left space-y-3">
                        <div className="flex items-center justify-between text-xs pb-3 border-b border-white/5">
                            <span className="text-gray-400">Order Reference</span>
                            <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-amber-400">
                                    #{placedOrder._id?.slice(-8).toUpperCase() || 'STAR7'}
                                </span>
                                <button
                                    onClick={() => handleCopyOrderId(placedOrder._id)}
                                    className="p-1 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
                                    title="Copy order ID"
                                >
                                    {copiedOrderId ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span className="text-gray-500 block text-[11px]">Estimated Time</span>
                                <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                                    <Clock className="w-3.5 h-3.5 text-amber-400" /> 25 - 30 mins
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-[11px]">Payment Mode</span>
                                <span className="font-semibold text-emerald-400 mt-0.5 block">
                                    {formData.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Paid'}
                                </span>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 text-xs text-gray-300">
                            <span className="text-gray-500 block text-[11px]">Delivery To</span>
                            <p className="truncate font-medium mt-0.5">{formData.street}, {formData.city}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Link
                            to="/orders"
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>Track in My Orders</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/menu"
                            className="flex-1 py-3 px-4 bg-[#18181b] hover:bg-[#222226] border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>Order More Food</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // 2. EMPTY CART PROTECTION
    // ==========================================
    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] bg-[#0a0a0b] flex flex-col items-center justify-center px-4 text-center">
                <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-500">
                    <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
                    Your Cart is Empty
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm mb-6 max-w-sm">
                    You have no items in your cart to checkout. Browse our chef-curated menu and pick something appetizing!
                </p>
                <Link
                    to="/menu"
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Explore Our Menu</span>
                </Link>
            </div>
        );
    }

    // ==========================================
    // 3. AUTHENTICATION PROTECTION PROMPT
    // ==========================================
    if (!authChecking && !user) {
        return (
            <div className="min-h-[85vh] bg-[#0a0a0b] text-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="bg-[#121214] border border-white/10 rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl text-center space-y-6 relative overflow-hidden">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                        <Lock className="w-8 h-8" />
                    </div>

                    <div className="space-y-1.5">
                        <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">
                            Protected Checkout
                        </span>
                        <h2 className="text-2xl font-black text-white tracking-tight">
                            Sign In to Place Your Order
                        </h2>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Sign in to save your delivery address, apply coupons, and track your food delivery in real-time. Your cart items are saved.
                        </p>
                    </div>

                    {/* Cart summary preview */}
                    <div className="bg-[#18181b] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-gray-300">
                            <ShoppingBag className="w-4 h-4 text-amber-400" />
                            <span>{totalItemsCount} item{totalItemsCount > 1 ? 's' : ''} in cart</span>
                        </div>
                        <span className="font-bold text-white text-sm">₹{grandTotal}</span>
                    </div>

                    {/* Login Options */}
                    <div className="space-y-3 pt-2">
                        {/* Quick Google Sign In */}
                        <button
                            onClick={handleGoogleQuickLogin}
                            className="w-full py-3 px-4 bg-white hover:bg-gray-100 text-black font-semibold text-xs rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            <span>Continue with Google</span>
                        </button>

                        {/* Email Login Button */}
                        <Link
                            to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                            <span>Sign In with Email</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        {/* Create Account Link */}
                        <p className="text-[11px] text-gray-500 pt-1">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-amber-400 hover:underline font-semibold">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // 4. MAIN CHECKOUT PAGE CONTENT
    // ==========================================
    return (
        <div className="min-h-screen bg-[#0a0a0b] text-gray-100 py-8 px-4 sm:px-6 lg:px-8 pb-24">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Top Breadcrumb & Return to Cart */}
                <div className="flex items-center justify-between">
                    <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Return to Cart</span>
                    </Link>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="text-amber-400 font-semibold">1. Cart</span>
                        <span>›</span>
                        <span className="text-white font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md">
                            2. Checkout
                        </span>
                        <span>›</span>
                        <span>3. Order Placed</span>
                    </div>
                </div>

                {/* Page Title */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Complete Your Order
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        Fast chef preparation • Free contactless doorstep delivery
                    </p>
                </div>

                {/* Global Error Banner */}
                {orderError && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl flex items-center gap-3 text-xs">
                        <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                        <span>{orderError}</span>
                    </div>
                )}

                {/* Two-Column Grid: Form (Left) & Order Summary (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT COLUMN: DELIVERY ADDRESS & PAYMENT (7 cols) */}
                    <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
                        {/* Section 1: Contact Information */}
                        <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-white/5">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Customer Contact</h3>
                                        <p className="text-[11px] text-gray-400">Recipient details for delivery updates</p>
                                    </div>
                                </div>
                                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Logged In
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Rahul Sharma"
                                            className={`w-full bg-[#18181b] border rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 ${formErrors.fullName ? 'border-rose-500' : 'border-white/10'}`}
                                        />
                                    </div>
                                    {formErrors.fullName && (
                                        <p className="text-[10px] text-rose-400 mt-1">{formErrors.fullName}</p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                        Mobile Number (10 digits) *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold">+91</span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            maxLength={10}
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="9876543210"
                                            className={`w-full bg-[#18181b] border rounded-xl pl-12 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 ${formErrors.phone ? 'border-rose-500' : 'border-white/10'}`}
                                        />
                                    </div>
                                    {formErrors.phone && (
                                        <p className="text-[10px] text-rose-400 mt-1">{formErrors.phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                    Email Address (Optional receipt)
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="rahul@example.com"
                                        className="w-full bg-[#18181b] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Delivery Address */}
                        <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Delivery Address</h3>
                                    <p className="text-[11px] text-gray-400">Where should we drop off your hot meal?</p>
                                </div>
                            </div>

                            {/* Street / Building Address */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                    Street Address / Flat / Building / Landmark *
                                </label>
                                <textarea
                                    name="street"
                                    rows={2}
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Flat 402, Royal Palms, Behind City Mall"
                                    className={`w-full bg-[#18181b] border rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none ${formErrors.street ? 'border-rose-500' : 'border-white/10'}`}
                                />
                                {formErrors.street && (
                                    <p className="text-[10px] text-rose-400 mt-1">{formErrors.street}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* City */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className={`w-full bg-[#18181b] border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 ${formErrors.city ? 'border-rose-500' : 'border-white/10'}`}
                                    />
                                    {formErrors.city && (
                                        <p className="text-[10px] text-rose-400 mt-1">{formErrors.city}</p>
                                    )}
                                </div>

                                {/* State */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>

                                {/* PIN Code */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                        PIN Code (6 digits) *
                                    </label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        maxLength={6}
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        placeholder="842001"
                                        className={`w-full bg-[#18181b] border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 ${formErrors.postalCode ? 'border-rose-500' : 'border-white/10'}`}
                                    />
                                    {formErrors.postalCode && (
                                        <p className="text-[10px] text-rose-400 mt-1">{formErrors.postalCode}</p>
                                    )}
                                </div>
                            </div>

                            {/* Delivery Instructions (Optional) */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                    Delivery Note (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="deliveryNotes"
                                    value={formData.deliveryNotes}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Leave with security guard, don't ring bell"
                                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                                />
                            </div>
                        </div>

                        {/* Section 3: Payment Method Selection */}
                        <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                    <Banknote className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Payment Method</h3>
                                    <p className="text-[11px] text-gray-400">Choose how you'd like to pay for your food</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {/* Cash on Delivery */}
                                <label
                                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${formData.paymentMethod === 'COD'
                                        ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-md'
                                        : 'bg-[#18181b] border-white/5 text-gray-300 hover:border-white/10'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={formData.paymentMethod === 'COD'}
                                        onChange={handleInputChange}
                                        className="mt-0.5 accent-amber-500 cursor-pointer"
                                    />
                                    <div>
                                        <span className="font-bold text-xs flex items-center gap-1.5 text-white">
                                            <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                                            Cash on Delivery (COD)
                                        </span>
                                        <p className="text-[11px] text-gray-400 mt-1">
                                            Pay with cash or UPI directly when food arrives at your door.
                                        </p>
                                    </div>
                                </label>

                                {/* Online / UPI Payment */}
                                <label
                                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${formData.paymentMethod === 'UPI'
                                        ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-md'
                                        : 'bg-[#18181b] border-white/5 text-gray-300 hover:border-white/10'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="UPI"
                                        checked={formData.paymentMethod === 'UPI'}
                                        onChange={handleInputChange}
                                        className="mt-0.5 accent-amber-500 cursor-pointer"
                                    />
                                    <div>
                                        <span className="font-bold text-xs flex items-center gap-1.5 text-white">
                                            <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                                            Online UPI / Card
                                        </span>
                                        <p className="text-[11px] text-gray-400 mt-1">
                                            Google Pay, PhonePe, Paytm, or Credit/Debit Cards.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    <span>Securing & Placing Your Order...</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    <span>Place Order • ₹{grandTotal}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-[10px] text-gray-500">
                            By placing this order, you accept Star7Foodies' standard terms of dining & contactless delivery policy.
                        </p>
                    </form>

                    {/* RIGHT COLUMN: STICKY ORDER SUMMARY (5 cols) */}
                    <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
                        {/* Order Summary Card */}
                        <div className="bg-[#121214] border border-white/5 rounded-2xl p-5 shadow-sm space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-white/5">
                                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                    <Utensils className="w-4 h-4 text-amber-400" />
                                    Your Order ({totalItemsCount})
                                </h3>
                                <Link to="/cart" className="text-xs text-amber-400 hover:underline font-semibold">
                                    Edit Cart
                                </Link>
                            </div>

                            {/* Itemized Cart List */}
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                {cartItems.map((item, idx) => {
                                    const img = item.imageUrl || item.image_url || item.image;
                                    const qty = item.quantity || 1;
                                    const lineTotal = item.price * qty;

                                    return (
                                        <div key={item._id || idx} className="flex items-center justify-between gap-3 text-xs">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                {img ? (
                                                    <img
                                                        src={img}
                                                        alt={item.name}
                                                        className="w-10 h-10 rounded-lg object-cover bg-neutral-900 border border-white/10 shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-amber-400">
                                                        🍽️
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-white truncate">{item.name}</p>
                                                    <p className="text-[10px] text-gray-400">
                                                        ₹{item.price} × {qty}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-white shrink-0">
                                                ₹{lineTotal}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Promo Code Box */}
                            <div className="pt-3 border-t border-white/5">
                                {appliedPromo ? (
                                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl text-xs text-emerald-300">
                                        <div className="flex items-center gap-1.5">
                                            <Tag className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="font-bold">{appliedPromo.code}</span>
                                            <span>(Saved ₹{promoDiscount})</span>
                                        </div>
                                        <button
                                            onClick={handleRemovePromo}
                                            className="text-xs text-gray-400 hover:text-white cursor-pointer font-bold ml-2"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={promoInput}
                                                onChange={(e) => setPromoInput(e.target.value)}
                                                placeholder="Enter coupon code"
                                                className="flex-1 bg-[#18181b] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 uppercase focus:outline-none focus:border-amber-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleApplyPromo}
                                                className="px-3.5 py-1.5 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500 text-amber-400 hover:text-black font-bold text-xs rounded-xl transition-all cursor-pointer"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {promoError && (
                                            <p className="text-[10px] text-rose-400">{promoError}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Bill Calculation */}
                            <div className="pt-3 border-t border-white/5 space-y-2 text-xs text-gray-400">
                                <div className="flex justify-between">
                                    <span>Item Total</span>
                                    <span className="font-medium text-white">₹{totalCartAmount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Delivery Fee</span>
                                    {DELIVERY_FEE === 0 ? (
                                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                            FREE
                                        </span>
                                    ) : (
                                        <span className="font-medium text-white">₹{DELIVERY_FEE}</span>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span>Platform Fee</span>
                                    <span className="font-medium text-white">₹{PLATFORM_FEE}</span>
                                </div>
                                {promoDiscount > 0 && (
                                    <div className="flex justify-between text-emerald-400 font-semibold">
                                        <span>Coupon Discount</span>
                                        <span>- ₹{promoDiscount}</span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-white/10 flex justify-between items-center text-sm font-black text-white">
                                    <span>Total To Pay</span>
                                    <span className="text-lg font-black text-amber-400">₹{grandTotal}</span>
                                </div>
                            </div>
                        </div>

                        {/* Safety & Quality Pledge */}
                        <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 flex items-center gap-3 text-xs text-gray-400">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-white text-xs">100% Star7Foodies Safety Guarantee</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">Tamper-proof packaging • Sanitized food preparation</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
