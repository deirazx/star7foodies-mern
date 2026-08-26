import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { myOrders } from '../Api/axios';

const MyOrders = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const filters = ['All', 'In Progress', 'Delivered', 'Cancelled'];

    const mockOrders = [
        {
            id: '6A7452DADF804B431B4E8495',
            date: 'Aug 6, 2026',
            status: 'PENDING',
            statusColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
            statusIcon: <FaClock className="text-[10px] animate-pulse" />,
            total: 1997,
            address: '123 Main Street, Sector 4, Noida, Uttar Pradesh, 201301',
            items: [
                {
                    name: 'Gourmet Cheese Pizza',
                    category: 'SINGLE SERVING',
                    qty: 2,
                    price: 998,
                    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=80'
                }
            ]
        },
        {
            id: '6A7744154736323D15DC5064',
            date: 'Aug 8, 2026',
            status: 'PENDING',
            statusColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
            statusIcon: <FaClock className="text-[10px] animate-pulse" />,
            total: 90,
            address: '123 Main Street, Sector 4, Noida, Uttar Pradesh, 201301',
            items: [
                {
                    name: 'Chocolate Lava Cake',
                    category: 'SINGLE SERVING',
                    qty: 1,
                    price: 90,
                    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=80'
                }
            ]
        },
        {
            id: '6A7892154736323D15DC8910',
            date: 'Aug 10, 2026',
            status: 'DELIVERED',
            statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
            statusIcon: null,
            total: 350,
            address: '123 Main Street, Sector 4, Noida, Uttar Pradesh, 201301',
            items: [
                {
                    name: 'Veg Loaded Burger',
                    category: 'DOUBLE SERVING',
                    qty: 2,
                    price: 150,
                    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=80'
                },
                {
                    name: 'Crispy French Fries',
                    category: 'SINGLE SERVING',
                    qty: 1,
                    price: 50,
                    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=80'
                }
            ]
        }
    ];

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await myOrders();
                const fetchedOrders = response?.orders || response || [];
                setOrders(fetchedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Helper to format database status into styling
    const getStatusStyle = (status) => {
        const lower = status ? status.toLowerCase() : 'pending';
        if (lower === 'delivered') {
            return {
                text: 'DELIVERED',
                color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
                icon: null
            };
        } else if (lower === 'cancelled') {
            return {
                text: 'CANCELLED',
                color: 'text-red-500 bg-red-500/10 border-red-500/20',
                icon: null
            };
        } else {
            return {
                text: status ? status.toUpperCase() : 'PENDING',
                color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
                icon: <FaClock className="text-[10px] animate-pulse" />
            };
        }
    };

    // Fallback to mockOrders if backend returns empty list (design preview fallback)
    const displayOrders = orders && orders.length > 0 ? orders : mockOrders;

    const filteredOrders = displayOrders.filter(order => {
        const statusText = order.status ? order.status.toLowerCase() : '';
        if (activeFilter === 'All') return true;
        if (activeFilter === 'In Progress') {
            return statusText === 'pending' || statusText === 'preparing' || statusText === 'out for delivery';
        }
        if (activeFilter === 'Delivered') return statusText === 'delivered';
        if (activeFilter === 'Cancelled') return statusText === 'cancelled';
        return true;
    });

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-[#0a0a0b] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div 
                className="absolute top-1/4 left-1/2 -translate-x-1/2 rounded-full blur-3xl pointer-events-none"
                style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(245,158,11,0.03) 0%, rgba(0,0,0,0) 70%)' }}
            ></div>

            <div className="max-w-6xl mx-auto space-y-10 relative z-10 animate-fadeIn">
                {/* Header with Filter Pills */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-white">My Orders</h1>
                        <p className="text-xs sm:text-sm text-gray-400">Track your active orders and review order history.</p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2.5">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                                    activeFilter === filter
                                        ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-orange-500/20'
                                        : 'bg-[#121214] border-white/5 text-gray-300 hover:text-white hover:border-white/10'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List Container */}
                <div className="space-y-6">
                    {filteredOrders.map((order, idx) => {
                        const statusObj = getStatusStyle(order.status);
                        const orderId = order._id || order.id;
                        const orderDate = order.createdAt 
                            ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : order.date;
                        const totalCartPrice = order.totalCartPrice || order.total;
                        
                        // Address string builder
                        let addressString = order.address;
                        if (typeof order.address === 'object' && order.address !== null) {
                            addressString = `${order.address.street || ''}, ${order.address.city || ''}, ${order.address.state || ''} - ${order.address.postalCode || ''}`;
                        }

                        return (
                            <div 
                                key={orderId} 
                                style={{ animationDelay: `${idx * 0.05}s` }}
                                className="bg-[#121214]/60 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl hover:border-white/20 transition-all duration-300 animate-slideUp"
                            >
                                {/* Card Top Row: ID, Status and Total */}
                                <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-white/5">
                                    <div className="space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <span className="text-xs text-gray-300 font-bold tracking-wide">
                                                ID: <span className="text-white">{orderId}</span>
                                            </span>
                                            <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase rounded-full border flex items-center gap-1 ${statusObj.color}`}>
                                                {statusObj.icon}
                                                {statusObj.text}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-400 flex items-center gap-1.5 font-medium">
                                            <FaCalendarAlt className="text-[10px]" />
                                            Placed on {orderDate}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Total Amount</span>
                                        <span className="text-xl font-black text-amber-500">₹{totalCartPrice}</span>
                                    </div>
                                </div>

                                {/* Card Middle Row: Items List */}
                                <div className="space-y-4">
                                    {order.items.map((item, itemIdx) => {
                                        const itemName = item.productId?.name || item.name;
                                        const itemImage = item.productId?.image || item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80";
                                        const itemCategory = item.portion || item.category || "SINGLE SERVING";
                                        const itemQty = item.qnty || item.qty || 1;
                                        const itemPrice = item.price;

                                        return (
                                            <div key={itemIdx} className="flex justify-between items-center gap-4 py-1">
                                                <div className="flex items-center gap-4">
                                                    <img 
                                                        src={itemImage} 
                                                        alt={itemName} 
                                                        className="w-14 h-14 rounded-xl object-cover border border-white/10"
                                                    />
                                                    <div className="space-y-0.5">
                                                        <h4 className="text-sm font-black text-white tracking-tight">{itemName}</h4>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                            {itemCategory} <span className="text-gray-600 px-1">|</span> Qty: {itemQty}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-black text-white">₹{itemPrice * itemQty}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Card Bottom Row: Location and Action Link */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5 text-xs">
                                    <p className="text-gray-400 flex items-start gap-1.5 leading-relaxed font-medium">
                                        <FaMapMarkerAlt className="text-amber-500 shrink-0 mt-0.5" />
                                        <span>{addressString}</span>
                                    </p>

                                    <button className="text-amber-500 hover:text-amber-400 font-bold uppercase text-[10px] tracking-wider transition-colors shrink-0 flex items-center gap-1 cursor-pointer bg-transparent border-none">
                                        Track Order Details →
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12 bg-[#121214]/30 border border-dashed border-white/10 rounded-2xl space-y-2">
                            <p className="text-sm text-gray-400 font-medium">No orders found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
