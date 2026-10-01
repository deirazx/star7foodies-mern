import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../Redux/Slices/cart.js';
import { getProductByIdApi, allFoods } from '../Api/axios';
import PortionModal from '../Components/PortionModal';
import {
    Utensils,
    Star,
    Clock,
    ShieldCheck,
    Truck,
    ArrowLeft,
    Plus,
    Minus,
    ShoppingBag,
    Check,
    Heart,
    Flame,
    Share2,
    Sparkles,
    AlertCircle,
    ChevronRight
} from 'lucide-react';
import { FaRegDotCircle } from 'react-icons/fa';

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [dish, setDish] = useState(null);
    const [allDishes, setAllDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Selected Portion & Quantity
    const [selectedPortion, setSelectedPortion] = useState('full'); // 'half' | 'full'
    const [quantity, setQuantity] = useState(1);
    const [addedSuccess, setAddedSuccess] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [copiedShare, setCopiedShare] = useState(false);

    // Portion modal for suggested items
    const [portionModalDish, setPortionModalDish] = useState(null);

    const cartItems = useSelector((state) => state?.cart?.items || []);

    // Fetch Dish by ID and also get all foods for suggestions
    useEffect(() => {
        let isMounted = true;
        const fetchDishData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Scroll to top when dish ID changes
                window.scrollTo({ top: 0, behavior: 'smooth' });

                const res = await getProductByIdApi(id);
                if (isMounted) {
                    const fetched = res.product || res.item || res;
                    setDish(fetched);

                    // Initialize portion selection
                    if (fetched?.portion?.full && fetched?.portion?.half) {
                        setSelectedPortion('full');
                    } else if (fetched?.portion?.half) {
                        setSelectedPortion('half');
                    } else {
                        setSelectedPortion('full');
                    }
                    setQuantity(1);
                }
            } catch (err) {
                console.error("Failed to load dish details:", err);
                if (isMounted) {
                    setError(err.message || "Failed to retrieve dish information.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            fetchDishData();
        }

        return () => {
            isMounted = false;
        };
    }, [id]);

    // Fetch all foods for bottom recommendations
    useEffect(() => {
        let isMounted = true;
        const fetchRecommendations = async () => {
            try {
                const res = await allFoods();
                if (isMounted) {
                    const list = res.items || res.products || (Array.isArray(res) ? res : []);
                    setAllDishes(list);
                }
            } catch (err) {
                console.error("Failed to load recommendations:", err);
            }
        };
        fetchRecommendations();
        return () => {
            isMounted = false;
        };
    }, []);

    // Filter recommended dishes: exclude current dish
    const recommendedDishes = useMemo(() => {
        if (!dish || !allDishes.length) return [];
        const currentId = dish._id || dish.id;

        // Same category items first, then others
        const sameCategory = allDishes.filter(d => (d._id || d.id) !== currentId && d.category === dish.category);
        const others = allDishes.filter(d => (d._id || d.id) !== currentId && d.category !== dish.category);

        return [...sameCategory, ...others].slice(0, 6);
    }, [dish, allDishes]);

    // Calculate current price based on portion
    const hasHalf = Boolean(dish?.portion?.half && Number(dish.portion.half) > 0);
    const hasFull = Boolean(dish?.portion?.full && Number(dish.portion.full) > 0);
    const hasPortions = hasHalf || hasFull;

    const currentPrice = useMemo(() => {
        if (!dish) return 0;
        if (hasPortions) {
            if (selectedPortion === 'half' && hasHalf) {
                return Number(dish.portion.half);
            }
            if (selectedPortion === 'full' && hasFull) {
                return Number(dish.portion.full);
            }
        }
        return Number(dish.price || 0);
    }, [dish, selectedPortion, hasPortions, hasHalf, hasFull]);

    const currentPortionName = hasPortions
        ? (selectedPortion === 'half' ? 'Half' : 'Full')
        : (typeof dish?.portion === 'string' ? dish.portion : 'Standard Serving');

    // Add current dish to cart
    const handleAddToCart = () => {
        if (!dish) return;

        dispatch(addToCart({
            _id: dish._id || dish.id,
            name: dish.name,
            price: currentPrice,
            portion: currentPortionName,
            selectedPortion: currentPortionName,
            imageUrl: dish.image_url || dish.imageUrl || dish.image,
            quantity: quantity,
            category: dish.category
        }));

        setAddedSuccess(true);
        setTimeout(() => setAddedSuccess(false), 2500);
    };

    // Quick add for recommended items
    const handleQuickAddRecommended = (item) => {
        const itemHasPortions = item.portion && typeof item.portion === 'object' && (Number(item.portion.half) > 0 || Number(item.portion.full) > 0);

        if (itemHasPortions) {
            setPortionModalDish(item);
        } else {
            dispatch(addToCart({
                _id: item._id || item.id,
                name: item.name,
                price: Number(item.price || 0),
                portion: typeof item.portion === 'string' ? item.portion : 'Standard',
                imageUrl: item.image_url || item.imageUrl || item.image,
                quantity: 1,
                category: item.category
            }));
        }
    };

    // Copy share link
    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopiedShare(true);
            setTimeout(() => setCopiedShare(false), 2000);
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] text-white pt-24 sm:pt-28 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-48" />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-6 aspect-square bg-[#141417] rounded-3xl border border-white/5" />
                        <div className="lg:col-span-6 space-y-5">
                            <div className="h-6 bg-white/10 rounded w-28" />
                            <div className="h-9 bg-white/10 rounded w-3/4" />
                            <div className="h-6 bg-white/10 rounded w-24" />
                            <div className="h-20 bg-white/5 rounded-2xl" />
                            <div className="h-24 bg-white/5 rounded-2xl" />
                            <div className="h-12 bg-white/10 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error / Not Found State
    if (error || !dish) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] text-white pt-24 sm:pt-28 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md bg-[#121214] border border-white/5 p-8 rounded-3xl shadow-2xl">
                    <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Dish Not Found</h2>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        {error || "The dish you are looking for may have been archived or is temporarily unavailable."}
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => navigate('/menu')}
                            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
                        >
                            Browse Full Menu
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer border border-white/10"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const imageUrl = dish.image_url || dish.imageUrl || dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop";
    const isVeg = dish.isVeg !== undefined ? dish.isVeg : true;
    const isAvailable = dish.is_available !== undefined ? dish.is_available : (dish.isAvailable ?? true);

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white pt-24 sm:pt-28 md:pt-32 pb-28 md:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div
                className="absolute top-24 left-1/4 -translate-x-1/2 rounded-full blur-3xl pointer-events-none"
                style={{ width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(0,0,0,0) 70%)' }}
            />
            <div
                className="absolute top-96 right-1/4 translate-x-1/2 rounded-full blur-3xl pointer-events-none"
                style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(249,115,22,0.04) 0%, rgba(0,0,0,0) 70%)' }}
            />

            <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16 relative z-10">

                {/* ── 1. Top Navigation Bar (Breadcrumb & Action Bar) ── */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <nav className="flex items-center gap-1.5 text-gray-400">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <span>›</span>
                        <Link to="/menu" className="hover:text-white transition-colors">Menu</Link>
                        <span>›</span>
                        <span className="text-amber-400/90 font-medium">{dish.category || "Main Course"}</span>
                        <span>›</span>
                        <span className="text-gray-200 font-bold truncate max-w-[140px] sm:max-w-xs">{dish.name}</span>
                    </nav>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            className="px-3 py-1.5 bg-[#141416] border border-white/10 hover:border-white/20 rounded-xl text-gray-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer text-xs"
                            title="Share dish"
                        >
                            <Share2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>{copiedShare ? "Link Copied! ✓" : "Share"}</span>
                        </button>
                        <button
                            onClick={() => navigate('/menu')}
                            className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/25 hover:border-amber-500/40 text-amber-400 hover:text-amber-300 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Continue Ordering</span>
                        </button>
                    </div>
                </div>

                {/* ── 2. Primary Dish Showcase: 2-Column Responsive Layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* LEFT COLUMN: Hero Image Showcase (5 or 6 cols) */}
                    <div className="lg:col-span-6 space-y-4">
                        <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl group">
                            {/* Main Food Image */}
                            <img
                                src={imageUrl}
                                alt={dish.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop";
                                }}
                            />

                            {/* Floating Overlay Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                {/* Veg / Non-Veg Indicator */}
                                <div className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 flex items-center gap-1.5 shadow-lg">
                                    <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center p-[2px] ${isVeg ? 'border-emerald-500 text-emerald-400' : 'border-rose-500 text-rose-400'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-200">
                                        {isVeg ? 'Pure Veg' : 'Non-Veg'}
                                    </span>
                                </div>

                                {/* Availability Badge */}
                                <div className={`px-2.5 py-1 rounded-xl border backdrop-blur-md text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 ${
                                    isAvailable
                                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                        : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                                    <span>{isAvailable ? 'In Stock (Live)' : 'Out of Stock'}</span>
                                </div>
                            </div>

                            {/* Wishlist Button */}
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-gray-300 hover:text-rose-500 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                                title="Add to Wishlist"
                            >
                                <Heart className={`w-5 h-5 ${isWishlisted ? 'text-rose-500 fill-rose-500' : ''}`} />
                            </button>

                            {/* Bottom Pill: Freshly Cooked Promise */}
                            <div className="absolute bottom-4 left-4 right-4 bg-[#0c0c0e]/85 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center justify-between text-xs text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                                    <span>Avg Cook & Delivery: <strong>25 - 30 Mins</strong></span>
                                </div>
                                <span className="text-amber-400 font-bold hidden sm:inline text-[11px] bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                                    Piping Hot
                                </span>
                            </div>
                        </div>

                        {/* Guarantee Badges Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#121214] border border-white/5 rounded-2xl p-3.5 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">100% Hygienic</h4>
                                    <p className="text-[10px] text-gray-400">Clean village kitchen prep</p>
                                </div>
                            </div>

                            <div className="bg-[#121214] border border-white/5 rounded-2xl p-3.5 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">Express Delivery</h4>
                                    <p className="text-[10px] text-gray-400">Delivered right to your door</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Dish Specifications, Portion Selector & Add to Cart (6 cols) */}
                    <div className="lg:col-span-6 space-y-6">
                        {/* Category & Badge */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full">
                                    {dish.category || 'Special Dish'}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-[#141416] border border-white/5 px-2.5 py-1 rounded-full">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span>4.8</span>
                                    <span className="text-gray-500 font-normal">(120+ happy diners)</span>
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                                {dish.name}
                            </h1>
                        </div>

                        {/* Price Row with Reactive Portion Calculation */}
                        <div className="bg-[#141417] border border-white/8 rounded-2xl p-4 sm:p-5 flex items-baseline justify-between gap-4">
                            <div>
                                <span className="text-xs text-gray-400 block mb-0.5">
                                    {hasPortions ? `Price for ${currentPortionName} Portion` : 'Menu Price'}
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl sm:text-4xl font-black text-amber-400">
                                        ₹{currentPrice}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">
                                        (Taxes & GST Included)
                                    </span>
                                </div>
                            </div>

                            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                                Free Delivery Eligible
                            </span>
                        </div>

                        {/* Dish Description */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Dish Overview & Ingredients
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-[#121214] border border-white/5 p-4 rounded-2xl">
                                {dish.description || "Prepared with fresh aromatic spices, premium ingredients, and authentic desi recipe perfection. A customer-favorite specialty at Star7Foodies restaurant."}
                            </p>
                        </div>

                        {/* ── PORTION SELECTION (If Dish has Half/Full portions) ── */}
                        {hasPortions && (
                            <div className="space-y-3 bg-[#131316] border border-amber-500/20 rounded-2xl p-4 sm:p-5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Select Portion Size</span>
                                        <span className="text-amber-400">*</span>
                                    </label>
                                    <span className="text-[11px] text-gray-400">Pick preferred serving</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Half Portion Card */}
                                    {hasHalf && (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPortion('half')}
                                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                                selectedPortion === 'half'
                                                    ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10'
                                                    : 'bg-[#18181c] border-white/10 hover:border-white/20'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-xs font-bold text-white">Half Portion</span>
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                    selectedPortion === 'half'
                                                        ? 'border-amber-400 bg-amber-500 text-black'
                                                        : 'border-gray-500 bg-transparent'
                                                }`}>
                                                    {selectedPortion === 'half' && <Check className="w-3 h-3 stroke-[3]" />}
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-gray-400 mb-2">Individual plate serving</p>
                                            <span className="text-base font-black text-amber-400">₹{dish.portion.half}</span>
                                        </button>
                                    )}

                                    {/* Full Portion Card */}
                                    {hasFull && (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPortion('full')}
                                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                                selectedPortion === 'full'
                                                    ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10'
                                                    : 'bg-[#18181c] border-white/10 hover:border-white/20'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                                    <span>Full Portion</span>
                                                    <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded">Recommended</span>
                                                </span>
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                                    selectedPortion === 'full'
                                                        ? 'border-amber-400 bg-amber-500 text-black'
                                                        : 'border-gray-500 bg-transparent'
                                                }`}>
                                                    {selectedPortion === 'full' && <Check className="w-3 h-3 stroke-[3]" />}
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-gray-400 mb-2">Full plate generous feast</p>
                                            <span className="text-base font-black text-amber-400">₹{dish.portion.full}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── QUANTITY SELECTOR & ORDER CTA ── */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-4">
                                {/* Quantity Stepper */}
                                <div className="flex items-center bg-[#18181c] border border-white/10 rounded-2xl p-1 shadow-inner">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                                        title="Decrease quantity"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 text-base font-extrabold text-white select-none min-w-[36px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                                        title="Increase quantity"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Dynamic Subtotal Preview */}
                                <div className="flex-1 text-right">
                                    <span className="text-xs text-gray-400 block">Subtotal</span>
                                    <span className="text-xl sm:text-2xl font-black text-white">
                                        ₹{currentPrice * quantity}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons: Add to Cart & Continue Ordering */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                {/* Primary CTA: Add to Cart */}
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={!isAvailable}
                                    className={`py-3.5 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                                        !isAvailable
                                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                                            : addedSuccess
                                                ? 'bg-emerald-500 text-black shadow-emerald-500/20 scale-[1.02]'
                                                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                                >
                                    {addedSuccess ? (
                                        <>
                                            <Check className="w-5 h-5 stroke-[3]" />
                                            <span>Added to Cart!</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                                            <span>Add to Cart • ₹{currentPrice * quantity}</span>
                                        </>
                                    )}
                                </button>

                                {/* Secondary CTA: Continue Ordering */}
                                <button
                                    type="button"
                                    onClick={() => navigate('/menu')}
                                    className="py-3.5 px-6 bg-[#16161a] hover:bg-[#1c1c22] border border-white/10 hover:border-amber-500/40 text-gray-200 hover:text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                                >
                                    <span>Continue Ordering</span>
                                    <ChevronRight className="w-4 h-4 text-amber-400" />
                                </button>
                            </div>

                            {/* View Cart Quick Link if Cart has items */}
                            {cartItems.length > 0 && (
                                <div className="pt-2 text-center">
                                    <Link
                                        to="/cart"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                                    >
                                        <span>View Cart ({cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0)} items) & Proceed to Checkout</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* ── 3. CHEF'S RECOMMENDATIONS / SUGGESTED DISHES ── */}
                {recommendedDishes.length > 0 && (
                    <div className="pt-10 border-t border-white/10 space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
                            <div>
                                <span className="text-xs uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                                    Pair With Your Meal
                                </span>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                                    You Might Also Like
                                </h2>
                                <p className="text-xs text-gray-400">
                                    Dishes frequently ordered alongside {dish.name}
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/menu')}
                                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                            >
                                <span>View Full Menu</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Suggested Dishes Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                            {recommendedDishes.map((item) => {
                                const recId = item._id || item.id;
                                const recImg = item.image_url || item.imageUrl || item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop";
                                const recIsVeg = item.isVeg !== undefined ? item.isVeg : true;

                                return (
                                    <div
                                        key={recId}
                                        className="group bg-[#121215] hover:bg-[#16161a] border border-white/5 hover:border-amber-500/30 rounded-2xl p-2.5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-amber-950/20 relative"
                                    >
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => navigate(`/dish/${recId}`)}
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-900 mb-2">
                                                <img
                                                    src={recImg}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop";
                                                    }}
                                                />
                                                <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 bg-black/60 rounded border border-white/20 flex items-center justify-center p-[2px]">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${recIsVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                                </div>
                                            </div>

                                            {/* Name & Category */}
                                            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold block">
                                                {item.category}
                                            </span>
                                            <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                                                {item.name}
                                            </h4>
                                        </div>

                                        {/* Price & Add Action */}
                                        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                                            <span className="text-xs font-extrabold text-amber-400">
                                                ₹{item.price}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleQuickAddRecommended(item)}
                                                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 hover:border-amber-500 text-amber-400 hover:text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center gap-0.5 cursor-pointer shadow-sm"
                                            >
                                                <span>ADD</span>
                                                <Plus className="w-3 h-3 stroke-[3]" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Portion Selection Modal for Suggested Items */}
            <PortionModal
                isOpen={Boolean(portionModalDish)}
                dish={portionModalDish}
                onClose={() => setPortionModalDish(null)}
                onAddToCart={(payload) => {
                    dispatch(addToCart(payload));
                    setPortionModalDish(null);
                }}
            />
        </div>
    );
};

export default ItemDetails;
