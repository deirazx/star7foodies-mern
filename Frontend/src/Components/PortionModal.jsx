import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, ShoppingBag, Utensils } from 'lucide-react';

const PortionModal = ({ isOpen, dish, onClose, onAddToCart }) => {
    const [selectedPortion, setSelectedPortion] = useState('full'); // 'half' | 'full'
    const [quantity, setQuantity] = useState(1);

    // Sync portion selection when dish changes
    useEffect(() => {
        if (dish && dish.portion) {
            if (dish.portion.full && dish.portion.half) {
                setSelectedPortion('full');
            } else if (dish.portion.full) {
                setSelectedPortion('full');
            } else if (dish.portion.half) {
                setSelectedPortion('half');
            }
        }
        setQuantity(1);
    }, [dish, isOpen]);

    if (!isOpen || !dish) return null;

    const hasHalf = Boolean(dish.portion?.half && Number(dish.portion.half) > 0);
    const hasFull = Boolean(dish.portion?.full && Number(dish.portion.full) > 0);

    const halfPrice = hasHalf ? Number(dish.portion.half) : 0;
    const fullPrice = hasFull ? Number(dish.portion.full) : Number(dish.price || 0);

    const currentPrice = selectedPortion === 'half' ? halfPrice : fullPrice;
    const currentPortionName = selectedPortion === 'half' ? 'Half' : 'Full';

    const imageUrl = dish.image_url || dish.imageUrl || dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop";
    const isVeg = dish.isVeg !== undefined ? dish.isVeg : true;

    const handleConfirmAdd = () => {
        onAddToCart({
            ...dish,
            price: currentPrice,
            portion: currentPortionName,
            selectedPortion: currentPortionName,
            quantity: quantity
        });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[2500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden animate-fadeIn"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-[#141417] border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative text-white space-y-5 animate-scaleUp">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <img
                            src={imageUrl}
                            alt={dish.name}
                            className="w-14 h-14 rounded-xl object-cover border border-white/10 bg-neutral-900 shrink-0"
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop";
                            }}
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center p-[2px] ${isVeg ? 'border-emerald-500 text-emerald-400' : 'border-rose-500 text-rose-400'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                                    {dish.category || 'Special Dish'}
                                </span>
                            </div>
                            <h3 className="font-bold text-base text-white mt-1 leading-snug line-clamp-1">
                                {dish.name}
                            </h3>
                            <p className="text-xs text-gray-400">Please choose your preferred portion size</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Portion Selector Options */}
                <div className="space-y-3">
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Select Portion Size <span className="text-amber-400">*</span>
                    </label>

                    <div className="grid grid-cols-1 gap-2.5">
                        {/* Half Portion Option */}
                        {hasHalf && (
                            <button
                                type="button"
                                onClick={() => setSelectedPortion('half')}
                                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                    selectedPortion === 'half'
                                        ? 'bg-amber-500/10 border-amber-500/80 shadow-md shadow-amber-500/10'
                                        : 'bg-[#18181c] border-white/5 hover:border-white/20'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                        selectedPortion === 'half'
                                            ? 'border-amber-400 bg-amber-500 text-black'
                                            : 'border-gray-500 bg-transparent'
                                    }`}>
                                        {selectedPortion === 'half' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-white flex items-center gap-2">
                                            <span>Half Portion</span>
                                            <span className="text-[10px] text-gray-400 font-normal">(Single person)</span>
                                        </p>
                                        <p className="text-[11px] text-gray-400">Regular individual serving</p>
                                    </div>
                                </div>
                                <span className="font-black text-amber-400 text-base">₹{halfPrice}</span>
                            </button>
                        )}

                        {/* Full Portion Option */}
                        {hasFull && (
                            <button
                                type="button"
                                onClick={() => setSelectedPortion('full')}
                                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                    selectedPortion === 'full'
                                        ? 'bg-amber-500/10 border-amber-500/80 shadow-md shadow-amber-500/10'
                                        : 'bg-[#18181c] border-white/5 hover:border-white/20'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                        selectedPortion === 'full'
                                            ? 'border-amber-400 bg-amber-500 text-black'
                                            : 'border-gray-500 bg-transparent'
                                    }`}>
                                        {selectedPortion === 'full' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-white flex items-center gap-2">
                                            <span>Full Portion</span>
                                            <span className="text-[10px] text-amber-400/90 font-bold bg-amber-500/15 px-1.5 py-0.2 rounded">Recommended</span>
                                        </p>
                                        <p className="text-[11px] text-gray-400">Generous plate feast (Full serving)</p>
                                    </div>
                                </div>
                                <span className="font-black text-amber-400 text-base">₹{fullPrice}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div>
                        <span className="text-xs text-gray-400 block">Quantity</span>
                        <div className="flex items-center bg-[#1c1c20] border border-white/10 rounded-xl overflow-hidden mt-1 shadow-inner">
                            <button
                                type="button"
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                                title="Decrease quantity"
                            >
                                <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 font-bold text-sm text-white select-none min-w-[28px] text-center">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={() => setQuantity(q => q + 1)}
                                className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                                title="Increase quantity"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className="text-xs text-gray-400 block">Total Amount</span>
                        <span className="text-xl font-black text-amber-400 mt-0.5 block">
                            ₹{currentPrice * quantity}
                        </span>
                    </div>
                </div>

                {/* Modal Confirm Action */}
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={handleConfirmAdd}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold rounded-xl text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                        <span>Add {quantity > 1 ? `${quantity} Items` : 'Item'} to Cart • ₹{currentPrice * quantity}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PortionModal;
