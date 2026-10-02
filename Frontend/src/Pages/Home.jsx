import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaStar,
    FaLeaf,
    FaFilter,
    FaArrowRight,
    FaMotorcycle,
    FaShieldAlt,
    FaPercent,
    FaRegDotCircle,
    FaShoppingBag,
    FaUtensils,
    FaClock,
    FaFire
} from 'react-icons/fa';
import { allFoods } from '../Api/axios';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../Redux/Slices/cart.js';
import PortionModal from '../Components/PortionModal';

const CATEGORIES = [
    { name: "Indian Veg", icon: "🥦", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=60" },
    { name: "Egg", icon: "🍳", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&auto=format&fit=crop&q=60" },
    { name: "Roll", icon: "🌯", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300&auto=format&fit=crop&q=60" },
    { name: "Rice", icon: "🍚", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&auto=format&fit=crop&q=60" },
    { name: "Paneer Tadka", icon: "🧀", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&auto=format&fit=crop&q=60" },
    { name: "Slad/Raita", icon: "🥗", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=60" },
    { name: "Roti Pratha", icon: "🫓", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=300&auto=format&fit=crop&q=60" },
    { name: "Noodles", icon: "🍜", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&auto=format&fit=crop&q=60" },
    { name: "Soup", icon: "🥣", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&auto=format&fit=crop&q=60" },
    { name: "Lollypope", icon: "🍗", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=300&auto=format&fit=crop&q=60" },
    { name: "Chinese Spice", icon: "🌶️", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&auto=format&fit=crop&q=60" },
    { name: "Star7 Thali", icon: "🍱", image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=300&auto=format&fit=crop&q=60" },
    { name: "Chicken", icon: "🍖", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&auto=format&fit=crop&q=60" },
    { name: "Snacks", icon: "🍟", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=60" },
    { name: "Pizza", icon: "🍕", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=60" }
];

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [vegOnly, setVegOnly] = useState(false);
    const [highRatedOnly, setHighRatedOnly] = useState(false);
    const [sortByPrice, setSortByPrice] = useState(""); // "asc", "desc", or ""

    const cartItems = useSelector((state) => state?.cart?.items || []);
    const [portionModalDish, setPortionModalDish] = useState(null);

    const handleAddToCart = (food) => {
        const rawP = food.rawPortion || food.portion;
        const hasPortions = rawP && typeof rawP === 'object' && (Number(rawP.half) > 0 || Number(rawP.full) > 0);

        if (hasPortions) {
            setPortionModalDish({
                ...food,
                portion: rawP
            });
            return;
        }

        const foodId = food._id || food.id || String(food.name);
        const normalizedFood = {
            ...food,
            _id: foodId,
            id: foodId,
            name: food.name,
            price: Number(food.price) || 0,
            image_url: food.image_url || food.imageUrl || food.image,
            imageUrl: food.imageUrl || food.image_url || food.image,
            portion: typeof food.portion === 'string' ? food.portion : 'Standard Serving'
        };
        dispatch(addToCart(normalizedFood));
    };

    const handleRemoveFromCart = (foodId) => {
        dispatch(removeFromCart(foodId));
    };

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await allFoods();
                const productsList = (data && data.items && Array.isArray(data.items)) ? data.items : [];
                setFoods(productsList.map(item => ({
                    ...item,
                    _id: item._id || item.id,
                    imageUrl: item.image_url || item.imageUrl || item.image
                })));
            } catch (err) {
                console.error("Error loading foods from backend:", err);
                setError(err.message || "Unable to load dishes. Please check your backend connection.");
                setFoods([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFoods();
    }, []);

    // Filters and Sorting Logic
    let filteredFoods = [...foods];

    if (selectedCategory) {
        filteredFoods = filteredFoods.filter(food => food.category === selectedCategory);
    }
    if (vegOnly) {
        filteredFoods = filteredFoods.filter(food => {
            const isVeg = food.isVeg !== undefined ? food.isVeg : !(/chicken|beef|meat|mutton|pork|fish|egg/i.test(food.name));
            return isVeg;
        });
    }
    if (highRatedOnly) {
        filteredFoods = filteredFoods.filter(food => {
            const rating = food.rating || (4.0 + (food.name.length % 10) / 10).toFixed(1);
            return parseFloat(rating) >= 4.5;
        });
    }
    if (sortByPrice === "asc") {
        filteredFoods.sort((a, b) => a.price - b.price);
    } else if (sortByPrice === "desc") {
        filteredFoods.sort((a, b) => b.price - a.price);
    }

    const hasActiveFilters = selectedCategory || vegOnly || highRatedOnly || sortByPrice;

    const resetFilters = () => {
        setSelectedCategory("");
        setVegOnly(false);
        setHighRatedOnly(false);
        setSortByPrice("");
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                {/* Skeleton Banner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-44 rounded-2xl bg-white/5 animate-pulse"></div>
                    <div className="h-44 rounded-2xl bg-white/5 animate-pulse"></div>
                </div>
                {/* Skeleton Categories */}
                <div className="space-y-4">
                    <div className="h-6 w-48 bg-white/5 rounded animate-pulse"></div>
                    <div className="flex gap-6 overflow-hidden">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-20 h-20 rounded-full bg-white/5 animate-pulse shrink-0"></div>
                        ))}
                    </div>
                </div>
                {/* Skeleton Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-[#121214] border border-white/5 rounded-2xl h-80 animate-pulse flex flex-col justify-between p-4">
                            <div className="w-full h-36 bg-white/5 rounded-xl"></div>
                            <div className="h-4 w-3/4 bg-white/5 rounded mt-3"></div>
                            <div className="h-3 w-1/2 bg-white/5 rounded"></div>
                            <div className="flex justify-between items-center mt-4">
                                <div className="h-5 w-16 bg-white/5 rounded"></div>
                                <div className="h-8 w-16 bg-white/5 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

            {/* SECTION 1: PROMO BANNER CAROUSEL (Blinkit style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Banner 1 */}
                <div 
                    onClick={() => navigate('/menu')}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-6 flex flex-col justify-center h-44 shadow-lg shadow-orange-500/10 group cursor-pointer hover:shadow-orange-500/20 transition-all duration-300"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-12 -translate-y-12 transition-transform duration-500 group-hover:scale-110"></div>
                    <div className="z-10 flex flex-col gap-2">
                        <div>
                            <span className="bg-black/30 backdrop-blur-md text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full text-white">
                                Special Deal • First Order
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black leading-tight text-white">
                            10% OFF ON FIRST ORDER ABOVE ₹299
                        </h2>
                        <div className="flex items-center justify-between gap-4 mt-1">
                            <p className="text-xs text-white/90">Use Code: <span className="font-bold border-b border-dashed border-white">STAR7WELCOME</span> (Min ₹299)</p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); navigate('/menu'); }}
                                className="flex items-center gap-1.5 bg-black text-white hover:bg-white hover:text-black transition-all px-4 py-1.5 rounded-full text-xs font-bold shadow-md cursor-pointer shrink-0"
                            >
                                Order Now <FaArrowRight className="text-[10px]" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Banner 2 */}
                <div 
                    onClick={() => navigate('/menu')}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 flex flex-col justify-center h-44 shadow-lg shadow-teal-500/10 group cursor-pointer hover:shadow-teal-500/20 transition-all duration-300"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-12 -translate-y-12 transition-transform duration-500 group-hover:scale-110"></div>
                    <div className="z-10 flex flex-col gap-2">
                        <div>
                            <span className="bg-black/30 backdrop-blur-md text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full text-white">
                                Free Fast Delivery
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black leading-tight text-white">
                            FREE DELIVERY ON ALL ORDERS
                        </h2>
                        <div className="flex items-center justify-between gap-4 mt-1">
                            <p className="text-xs text-white/90">Fresh food delivered hot straight to your home.</p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); navigate('/menu'); }}
                                className="flex items-center gap-1.5 bg-black text-white hover:bg-white hover:text-black transition-all px-4 py-1.5 rounded-full text-xs font-bold shadow-md cursor-pointer shrink-0"
                            >
                                Explore Menu <FaArrowRight className="text-[10px]" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: CATEGORY SELECTOR ("What's on your mind?") */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-white/90">
                        What's on your mind?
                    </h3>
                    {selectedCategory && (
                        <button
                            onClick={() => setSelectedCategory("")}
                            className="text-xs text-amber-500 hover:text-amber-400 font-bold transition-all cursor-pointer"
                        >
                            View All
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-4 md:gap-8 overflow-x-auto pb-3 scrollbar-hide scroll-smooth">
                    {CATEGORIES.map((cat) => {
                        const isActive = selectedCategory === cat.name;
                        return (
                            <button
                                key={cat.name}
                                onClick={() => setSelectedCategory(isActive ? "" : cat.name)}
                                className="flex flex-col items-center gap-2 group cursor-pointer shrink-0"
                            >
                                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 transition-all duration-300 ${isActive
                                    ? 'border-amber-500 scale-105 shadow-lg shadow-amber-500/20'
                                    : 'border-white/5 group-hover:border-white/20'
                                    }`}>
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <span className={`text-xs md:text-sm font-medium transition-all ${isActive ? 'text-amber-400 font-bold' : 'text-gray-400 group-hover:text-white'
                                    }`}>
                                    {cat.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 3: QUICK FILTERS ROW (Easy usability) */}
            <div className="flex flex-wrap items-center gap-2.5 py-4 border-y border-white/5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-gray-300">
                    <FaFilter className="text-[10px] text-amber-500" />
                    <span>Filters</span>
                </div>

                {/* Veg Only Filter */}
                <button
                    onClick={() => setVegOnly(!vegOnly)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${vegOnly
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                >
                    <FaLeaf className="text-[10px]" />
                    <span>Pure Veg</span>
                </button>

                {/* High Rated Filter */}
                <button
                    onClick={() => setHighRatedOnly(!highRatedOnly)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${highRatedOnly
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                >
                    <FaStar className="text-[10px]" />
                    <span>Ratings 4.5+</span>
                </button>

                {/* Sort Price Low to High */}
                <button
                    onClick={() => setSortByPrice(sortByPrice === "asc" ? "" : "asc")}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${sortByPrice === "asc"
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                >
                    Price: Low to High
                </button>

                {/* Sort Price High to Low */}
                <button
                    onClick={() => setSortByPrice(sortByPrice === "desc" ? "" : "desc")}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${sortByPrice === "desc"
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                >
                    Price: High to Low
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="text-xs text-red-400 hover:text-red-300 font-bold transition-all px-3 py-1.5 ml-auto cursor-pointer"
                    >
                        Reset Filters
                    </button>
                )}
            </div>

            {/* SECTION 4: FOODS GRID */}
            <div className="space-y-6">
                <div className="flex items-baseline justify-between">
                    <h3 className="text-xl md:text-2xl font-black tracking-tight">
                        {selectedCategory ? `${selectedCategory} Specialities` : "Popular Dishes"}
                    </h3>
                    <p className="text-xs text-gray-400">
                        Showing {filteredFoods.length} items
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="bg-[#121214] border border-white/5 rounded-2xl p-4 space-y-3 animate-pulse">
                                <div className="w-full aspect-square bg-white/5 rounded-xl"></div>
                                <div className="h-4 bg-white/5 rounded w-3/4"></div>
                                <div className="h-3 bg-white/5 rounded w-1/2"></div>
                                <div className="flex justify-between items-center pt-2">
                                    <div className="h-5 bg-white/5 rounded w-14"></div>
                                    <div className="h-8 bg-white/5 rounded w-16"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="py-16 text-center bg-white/5 border border-red-500/20 rounded-2xl p-6 space-y-3">
                        <div className="text-3xl">⚠️</div>
                        <p className="text-sm font-bold text-white">Server Connection Error</p>
                        <p className="text-xs text-gray-400 max-w-md mx-auto">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs rounded-xl shadow-md cursor-pointer hover:scale-105 transition-all"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : filteredFoods.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {filteredFoods.map((food) => {
                            const foodId = food._id || food.id;
                            const itemsInCartForDish = cartItems.filter((item) => (item._id || item.id) === foodId);
                            const totalQtyForDish = itemsInCartForDish.reduce((sum, it) => sum + (it.quantity || 1), 0);
                            const hasPortions = food.portion && typeof food.portion === 'object' && (Number(food.portion.half) > 0 || Number(food.portion.full) > 0);
                            const existingCartItem = cartItems.find((item) => item._id === foodId || item.id === foodId);
                            const qty = existingCartItem ? existingCartItem.quantity : 0;
                            const rating = food.rating || (4.0 + (food.name.length % 10) / 10).toFixed(1);
                            const time = food.time || ((food.price % 15) + 15) + " mins";
                            const imageUrl = food.imageUrl || food.image_url || food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop";
                            const description = food.description || food.desc;
                            const discount = food.discount || (food.price > 200 ? "20% OFF" : "10% OFF");
                            const bestseller = food.bestseller !== undefined ? food.bestseller : (rating >= 4.5);
                            const isVeg = food.isVeg !== undefined ? food.isVeg : !(/chicken|beef|meat|mutton|pork|fish|egg/i.test(food.name));

                            return (
                                <div
                                    key={foodId}
                                    className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/30 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 group flex flex-col justify-between"
                                >
                                    {/* Clickable Image Section */}
                                    <div
                                        className="relative w-full h-44 overflow-hidden cursor-pointer"
                                        onClick={() => navigate(`/dish/${foodId}`)}
                                        title={`View details for ${food.name}`}
                                    >
                                        <img
                                            loading='lazy'
                                            src={imageUrl}
                                            alt={food.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {/* Discount Tag */}
                                        {discount && (
                                            <div className="absolute bottom-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-md">
                                                {discount}
                                            </div>
                                        )}
                                        {/* Bestseller Badge */}
                                        {bestseller && (
                                            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-500/25">
                                                Bestseller
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                                        <div
                                            className="space-y-1.5 cursor-pointer"
                                            onClick={() => navigate(`/dish/${foodId}`)}
                                            title={`View details for ${food.name}`}
                                        >
                                            {/* Veg / Non-Veg Icon & Rating */}
                                            <div className="flex items-center justify-between">
                                                {/* Swiggy Green Dot / Red Dot Icon */}
                                                <span className={`inline-flex items-center justify-center p-0.5 border rounded-sm ${isVeg ? 'border-emerald-500 text-emerald-500' : 'border-red-500 text-red-500'
                                                    }`}>
                                                    <FaRegDotCircle className="text-[8px]" />
                                                </span>

                                                {/* Rating */}
                                                <div className="flex items-center gap-1 text-[11px] font-bold text-gray-300 bg-white/5 px-2 py-0.5 rounded-full">
                                                    <FaStar className="text-amber-500 text-[9px]" />
                                                    <span>{rating}</span>
                                                </div>
                                            </div>

                                            {/* Food Title */}
                                            <h4 className="text-sm font-bold text-white leading-snug group-hover:text-amber-400 transition-colors">
                                                {food.name}
                                            </h4>

                                            {/* Delivery Time */}
                                            <p className="text-[10px] text-gray-400 font-medium">
                                                ⏰ {time}
                                            </p>

                                            {/* Description */}
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                {description}
                                            </p>
                                        </div>

                                        {/* Price & Add Button */}
                                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                            <span className="text-sm font-black text-white">
                                                ₹{food.price}
                                            </span>

                                            {/* Interactive Swiggy Style ADD button with Portion Support */}
                                            {hasPortions ? (
                                                totalQtyForDish === 0 ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAddToCart(food);
                                                        }}
                                                        className="px-3.5 py-1.5 border border-amber-500/40 hover:border-amber-500 text-amber-500 font-black text-xs bg-amber-500/5 hover:bg-amber-500 hover:text-white rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                                                    >
                                                        <span>ADD</span>
                                                        <span className="text-[9px] font-normal opacity-80">(Portion)</span>
                                                    </button>
                                                ) : (
                                                    <div className="flex flex-col items-end gap-1">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setPortionModalDish(food);
                                                            }}
                                                            className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                                                            title="Click to add another half or full plate"
                                                        >
                                                            <span>{totalQtyForDish} in cart</span>
                                                            <span className="text-[10px] font-black bg-black/20 text-black px-1 rounded">+</span>
                                                        </button>
                                                        <span className="text-[9px] text-amber-400 font-semibold truncate max-w-[110px]">
                                                            {itemsInCartForDish.map(it => `${it.portion}: ${it.quantity}`).join(', ')}
                                                        </span>
                                                    </div>
                                                )
                                            ) : (
                                                qty === 0 ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAddToCart(food);
                                                        }}
                                                        className="px-4 py-1.5 border border-amber-500/40 hover:border-amber-500 text-amber-500 font-black text-xs bg-amber-500/5 hover:bg-amber-500 hover:text-white rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                                    >
                                                        ADD
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center bg-amber-500 text-white rounded-lg overflow-hidden shadow-md">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveFromCart(foodId);
                                                            }}
                                                            className="px-2.5 py-1.5 hover:bg-amber-600 transition-all font-bold text-xs cursor-pointer"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-2 font-bold text-xs min-w-[16px] text-center">
                                                            {qty}
                                                        </span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddToCart(food);
                                                            }}
                                                            className="px-2.5 py-1.5 hover:bg-amber-600 transition-all font-bold text-xs cursor-pointer"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-12 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-sm text-gray-400">
                            No dishes match your active filters.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="text-xs text-amber-500 font-bold hover:underline mt-2 cursor-pointer"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* SECTION 5: SAFETY ASSURED BANNER (Trust Factor) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-500">
                        <FaMotorcycle className="text-lg" />
                    </div>
                    <div>
                        <h5 className="text-xs font-bold">Contactless Delivery</h5>
                        <p className="text-[10px] text-gray-500">Your safety is our priority</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-500">
                        <FaShieldAlt className="text-lg" />
                    </div>
                    <div>
                        <h5 className="text-xs font-bold">Safety Assured</h5>
                        <p className="text-[10px] text-gray-500">Regular kitchen sanitation checks</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-500">
                        <FaPercent className="text-lg" />
                    </div>
                    <div>
                        <h5 className="text-xs font-bold">Best Offers Guaranteed</h5>
                        <p className="text-[10px] text-gray-500">Direct partnership discounts</p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { transform: translate(-50%, 100px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                /* Hide scrollbar for Chrome, Safari and Opera */
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                /* Hide scrollbar for IE, Edge and Firefox */
                .scrollbar-hide {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>

            {/* Portion Selection Modal for Dishes with Portion Options */}
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

export default Home;
