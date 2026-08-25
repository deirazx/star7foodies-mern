import React, { useState, useEffect } from 'react';
import {
    FaStar,
    FaLeaf,
    FaFilter,
    FaArrowRight,
    FaMotorcycle,
    FaShieldAlt,
    FaTrash,
    FaPercent,
    FaRegDotCircle
} from 'react-icons/fa';
import { allFoods } from '../Api/axios';

const FOODS = [
    {
        id: 1,
        name: "Special Chicken Biryani",
        category: "Biryani",
        price: 289,
        rating: 4.6,
        time: "25-30 mins",
        isVeg: false,
        desc: "Fragrant basmati rice layered with juicy marinated chicken, aromatic spices, and caramelized onions.",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60",
        discount: "60% OFF",
        bestseller: true
    },
    {
        id: 2,
        name: "Double Cheese Margherita Pizza",
        category: "Pizza",
        price: 199,
        rating: 4.4,
        time: "15-20 mins",
        isVeg: true,
        desc: "Classic delight with 100% real mozzarella cheese, fresh basil leaves, and tangy tomato sauce.",
        image: "https://images.unsplash.com/photo-1601924582970-9238b4ead50c?w=500&auto=format&fit=crop&q=60",
        discount: "₹50 OFF",
        bestseller: false
    },
    {
        id: 3,
        name: "Spicy Crunch Chicken Burger",
        category: "Burger",
        price: 149,
        rating: 4.3,
        time: "20-25 mins",
        isVeg: false,
        desc: "Crispy chicken patty topped with fresh lettuce, onions, and spicy chipotle sauce in soft brioche buns.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
        discount: "20% OFF",
        bestseller: true
    },
    {
        id: 4,
        name: "Paneer Butter Masala Combo",
        category: "Thali",
        price: 229,
        rating: 4.5,
        time: "30-35 mins",
        isVeg: true,
        desc: "Rich paneer cubes cooked in a sweet & creamy tomato gravy. Served with 2 butter naans.",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60",
        discount: "Buy 1 Get 1",
        bestseller: false
    },
    {
        id: 5,
        name: "Premium Chocolate Fudge Cake",
        category: "Dessert",
        price: 179,
        rating: 4.7,
        time: "10-15 mins",
        isVeg: true,
        desc: "Delectable, rich chocolate sponge cake loaded with smooth chocolate ganache and chocolate chips.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60",
        discount: "10% OFF",
        bestseller: true
    }
];

