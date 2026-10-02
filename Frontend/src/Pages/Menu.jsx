import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../Redux/Slices/cart.js';
import { allFoods } from '../Api/axios';
import PortionModal from '../Components/PortionModal';
import {
    Search,
    Zap,
    Clock,
    Star,
    Plus,
    Minus,
    ShoppingBag,
    ArrowRight,
    X,
    Flame,
    Heart,
    SlidersHorizontal,
    Check,
    Utensils
} from 'lucide-react';

// Fallback catalog matching Star7Foodies restaurant theme
const DEFAULT_MENU_ITEMS = [
    {
        _id: "m1",
        name: "Hyderabadi Chicken Dum Biryani",
        category: "Biryani",
        price: 279,
        originalPrice: 349,
        rating: 4.8,
        reviewsCount: 320,
        time: "25-28 mins",
        isVeg: false,
        portion: "Serves 1-2 • 650g",
        description: "Slow-cooked saffron basmati rice layered with juicy bone-in chicken and royal aromatic spices.",
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60",
        discount: "20% OFF",
        isBestseller: true
    },
    {
        _id: "m2",
        name: "Paneer Tikka Butter Masala",
        category: "Main Course",
        price: 239,
        originalPrice: 289,
        rating: 4.7,
        reviewsCount: 245,
        time: "20-25 mins",
        isVeg: true,
        portion: "Serves 1-2 • 450g",
        description: "Char-grilled cottage cheese cubes simmered in a silky, rich makhani gravy with fenugreek butter.",
        imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60",
        discount: "15% OFF",
        isBestseller: true
    },
    {
        _id: "m3",
        name: "Double Cheese Margherita Pizza",
        category: "Pizza",
        price: 219,
        originalPrice: 269,
        rating: 4.6,
        reviewsCount: 180,
        time: "15-20 mins",
        isVeg: true,
        portion: "8 inches • 4 Slices",
        description: "Crisp hand-tossed crust overloaded with mozzarella, aromatic basil oil and San Marzano tomato puree.",
        imageUrl: "https://images.unsplash.com/photo-1601924582970-9238b4ead50c?w=500&auto=format&fit=crop&q=60",
        discount: "₹50 OFF",
        isBestseller: false
    },
    {
        _id: "m4",
        name: "Crispy Peri Peri Chicken Burger",
        category: "Burgers",
        price: 159,
        originalPrice: 199,
        rating: 4.5,
        reviewsCount: 410,
        time: "15-20 mins",
        isVeg: false,
        portion: "1 Burger • 220g",
        description: "Ultra-crispy fried chicken fillet dusted with fiery African peri-peri seasoning and creamy slaw.",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
        discount: "20% OFF",
        isBestseller: true
    },
    {
        _id: "m5",
        name: "Crispy Veg Spring Rolls",
        category: "Starters",
        price: 139,
        originalPrice: 169,
        rating: 4.3,
        reviewsCount: 120,
        time: "12-15 mins",
        isVeg: true,
        portion: "6 Pieces",
        description: "Golden fried thin pastry rolls packed with julienned vegetables and served with hot sweet chilli dip.",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60",
        discount: "18% OFF",
        isBestseller: false
    },
    {
        _id: "m6",
        name: "Chilli Chicken Dry (Indo-Chinese)",
        category: "Chinese",
        price: 219,
        originalPrice: 259,
        rating: 4.6,
        reviewsCount: 290,
        time: "20-25 mins",
        isVeg: false,
        portion: "Serves 1-2 • 350g",
        description: "Diced chicken tossed with crisp bell peppers, green chillies and dark soya glaze in a smoking wok.",
        imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60",
        discount: "15% OFF",
        isBestseller: true
    },
    {
        _id: "m7",
        name: "Molten Choco Lava Cake",
        category: "Desserts",
        price: 99,
        originalPrice: 129,
        rating: 4.9,
        reviewsCount: 520,
        time: "10-12 mins",
        isVeg: true,
        portion: "1 Cake • 110g",
        description: "Warm chocolate sponge cake filled with a decadent pool of flowing molten Belgian chocolate.",
        imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60",
        discount: "23% OFF",
        isBestseller: true
    },
    {
        _id: "m8",
        name: "Chilled Mango Alfonso Lassi",
        category: "Beverages",
        price: 79,
        originalPrice: 99,
        rating: 4.7,
        reviewsCount: 165,
        time: "8-10 mins",
        isVeg: true,
        portion: "300 ml Bottle",
        description: "Thick creamy yogurt blended with real Ratnagiri Alfonso mango pulp and cardamom aroma.",
        imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=60",
        discount: "20% OFF",
        isBestseller: false
    },
    {
        _id: "m9",
        name: "Dal Makhani with Jeera Rice",
        category: "Main Course",
        price: 189,
        originalPrice: 229,
        rating: 4.5,
        reviewsCount: 190,
        time: "20-25 mins",
        isVeg: true,
        portion: "Combo Bowl • 480g",
        description: "Black lentils slow-simmered for 24 hours with butter and cream, served alongside aromatic cumin basmati rice.",
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60",
        discount: "17% OFF",
        isBestseller: false
    },
    {
        _id: "m10",
        name: "Smoky BBQ Chicken Wings",
        category: "Starters",
        price: 209,
        originalPrice: 259,
        rating: 4.6,
        reviewsCount: 280,
        time: "15-20 mins",
        isVeg: false,
        portion: "6 Wings",
        description: "Crispy chicken wings glazed with hickory wood barbecue sauce and sesame seed garnishing.",
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop&q=60",
        discount: "20% OFF",
        isBestseller: true
    }
];