const CATEGORIES = [
    { name: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=60" },
    { name: "Pizza", image: "https://images.unsplash.com/photo-1601924582970-9238b4ead50c?w=150&auto=format&fit=crop&q=60" },
    { name: "Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=60" },
    { name: "Thali", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=150&auto=format&fit=crop&q=60" },
    { name: "Dessert", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&auto=format&fit=crop&q=60" }
];

const Home = ({ cartItems, handleAddToCart, handleRemoveFromCart, clearCart }) => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [vegOnly, setVegOnly] = useState(false);
    const [highRatedOnly, setHighRatedOnly] = useState(false);
    const [sortByPrice, setSortByPrice] = useState(""); // "asc", "desc", or ""

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                setLoading(true);
                const data = await allFoods();
                const productsList = data.items || [];
                setFoods(productsList);
            } catch (err) {
                console.error("Error loading foods:", err);
                setError(err.message);
                // Fallback to static mock foods if API fails/empty to keep layout rich
                setFoods(FOODS);
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

    const totalCartItems = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
    const totalCartPrice = Object.entries(cartItems).reduce((sum, [id, qty]) => {
        const food = foods.find(f => f._id === id || f.id === parseInt(id));
        return sum + (food ? food.price * qty : 0);
    }, 0);

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
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-6 flex flex-col justify-center h-44 shadow-lg shadow-orange-500/10 group cursor-pointer">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-12 -translate-y-12 transition-transform duration-500 group-hover:scale-110"></div>
                    <div className="z-10 flex flex-col gap-2">
                        <div>
                            <span className="bg-black/30 backdrop-blur-md text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full text-white">
                                Special Deal
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black leading-tight text-white">
                            50% OFF ON YOUR FIRST ORDER
                        </h2>
                        <div className="flex items-center justify-between gap-4 mt-1">
                            <p className="text-xs text-white/90">Use Code: <span className="font-bold border-b border-dashed border-white">STAR7WELCOME</span></p>
                            <button className="flex items-center gap-1 bg-black text-white hover:bg-white hover:text-black transition-all px-4 py-1.5 rounded-full text-xs font-bold shadow-md cursor-pointer shrink-0">
                                Order Now <FaArrowRight className="text-[10px]" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Banner 2 */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 flex flex-col justify-center h-44 shadow-lg shadow-teal-500/10 group cursor-pointer">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-12 -translate-y-12 transition-transform duration-500 group-hover:scale-110"></div>
                    <div className="z-10 flex flex-col gap-2">
                        <div>
                            <span className="bg-black/30 backdrop-blur-md text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full text-white">
                                Free Delivery
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black leading-tight text-white">
                            FREE DELIVERY ON ALL DISHES
                        </h2>
                        <div className="flex items-center justify-between gap-4 mt-1">
                            <p className="text-xs text-white/90">On orders above ₹199. Fast delivery guaranteed.</p>
                            <button className="flex items-center gap-1 bg-black text-white hover:bg-white hover:text-black transition-all px-4 py-1.5 rounded-full text-xs font-bold shadow-md cursor-pointer shrink-0">
                                Check Dishes <FaArrowRight className="text-[10px]" />
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

                {filteredFoods.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {filteredFoods.map((food) => {
                            const foodId = food._id || food.id;
                            const qty = cartItems[foodId] || 0;
                            const rating = food.rating || (4.0 + (food.name.length % 10) / 10).toFixed(1);
                            const time = food.time || ((food.price % 15) + 15) + " mins";
                            const isVeg = food.isVeg !== undefined ? food.isVeg : !(/chicken|beef|meat|mutton|pork|fish|egg/i.test(food.name));
                            const imageUrl = food.imageUrl || food.image;
                            const description = food.description || food.desc;
                            const discount = food.discount || (food.price > 200 ? "20% OFF" : "10% OFF");
                            const bestseller = food.bestseller !== undefined ? food.bestseller : (rating >= 4.5);

                            return (
                                <div
                                    key={foodId}
                                    className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/30 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 group flex flex-col justify-between"
                                >
                                    {/* Image Section */}
                                    <div className="relative w-full h-44 overflow-hidden">
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
                                        <div className="space-y-1.5">
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

                                            {/* Interactive Swiggy Style ADD button */}
                                            {qty === 0 ? (
                                                <button
                                                    onClick={() => handleAddToCart(foodId)}
                                                    className="px-4 py-1.5 border border-amber-500/40 hover:border-amber-500 text-amber-500 font-black text-xs bg-amber-500/5 hover:bg-amber-500 hover:text-white rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                                >
                                                    ADD
                                                </button>
                                            ) : (
                                                <div className="flex items-center bg-amber-500 text-white rounded-lg overflow-hidden shadow-md">
                                                    <button
                                                        onClick={() => handleRemoveFromCart(foodId)}
                                                        className="px-2.5 py-1.5 hover:bg-amber-600 transition-all font-bold text-xs cursor-pointer"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-2 font-bold text-xs min-w-[16px] text-center">
                                                        {qty}
                                                    </span>
                                                    <button
                                                        onClick={() => handleAddToCart(foodId)}
                                                        className="px-2.5 py-1.5 hover:bg-amber-600 transition-all font-bold text-xs cursor-pointer"
                                                    >
                                                        +
                                                    </button>
                                                </div>
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

            {/* SECTION 6: INTERACTIVE BOTTOM DRAWER (Blinkit style cart preview) */}
            {totalCartItems > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-3 rounded-2xl flex items-center justify-between shadow-2xl z-[1000] animate-slideUp">
                    <div className="flex items-center gap-3">
                        <div className="bg-black/20 p-2 rounded-xl text-white">
                            <FaShoppingBag className="text-sm" />
                        </div>
                        <div>
                            <span className="text-xs font-black block leading-none">
                                {totalCartItems} {totalCartItems === 1 ? 'Item' : 'Items'} added
                            </span>
                            <span className="text-[10px] text-white/80 font-medium">
                                Total: ₹{totalCartPrice}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={clearCart}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all text-xs flex items-center gap-1 font-semibold cursor-pointer"
                        >
                            <FaTrash className="text-[10px]" /> Clear
                        </button>
                        <button
                            onClick={() => alert(`Order Proceeded!\nTotal items: ${totalCartItems}\nTotal amount: ₹${totalCartPrice}`)}
                            className="bg-black hover:bg-white hover:text-black transition-all px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1 cursor-pointer"
                        >
                            View Cart <FaArrowRight className="text-[10px]" />
                        </button>
                    </div>
                </div>
            )}

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
        </div>
    );
};

export default Home;