const CATEGORIES = [
    { id: "All", name: "All Delicacies", icon: "✨" },
    { id: "Biryani", name: "Biryani", icon: "🍛" },
    { id: "Pizza", name: "Pizza", icon: "🍕" },
    { id: "Burgers", name: "Burgers", icon: "🍔" },
    { id: "Main Course", name: "Main Course", icon: "🥘" },
    { id: "Starters", name: "Starters", icon: "🥟" },
    { id: "Chinese", name: "Chinese", icon: "🍜" },
    { id: "Desserts", name: "Desserts", icon: "🍰" },
    { id: "Beverages", name: "Beverages", icon: "🥤" },
];

// Feature toggles for future releases (disabled per user request for now, kept for future)
const SHOW_DISCOUNT_BADGES = false;
const SHOW_WISHLIST_BUTTON = false;

// Helper to ensure all ratings are randomized/realistic and strictly > 4.0
const getRandomRatingAbove4 = (name = '', currentRating = null) => {
    const num = Number(currentRating);
    if (num && num > 4.0 && num <= 5.0) return num.toFixed(1);
    const charSum = String(name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const fraction = (charSum + 19) % 8; // 0..7
    return (4.2 + fraction / 10).toFixed(1); // 4.2 to 4.9 (Always > 4.0)
};

const Menu = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state?.cart?.items || []);
    const totalCartAmount = useSelector((state) => state?.cart?.totalCartAmount || 0);

    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [vegFilter, setVegFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'
    const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-low' | 'price-high' | 'rating'
    const [under199Only, setUnder199Only] = useState(false);
    const [wishlist, setWishlist] = useState({});
    const [portionModalDish, setPortionModalDish] = useState(null);

    const handleAddItem = (item) => {
        const rawP = item.rawPortion || item.portion;
        const hasPortions = rawP && typeof rawP === 'object' && (Number(rawP.half) > 0 || Number(rawP.full) > 0);

        if (hasPortions) {
            setPortionModalDish({
                ...item,
                portion: rawP
            });
            return;
        }

        dispatch(addToCart({
            _id: item._id || item.id,
            name: item.name,
            price: Number(item.price),
            imageUrl: item.image_url || item.imageUrl || item.image,
            portion: typeof item.portion === 'string' ? item.portion : 'Standard Serving',
            quantity: 1,
            category: item.category
        }));
    };

    // Fetch foods from backend API
    useEffect(() => {
        let isMounted = true;
        const fetchItems = async () => {
            try {
                setLoading(true);
                const data = await allFoods();
                const fetched = (data && data.items && data.items.length > 0) ? data.items : [];

                if (isMounted) {
                    if (fetched.length > 0) {
                        const normalized = fetched.map(item => ({
                            ...item,
                            isVeg: item.isVeg !== undefined
                                ? item.isVeg
                                : !(/chicken|meat|mutton|fish|beef|pork|egg|prawn/i.test(item.name)),
                            time: item.time || "25-28 mins",
                            rating: getRandomRatingAbove4(item.name, item.rating),
                            rawPortion: item.portion,
                            portion: item.portion,
                            portionText: (typeof item.portion === 'object' && item.portion?.half)
                                ? `Half ₹${item.portion.half} • Full ₹${item.portion.full || item.price}`
                                : (typeof item.portion === 'string' ? item.portion : "Single Serving"),
                            originalPrice: item.originalPrice || Math.round(item.price * 1.25),
                            discount: item.discount || "20% OFF",
                            isBestseller: item.isBestseller || (item.name.length % 2 === 0)
                        }));
                        setFoods(normalized);
                    } else {
                        setFoods(DEFAULT_MENU_ITEMS.map(item => ({
                            ...item,
                            rating: getRandomRatingAbove4(item.name, item.rating)
                        })));
                    }
                }
            } catch (err) {
                console.warn("Could not load backend products, using default catalogue:", err);
                if (isMounted) {
                    setFoods(DEFAULT_MENU_ITEMS.map(item => ({
                        ...item,
                        rating: getRandomRatingAbove4(item.name, item.rating)
                    })));
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchItems();
        return () => {
            isMounted = false;
        };
    }, []);

    // Helper to get cart quantity for a specific item
    const getItemQuantity = (id) => {
        const matching = cartItems.filter(item => (item._id === id || item.id === id));
        return matching.reduce((sum, it) => sum + (it.quantity || 1), 0);
    };

    // Toggle Wishlist Heart
    const toggleWishlist = (id) => {
        setWishlist(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Filter & Sort Logic
    const filteredFoods = useMemo(() => {
        return foods.filter(item => {
            // Category filter
            if (selectedCategory !== 'All' && item.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
                return false;
            }

            // Search query filter
            if (searchTerm.trim()) {
                const query = searchTerm.toLowerCase().trim();
                const matchName = item.name?.toLowerCase().includes(query);
                const matchDesc = item.description?.toLowerCase().includes(query);
                const matchCat = item.category?.toLowerCase().includes(query);
                if (!matchName && !matchDesc && !matchCat) return false;
            }

            // Veg / Non-Veg filter
            if (vegFilter === 'veg' && !item.isVeg) return false;
            if (vegFilter === 'non-veg' && item.isVeg) return false;

            // Under 199 filter
            if (under199Only && item.price > 199) return false;

            return true;
        }).sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            return 0; // 'popular' maintains default order
        });
    }, [foods, selectedCategory, searchTerm, vegFilter, under199Only, sortBy]);

    // Calculate category counts
    const categoryCounts = useMemo(() => {
        const counts = { All: foods.length };
        foods.forEach(item => {
            const cat = item.category || "General";
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return counts;
    }, [foods]);

    // Total items in cart
    const totalCartCount = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }, [cartItems]);

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-gray-100 pb-28 md:pb-24 pt-0">
            {/* Top Quick-Delivery & Search Banner (Harmonized with Star7Foodies Brand Colors) */}
            <div className="bg-[#111114]/90 border-b border-white/5 sticky top-16 md:top-20 z-40 backdrop-blur-xl shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
                    {/* Top Row: Fast Delivery badge & Search Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Delivery Promise Badge */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-black tracking-wide text-white uppercase">Delivery in 25-28 mins</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                </div>
                                <p className="text-[11px] text-gray-400 truncate">Authentic chef-prepared food delivered hot to your doorstep</p>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search dishes, biryani, pizzas, burgers..."
                                className="w-full bg-[#18181b] border border-white/10 rounded-full pl-10 pr-9 py-2 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 focus:bg-[#1f1f23] transition-all"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bottom Row: Quick Filter Chips */}
                    <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide py-1">
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Veg Filter Toggle */}
                            <button
                                onClick={() => setVegFilter(prev => prev === 'veg' ? 'all' : 'veg')}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${vegFilter === 'veg'
                                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                                        : 'bg-[#18181b] border-white/10 text-gray-400 hover:border-emerald-500/40 hover:text-white'
                                    }`}
                            >
                                <span className="w-3.5 h-3.5 rounded border border-emerald-500 flex items-center justify-center p-[2px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                </span>
                                <span>Pure Veg</span>
                                {vegFilter === 'veg' && <Check className="w-3 h-3 text-emerald-400" />}
                            </button>

                            {/* Non-Veg Filter Toggle */}
                            <button
                                onClick={() => setVegFilter(prev => prev === 'non-veg' ? 'all' : 'non-veg')}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${vegFilter === 'non-veg'
                                        ? 'bg-rose-500/15 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                                        : 'bg-[#18181b] border-white/10 text-gray-400 hover:border-rose-500/40 hover:text-white'
                                    }`}
                            >
                                <span className="w-3.5 h-3.5 rounded border border-rose-500 flex items-center justify-center p-[2px]">
                                    <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-rose-500"></span>
                                </span>
                                <span>Non-Veg</span>
                                {vegFilter === 'non-veg' && <Check className="w-3 h-3 text-rose-400" />}
                            </button>

                            {/* Under ₹199 Chip */}
                            <button
                                onClick={() => setUnder199Only(prev => !prev)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${under199Only
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold border-amber-400 shadow-md shadow-amber-500/10'
                                        : 'bg-[#18181b] border-white/10 text-gray-400 hover:text-white hover:border-amber-500/40'
                                    }`}
                            >
                                ⚡ Under ₹199
                            </button>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2 shrink-0">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-[#18181b] border border-white/10 rounded-full px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-amber-500 cursor-pointer"
                            >
                                <option value="popular">Popularity</option>
                                <option value="rating">Top Rated</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Menu Body: Left Sidebar + Right Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
                <div className="flex flex-col md:flex-row gap-6">

                    {/* LEFT CATEGORY RAIL (Harmonized Amber Brand Palette) */}
                    <div className="md:w-60 shrink-0">
                        {/* Mobile Horizontal Category Rail */}
                        <div className="flex md:hidden overflow-x-auto scrollbar-hide gap-2 pb-2">
                            {CATEGORIES.map((cat) => {
                                const isSelected = selectedCategory === cat.id;
                                const count = categoryCounts[cat.id] || 0;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 border transition-all shrink-0 cursor-pointer ${isSelected
                                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black border-amber-400 shadow-md shadow-amber-500/10 font-bold'
                                                : 'bg-[#131316] border-white/5 text-gray-300 hover:bg-[#18181c]'
                                            }`}
                                    >
                                        <span>{cat.icon}</span>
                                        <span>{cat.name}</span>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/25 text-black' : 'bg-white/10 text-gray-400'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Desktop Sticky Vertical Category Sidebar */}
                        <div className="hidden md:block sticky top-44 bg-[#111114] border border-white/5 rounded-3xl p-3 shadow-md space-y-1">
                            <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between border-b border-white/5 mb-1">
                                <span>Categories</span>
                                <span className="text-amber-400 font-semibold">{foods.length} items</span>
                            </div>

                            {CATEGORIES.map((cat) => {
                                const isSelected = selectedCategory === cat.id;
                                const count = categoryCounts[cat.id] || 0;

                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${isSelected
                                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold shadow-md shadow-amber-500/15'
                                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-base">{cat.icon}</span>
                                            <span className="truncate">{cat.name}</span>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isSelected ? 'bg-black/25 text-black' : 'bg-white/5 text-gray-400'
                                            }`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT PRODUCTS GRID */}
                    <div className="flex-1 min-w-0 space-y-4">
                        {/* SPECIAL FREE DELIVERY CART SHORTCUT BANNER */}
                        {cartItems.length > 0 && (
                            <div className="bg-gradient-to-r from-amber-500/15 via-[#18181c] to-orange-500/15 border border-amber-500/30 rounded-2xl p-3.5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black font-black text-sm shrink-0 shadow-md">
                                        🛵
                                    </div>
                                    <div>
                                        {totalCartAmount < 299 ? (
                                            <>
                                                <p className="text-xs font-black text-white">
                                                    Add <span className="text-amber-400">₹{299 - totalCartAmount} more</span> to get <span className="text-emerald-400">FREE Village Delivery!</span>
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">
                                                    Order ₹299+ pe delivery fee bilkul ₹0 (Cart: {totalCartCount} items • ₹{totalCartAmount})
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                                                    <span>🎉 FREE Delivery Unlocked!</span>
                                                    <span className="text-[10px] text-gray-300 font-normal">• Village Express Dispatch</span>
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">
                                                    Your cart is eligible for zero delivery fee ({totalCartCount} items • ₹{totalCartAmount})
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                    <Link
                                        to="/cart"
                                        className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition-all"
                                    >
                                        View Cart
                                    </Link>
                                    <Link
                                        to="/checkout"
                                        className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-xs rounded-xl shadow-md transition-all"
                                    >
                                        Checkout →
                                    </Link>
                                </div>
                            </div>
                        )}
                        {/* Section Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                            <div>
                                <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                                    <span>{selectedCategory === 'All' ? 'All Delicacies' : selectedCategory}</span>
                                    <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                                        {filteredFoods.length} items
                                    </span>
                                </h1>
                                <p className="text-xs text-gray-400 mt-0.5">Freshly prepared with authentic ingredients</p>
                            </div>

                            {/* Reset Filters shortcut */}
                            {(searchTerm || selectedCategory !== 'All' || vegFilter !== 'all' || under199Only) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('All');
                                        setVegFilter('all');
                                        setUnder199Only(false);
                                    }}
                                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    Reset Filters
                                </button>
                            )}
                        </div>

                        {/* Loading Skeletons */}
                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-[#121214] border border-white/5 rounded-2xl p-3 space-y-3 animate-pulse">
                                        <div className="w-full aspect-square bg-white/5 rounded-xl"></div>
                                        <div className="h-4 bg-white/5 rounded w-3/4"></div>
                                        <div className="h-3 bg-white/5 rounded w-1/2"></div>
                                        <div className="flex justify-between items-center pt-2">
                                            <div className="h-5 bg-white/5 rounded w-16"></div>
                                            <div className="h-8 bg-white/5 rounded w-16"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredFoods.length === 0 ? (
                            /* Empty State */
                            <div className="py-20 text-center bg-[#111114] border border-white/5 rounded-3xl p-8 space-y-3">
                                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-2xl text-amber-400">
                                    <Utensils className="w-7 h-7" />
                                </div>
                                <h3 className="text-lg font-bold text-white">No dishes found</h3>
                                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                                    We couldn't find any dishes matching "{searchTerm || selectedCategory}". Try clearing your filters or browse our full menu.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('All');
                                        setVegFilter('all');
                                        setUnder199Only(false);
                                    }}
                                    className="mt-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-amber-500/10"
                                >
                                    Browse Full Menu
                                </button>
                            </div>
                        ) : (
                            /* PRODUCT CARDS (Styled with Star7Foodies Brand Colors) */
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                                {filteredFoods.map((item) => {
                                    const itemId = item._id || item.id;
                                    const rawP = item.rawPortion || item.portion;
                                    const hasPortions = rawP && typeof rawP === 'object' && (Number(rawP.half) > 0 || Number(rawP.full) > 0);
                                    const itemsInCartForDish = cartItems.filter(it => (it._id || it.id) === itemId);
                                    const totalQtyForDish = itemsInCartForDish.reduce((sum, it) => sum + (it.quantity || 1), 0);
                                    const qty = totalQtyForDish;
                                    const isVeg = item.isVeg !== undefined ? item.isVeg : true;
                                    const imageUrl = item.image_url || item.imageUrl || item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop";
                                    const isFavorited = wishlist[itemId];

                                    return (
                                        <div
                                            key={itemId}
                                            className="group bg-[#121215] hover:bg-[#16161a] border border-white/5 hover:border-amber-500/30 rounded-2xl p-2.5 md:p-3 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-amber-950/20 relative"
                                        >
                                            <div>
                                                {/* Top Image & Details Container - Click to View Dish Details */}
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => navigate(`/dish/${itemId}`)}
                                                    title={`View details for ${item.name}`}
                                                >
                                                    {/* Top Image Container */}
                                                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-900 mb-2.5">
                                                        <img
                                                            src={imageUrl}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop";
                                                            }}
                                                        />

                                                        {/* Top Overlay Badges */}
                                                        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                                            {/* Veg / Non-Veg Indicator */}
                                                            <div className="w-4 h-4 bg-black/60 backdrop-blur-md rounded border border-white/20 flex items-center justify-center p-[2px]">
                                                                {isVeg ? (
                                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
                                                                ) : (
                                                                    <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-rose-500"></span>
                                                                )}
                                                            </div>

                                                            {/* Bestseller Badge */}
                                                            {item.isBestseller && (
                                                                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                                                                    <Flame className="w-2.5 h-2.5 fill-black" />
                                                                    HOT
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Favorite Heart Button (Disabled for now, preserved for future) */}
                                                        {SHOW_WISHLIST_BUTTON && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleWishlist(itemId);
                                                                }}
                                                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-300 hover:text-red-500 transition-all cursor-pointer"
                                                                title="Add to Wishlist"
                                                            >
                                                                <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'text-red-500 fill-red-500' : ''}`} />
                                                            </button>
                                                        )}

                                                        {/* Delivery Time Pill */}
                                                        <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-md border border-white/10 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                                            <Clock className="w-2.5 h-2.5 text-amber-400" />
                                                            <span>{item.time || "25-28 mins"}</span>
                                                        </div>

                                                        {/* Discount Tag (Disabled for now, preserved for future) */}
                                                        {SHOW_DISCOUNT_BADGES && item.discount && (
                                                            <div className="absolute bottom-2 right-2 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                                                                {item.discount}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Dish Title & Portion */}
                                                    <div>
                                                        <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-0.5">
                                                            <span>{item.portionText || (typeof item.portion === 'string' ? item.portion : "Standard Serving")}</span>
                                                            {item.rating && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span className="flex items-center text-amber-400 font-semibold">
                                                                        <Star className="w-2.5 h-2.5 fill-amber-400 mr-0.5" />
                                                                        {item.rating}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>

                                                        <h3 className="font-bold text-white text-xs md:text-sm line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
                                                            {item.name}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price Row & Brand-Themed ADD Button */}
                                            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                                                <div>
                                                    <div className="text-sm md:text-base font-extrabold text-amber-400">
                                                        ₹{item.price}
                                                    </div>
                                                    {item.originalPrice && item.originalPrice > item.price && (
                                                        <div className="text-[10px] text-gray-500 line-through">
                                                            ₹{item.originalPrice}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* ADD / Quantity Counter Button */}
                                                <div>
                                                    {hasPortions ? (
                                                        totalQtyForDish === 0 ? (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleAddItem(item);
                                                                }}
                                                                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 border border-amber-500/40 hover:border-amber-500 text-amber-400 hover:text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-sm flex items-center gap-1 cursor-pointer"
                                                            >
                                                                <span>ADD</span>
                                                                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                                            </button>
                                                        ) : (
                                                            <div className="flex flex-col items-end gap-1">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setPortionModalDish({
                                                                            ...item,
                                                                            portion: rawP
                                                                        });
                                                                    }}
                                                                    className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                                                                    title="Click to add another half or full plate portion"
                                                                >
                                                                    <span>{totalQtyForDish} in cart</span>
                                                                    <span className="text-[10px] font-black bg-black/20 text-black px-1.5 py-0.5 rounded-md">+ Add</span>
                                                                </button>
                                                                <span className="text-[9px] text-amber-400 font-semibold truncate max-w-[120px]">
                                                                    {itemsInCartForDish.map(it => `${it.portion}: ${it.quantity}`).join(', ')}
                                                                </span>
                                                            </div>
                                                        )
                                                    ) : (
                                                        qty === 0 ? (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleAddItem(item);
                                                                }}
                                                                className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500 border border-amber-500/40 hover:border-amber-500 text-amber-400 hover:text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 shadow-sm flex items-center gap-1 cursor-pointer"
                                                            >
                                                                <span>ADD</span>
                                                                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                                            </button>
                                                        ) : (
                                                            <div className="flex items-center bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black rounded-xl overflow-hidden shadow-md shadow-amber-500/20">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        dispatch(removeFromCart(itemId));
                                                                    }}
                                                                    className="px-2 py-1.5 hover:bg-black/15 transition-colors cursor-pointer"
                                                                    title="Decrease"
                                                                >
                                                                    <Minus className="w-3.5 h-3.5 stroke-[3]" />
                                                                </button>
                                                                <span className="px-2 text-xs select-none">
                                                                    {qty}
                                                                </span>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleAddItem(item);
                                                                    }}
                                                                    className="px-2 py-1.5 hover:bg-black/15 transition-colors cursor-pointer"
                                                                    title="Increase"
                                                                >
                                                                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
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
                        )}
                    </div>
                </div>
            </div>

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

export default Menu;
