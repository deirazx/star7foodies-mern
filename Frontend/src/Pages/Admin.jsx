import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    getAdminProducts,
    createProductApi,
    updateProductApi,
    deleteProductApi,
    toggleProductStatusApi,
    allOrders,
    updateOrderStatusApi
} from '../Api/axios';
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    CheckCircle2,
    ShoppingBag,
    Utensils,
    Package,
    RefreshCw,
    X,
    UploadCloud,
    SlidersHorizontal,
    AlertCircle,
    Archive,
    Clock,
    MapPin,
    Phone,
    User,
    Copy,
    Check,
    ChevronDown,
    Calendar,
    DollarSign,
    Printer,
    Truck,
    ChefHat,
    Filter,
    ArrowUpDown,
    ExternalLink,
    Eye
} from 'lucide-react';

const CATEGORIES = [
    "All",
    "Indian Veg",
    "Egg",
    "Roll",
    "Rice",
    "Paneer Tadka",
    "Slad/Raita",
    "Roti Pratha",
    "Noodles",
    "Soup",
    "Lollypope",
    "Chinese Spice",
    "Star7 Thali",
    "Chicken",
    "Snacks",
    "Pizza"
];

const ORDER_STATUS_MAP = {
    Pending: {
        label: "Pending Confirmation",
        shortLabel: "Pending",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        text: "text-amber-400",
        badgeBg: "bg-amber-500/15 border-amber-500/40 text-amber-300",
        dot: "bg-amber-400 animate-pulse",
        next: "Preparing",
        nextLabel: "Start Preparing",
        nextBtnBg: "bg-sky-500 hover:bg-sky-600 text-black font-semibold shadow-sky-500/20"
    },
    Preparing: {
        label: "Preparing in Kitchen",
        shortLabel: "Preparing",
        bg: "bg-sky-500/10",
        border: "border-sky-500/30",
        text: "text-sky-400",
        badgeBg: "bg-sky-500/15 border-sky-500/40 text-sky-300",
        dot: "bg-sky-400 animate-pulse",
        next: "Out for Delivery",
        nextLabel: "Send for Delivery",
        nextBtnBg: "bg-purple-500 hover:bg-purple-600 text-white font-semibold shadow-purple-500/20"
    },
    "Out for Delivery": {
        label: "Out for Delivery",
        shortLabel: "In Transit",
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
        text: "text-purple-400",
        badgeBg: "bg-purple-500/15 border-purple-500/40 text-purple-300",
        dot: "bg-purple-400 animate-pulse",
        next: "Delivered",
        nextLabel: "Mark as Delivered",
        nextBtnBg: "bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-emerald-500/20"
    },
    Delivered: {
        label: "Delivered Successfully",
        shortLabel: "Delivered",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
        badgeBg: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
        dot: "bg-emerald-400",
        next: null,
        nextLabel: null,
        nextBtnBg: ""
    },
    Cancelled: {
        label: "Cancelled",
        shortLabel: "Cancelled",
        bg: "bg-rose-500/10",
        border: "border-rose-500/30",
        text: "text-rose-400",
        badgeBg: "bg-rose-500/15 border-rose-500/40 text-rose-300",
        dot: "bg-rose-400",
        next: null,
        nextLabel: null,
        nextBtnBg: ""
    }
};

const ORDER_STATUS_TABS = [
    { id: "all", label: "All Orders" },
    { id: "Pending", label: "Pending" },
    { id: "Preparing", label: "Preparing" },
    { id: "Out for Delivery", label: "Out for Delivery" },
    { id: "Delivered", label: "Delivered" },
    { id: "Cancelled", label: "Cancelled" }
];

const formatOrderDate = (dateString) => {
    if (!dateString) return "Recent";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Recent";
    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    const seconds = Math.floor((new Date() - d) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return "";
};

const Admin = () => {
    const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'orders'

    // Menu Items State
    const [menuItems, setMenuItems] = useState([]);
    const [menuStats, setMenuStats] = useState({ total: 0, available: 0, unavailable: 0 });
    const [loadingMenu, setLoadingMenu] = useState(false);
    const [menuError, setMenuError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'available' | 'unavailable'
    const [togglingId, setTogglingId] = useState(null);

    // Orders State & Filters
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [ordersError, setOrdersError] = useState(null);
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [orderPeriod, setOrderPeriod] = useState('all'); // 'all' | 'today' | 'month'
    const [orderSearchTerm, setOrderSearchTerm] = useState('');
    const [orderSort, setOrderSort] = useState('newest'); // 'newest' | 'oldest' | 'amount-high' | 'amount-low'
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [copiedOrderId, setCopiedOrderId] = useState(null);
    const [activeKOTOrder, setActiveKOTOrder] = useState(null);
    const [underDevFeature, setUnderDevFeature] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Form Fields
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Main Course',
        is_available: true,
        image_url: '',
        halfPortion: '',
        fullPortion: '',
        tags: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // Fetch Menu Items
    const fetchMenu = useCallback(async () => {
        setLoadingMenu(true);
        setMenuError(null);
        try {
            const params = {};
            if (searchTerm.trim()) params.search = searchTerm.trim();
            if (selectedCategory !== 'All') params.category = selectedCategory;
            if (statusFilter !== 'all') params.status = statusFilter;

            const res = await getAdminProducts(params);
            setMenuItems(res.items || []);
            if (res.stats) {
                setMenuStats(res.stats);
            }
        } catch (err) {
            console.error("Error fetching admin menu:", err);
            setMenuError(err.message || "Failed to load menu items");
        } finally {
            setLoadingMenu(false);
        }
    }, [searchTerm, selectedCategory, statusFilter]);

    // Fetch Orders
    const fetchOrdersList = useCallback(async () => {
        setLoadingOrders(true);
        setOrdersError(null);
        try {
            const data = await allOrders();
            setOrders(data.orders || data.items || data || []);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setOrdersError(err.message || "Failed to load orders");
        } finally {
            setLoadingOrders(false);
        }
    }, []);

    // Load Menu on filter/search change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMenu();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchMenu]);

    // Load Orders when tab changes
    useEffect(() => {
        if (activeTab === 'orders') {
            const timer = setTimeout(() => {
                fetchOrdersList();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [activeTab, fetchOrdersList]);

    // Update Order Status Handler
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        if (!orderId || !newStatus) return;
        if (newStatus === 'Cancelled') {
            const confirmed = window.confirm("Are you sure you want to cancel this order? It will be strictly excluded from all sales revenue.");
            if (!confirmed) return;
        }
        try {
            setUpdatingOrderId(orderId);
            await updateOrderStatusApi(orderId, newStatus);
            setOrders(prev =>
                prev.map(o => (o._id === orderId || o.id === orderId ? { ...o, status: newStatus } : o))
            );
            showSuccessBanner(`Order #${orderId.slice(-6).toUpperCase()} is now marked as "${newStatus}".`);
        } catch (err) {
            console.error("Failed to update order status:", err);
            alert(err.message || "Failed to update order status");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    // Copy Order ID to clipboard
    const handleCopyOrderId = (id) => {
        if (!id) return;
        navigator.clipboard.writeText(id);
        setCopiedOrderId(id);
        setTimeout(() => setCopiedOrderId(null), 2000);
    };

    // Order Statistics with Today, Month-to-date and Lifetime metrics
    const orderMetrics = useMemo(() => {
        const now = new Date();
        const isToday = (dateStr) => {
            if (!dateStr) return false;
            const d = new Date(dateStr);
            return (
                d.getDate() === now.getDate() &&
                d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear()
            );
        };

        const isThisMonth = (dateStr) => {
            if (!dateStr) return false;
            const d = new Date(dateStr);
            return (
                d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear()
            );
        };

        const total = orders.length;
        let pending = 0;
        let preparing = 0;
        let outForDelivery = 0;
        let delivered = 0;
        let cancelled = 0;
        let totalRevenue = 0;
        let cancelledRevenue = 0;

        let todayOrdersCount = 0;
        let todayRevenue = 0;
        let todayCancelledCount = 0;

        let monthOrdersCount = 0;
        let monthRevenue = 0;
        let monthCancelledCount = 0;

        orders.forEach(o => {
            const st = o.status || 'Pending';
            const amount = Number(o.totalCartPrice || o.totalAmount || 0);
            const created = o.createdAt;

            if (st === 'Pending') pending++;
            else if (st === 'Preparing') preparing++;
            else if (st === 'Out for Delivery') outForDelivery++;
            else if (st === 'Delivered') delivered++;
            else if (st === 'Cancelled') {
                cancelled++;
                cancelledRevenue += amount;
            }

            // Exclude Cancelled orders from all revenue totals
            if (st !== 'Cancelled') {
                totalRevenue += amount;
            }

            // Check Today's Orders
            if (isToday(created)) {
                todayOrdersCount++;
                if (st !== 'Cancelled') {
                    todayRevenue += amount;
                } else {
                    todayCancelledCount++;
                }
            }

            // Check This Month's Orders
            if (isThisMonth(created)) {
                monthOrdersCount++;
                if (st !== 'Cancelled') {
                    monthRevenue += amount;
                } else {
                    monthCancelledCount++;
                }
            }
        });

        const activeCount = pending + preparing + outForDelivery;
        const validOrdersCount = total - cancelled;
        const avgOrderValue = validOrdersCount > 0 ? Math.round(totalRevenue / validOrdersCount) : 0;

        return {
            total,
            pending,
            preparing,
            outForDelivery,
            delivered,
            cancelled,
            cancelledRevenue,
            activeCount,
            totalRevenue,
            avgOrderValue,
            todayOrdersCount,
            todayRevenue,
            todayCancelledCount,
            monthOrdersCount,
            monthRevenue,
            monthCancelledCount
        };
    }, [orders]);

    // Filtered & Sorted Orders
    const filteredOrders = useMemo(() => {
        const now = new Date();
        return orders.filter(o => {
            // Period Filter: 'today' | 'month' | 'all'
            if (orderPeriod === 'today') {
                const d = new Date(o.createdAt);
                if (
                    d.getDate() !== now.getDate() ||
                    d.getMonth() !== now.getMonth() ||
                    d.getFullYear() !== now.getFullYear()
                ) {
                    return false;
                }
            } else if (orderPeriod === 'month') {
                const d = new Date(o.createdAt);
                if (
                    d.getMonth() !== now.getMonth() ||
                    d.getFullYear() !== now.getFullYear()
                ) {
                    return false;
                }
            }

            // Status Tab Filter
            if (orderStatusFilter !== 'all' && (o.status || 'Pending') !== orderStatusFilter) {
                return false;
            }

            // Text Search Filter
            if (orderSearchTerm.trim()) {
                const term = orderSearchTerm.toLowerCase().trim();
                const idMatch = o._id?.toLowerCase().includes(term);
                const nameMatch = o.userId?.name?.toLowerCase().includes(term) || o.address?.name?.toLowerCase().includes(term);
                const phoneMatch = o.address?.phone?.toLowerCase().includes(term);
                const cityMatch = o.address?.city?.toLowerCase().includes(term) || o.address?.street?.toLowerCase().includes(term);
                const itemMatch = (o.items || []).some(it =>
                    it.name?.toLowerCase().includes(term) ||
                    it.productId?.name?.toLowerCase().includes(term)
                );

                if (!idMatch && !nameMatch && !phoneMatch && !cityMatch && !itemMatch) {
                    return false;
                }
            }

            return true;
        }).sort((a, b) => {
            if (orderSort === 'oldest') {
                return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
            }
            if (orderSort === 'amount-high') {
                return (b.totalCartPrice || b.totalAmount || 0) - (a.totalCartPrice || a.totalAmount || 0);
            }
            if (orderSort === 'amount-low') {
                return (a.totalCartPrice || a.totalAmount || 0) - (b.totalCartPrice || b.totalAmount || 0);
            }
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
    }, [orders, orderPeriod, orderStatusFilter, orderSearchTerm, orderSort]);

    // Handle Form Input Changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Open Modal for Create or Edit
    const handleOpenModal = (item = null) => {
        setFormError(null);
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name || '',
                price: item.price || '',
                description: item.description || '',
                category: item.category || 'Main Course',
                is_available: item.is_available !== undefined ? item.is_available : (item.isAvailable ?? true),
                image_url: item.image_url || item.imageUrl || '',
                halfPortion: item.portion?.half || '',
                fullPortion: item.portion?.full || '',
                tags: Array.isArray(item.productOverView) ? item.productOverView.join(', ') : ''
            });
            setPreviewUrl(item.image_url || item.imageUrl || '');
            setImageFile(null);
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                price: '',
                description: '',
                category: 'Main Course',
                is_available: true,
                image_url: '',
                halfPortion: '',
                fullPortion: '',
                tags: ''
            });
            setPreviewUrl('');
            setImageFile(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormError(null);
        setImageFile(null);
        setPreviewUrl('');
    };

    const showSuccessBanner = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 4000);
    };

    // Submit Menu Form (Create or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!formData.name.trim()) {
            setFormError("Item name is required.");
            return;
        }
        if (!formData.price || Number(formData.price) < 0) {
            setFormError("Valid positive price is required.");
            return;
        }
        if (!formData.description.trim()) {
            setFormError("Description is required.");
            return;
        }
        if (!imageFile && !formData.image_url && !editingItem) {
            setFormError("Please upload an image or provide an Image URL.");
            return;
        }

        try {
            setSubmitting(true);
            const data = new FormData();
            data.append('name', formData.name.trim());
            data.append('price', Number(formData.price));
            data.append('description', formData.description.trim());
            data.append('category', formData.category);
            data.append('is_available', formData.is_available);

            if (formData.halfPortion || formData.fullPortion) {
                const portion = {};
                if (formData.halfPortion) portion.half = Number(formData.halfPortion);
                if (formData.fullPortion) portion.full = Number(formData.fullPortion);
                data.append('portion', JSON.stringify(portion));
            }

            if (formData.tags) {
                const tagArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
                data.append('productOverView', JSON.stringify(tagArray));
            }

            if (imageFile) {
                data.append('image', imageFile);
            } else if (formData.image_url) {
                data.append('image_url', formData.image_url.trim());
            }

            if (editingItem) {
                await updateProductApi(editingItem._id || editingItem.id, data);
                showSuccessBanner(`"${formData.name}" updated successfully.`);
            } else {
                await createProductApi(data);
                showSuccessBanner(`"${formData.name}" created successfully.`);
            }

            handleCloseModal();
            fetchMenu();
        } catch (err) {
            console.error("Save error:", err);
            setFormError(err.message || "Failed to save menu item.");
        } finally {
            setSubmitting(false);
        }
    };

    // Toggle Availability / Stock Status
    const handleToggleStatus = async (item) => {
        const id = item._id || item.id;
        try {
            setTogglingId(id);
            const res = await toggleProductStatusApi(id);
            const newStatus = res.is_available !== undefined ? res.is_available : !item.is_available;
            setMenuItems(prev =>
                prev.map(p => (p._id === id || p.id === id) ? { ...p, is_available: newStatus, isAvailable: newStatus } : p)
            );
            showSuccessBanner(`"${item.name}" is now marked as ${newStatus ? 'Available' : 'Archived / Out of Stock'}.`);
            fetchMenu();
        } catch (err) {
            console.error("Failed to toggle status:", err);
            alert(err.message || "Failed to toggle status");
        } finally {
            setTogglingId(null);
        }
    };

    // Soft Delete / Archive Menu Item
    const handleDelete = async (item, permanent = false) => {
        const id = item._id || item.id;
        const confirmMsg = permanent
            ? `Permanently delete "${item.name}" from database? This cannot be undone.`
            : `Archive / Soft-delete "${item.name}"? It will be hidden from the public menu while preserving past order history.`;

        if (!window.confirm(confirmMsg)) return;

        try {
            await deleteProductApi(id, permanent);
            showSuccessBanner(permanent ? `Item permanently removed.` : `"${item.name}" archived successfully.`);
            fetchMenu();
        } catch (err) {
            alert(err.message || "Failed to delete item");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-gray-100 p-4 md:p-8 max-w-7xl mx-auto">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                            Admin Dashboard
                        </span>
                        <span className="text-xs text-gray-500">Star7Foodies Control Panel</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1 tracking-tight">
                        Restaurant Management
                    </h1>
                </div>

                {/* Tab Switcher & Action */}
                <div className="flex items-center gap-3">
                    <div className="bg-[#141416] p-1 rounded-xl border border-white/5 flex">
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'menu'
                                ? 'bg-amber-500 text-black shadow-md font-semibold'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Utensils className="w-4 h-4" />
                            Menu Items
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'orders'
                                ? 'bg-amber-500 text-black shadow-md font-semibold'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Orders ({orders.length || '•'})
                        </button>
                    </div>

                    {activeTab === 'menu' && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center gap-2 text-sm cursor-pointer"
                        >
                            <Plus className="w-4 h-4 stroke-[3]" />
                            Add Menu Item
                        </button>
                    )}
                </div>
            </div>

            {/* Notification Banner */}
            {successMessage && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>{successMessage}</span>
                    </div>
                    <button onClick={() => setSuccessMessage(null)} className="text-gray-400 hover:text-white cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* MENU MANAGEMENT TAB */}
            {activeTab === 'menu' && (
                <div className="mt-6 space-y-6">
                    {/* KPI Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
                                <span>Total Menu Items</span>
                                <Package className="w-4 h-4 text-amber-400" />
                            </div>
                            <p className="text-2xl font-bold text-white mt-2">{menuStats.total || menuItems.length}</p>
                            <span className="text-[11px] text-gray-500">In database catalogue</span>
                        </div>

                        <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
                                <span>In Stock (Available)</span>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            </div>
                            <p className="text-2xl font-bold text-emerald-400 mt-2">{menuStats.available}</p>
                            <span className="text-[11px] text-gray-500">Live on public menu</span>
                        </div>

                        <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
                                <span>Archived / Out of Stock</span>
                                <Archive className="w-4 h-4 text-rose-400" />
                            </div>
                            <p className="text-2xl font-bold text-rose-400 mt-2">{menuStats.unavailable}</p>
                            <span className="text-[11px] text-gray-500">Hidden from customers</span>
                        </div>

                        <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
                                <span>Active Categories</span>
                                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                            </div>
                            <p className="text-2xl font-bold text-white mt-2">{CATEGORIES.length - 1}</p>
                            <span className="text-[11px] text-gray-500">Filterable categories</span>
                        </div>
                    </div>

                    {/* Filter & Search Bar with Quick Stock Filters */}
                    <div className="bg-[#121214] border border-white/5 p-4 rounded-2xl space-y-4 shadow-sm">
                        {/* Quick Stock Filter Pills (Direct stock filtering so admin never has to hunt manually) */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                                    statusFilter === 'all'
                                        ? 'bg-amber-500 text-black shadow-md font-bold'
                                        : 'bg-[#18181b] text-gray-400 hover:text-white border border-white/5'
                                }`}
                            >
                                <span>All Items</span>
                                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${statusFilter === 'all' ? 'bg-black/20 text-black' : 'bg-white/5 text-gray-400'}`}>
                                    {menuStats.total || menuItems.length}
                                </span>
                            </button>

                            <button
                                onClick={() => setStatusFilter('available')}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                                    statusFilter === 'available'
                                        ? 'bg-emerald-500 text-black shadow-md font-bold'
                                        : 'bg-[#18181b] text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20'
                                }`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span>In Stock / Live</span>
                                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${statusFilter === 'available' ? 'bg-black/20 text-black' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                    {menuStats.available}
                                </span>
                            </button>

                            <button
                                onClick={() => setStatusFilter('unavailable')}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                                    statusFilter === 'unavailable'
                                        ? 'bg-rose-500 text-white shadow-md font-bold'
                                        : 'bg-[#18181b] text-rose-400 hover:bg-rose-500/10 border border-rose-500/20'
                                }`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                                <span>Out of Stock / Unavailable</span>
                                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${statusFilter === 'unavailable' ? 'bg-white/20 text-white' : 'bg-rose-500/20 text-rose-300 font-bold'}`}>
                                    {menuStats.unavailable}
                                </span>
                            </button>
                        </div>

                        {/* Search and Category Filter Row */}
                        <div className="flex flex-col md:flex-row gap-3 items-center justify-between pt-1 border-t border-white/5">
                            {/* Search Input */}
                            <div className="relative w-full md:w-80">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search by item name, category, desc..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#18181b] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Category Filter & Refresh */}
                            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="bg-[#18181b] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                                    ))}
                                </select>

                                <button
                                    onClick={fetchMenu}
                                    className="p-2 bg-[#18181b] border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-pointer flex items-center gap-1.5 text-xs"
                                    title="Refresh menu catalogue"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${loadingMenu ? 'animate-spin text-amber-400' : ''}`} />
                                    <span className="hidden sm:inline">Refresh</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items Container (Responsive: Mobile Cards + Desktop Table) */}
                    <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                        {loadingMenu ? (
                            <div className="py-20 text-center text-gray-400 space-y-2">
                                <RefreshCw className="w-8 h-8 mx-auto animate-spin text-amber-500" />
                                <p className="text-sm">Loading restaurant catalogue...</p>
                            </div>
                        ) : menuError ? (
                            <div className="py-16 text-center text-rose-400 space-y-2">
                                <AlertCircle className="w-8 h-8 mx-auto text-rose-500" />
                                <p className="text-sm">{menuError}</p>
                                <button
                                    onClick={fetchMenu}
                                    className="px-4 py-1.5 bg-rose-500/20 text-rose-300 rounded-lg text-xs font-medium hover:bg-rose-500/30 cursor-pointer"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : menuItems.length === 0 ? (
                            <div className="py-20 text-center text-gray-400 space-y-3">
                                <Utensils className="w-12 h-12 mx-auto text-gray-600" />
                                <p className="text-base font-medium text-gray-300">No menu items found</p>
                                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                                    {statusFilter !== 'all' || searchTerm
                                        ? `No items match filter "${statusFilter !== 'all' ? statusFilter : ''} ${searchTerm}".`
                                        : 'Click "Add Menu Item" above to publish a new dish.'}
                                </p>
                                {(statusFilter !== 'all' || searchTerm) && (
                                    <button
                                        onClick={() => { setStatusFilter('all'); setSearchTerm(''); }}
                                        className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-semibold hover:bg-amber-500 hover:text-black transition-all cursor-pointer"
                                    >
                                        Reset Menu Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* ── MOBILE VIEW: Touch-friendly cards for smartphone users (< md) ── */}
                                <div className="block md:hidden divide-y divide-white/5">
                                    {menuItems.map((item) => {
                                        const isAvailable = item.is_available !== undefined ? item.is_available : (item.isAvailable ?? true);
                                        const imageUrl = item.image_url || item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop";
                                        const isThisToggling = togglingId === (item._id || item.id);

                                        return (
                                            <div
                                                key={item._id || item.id}
                                                className={`p-4 space-y-3 transition-colors ${!isAvailable ? 'bg-rose-950/10 opacity-75' : ''}`}
                                            >
                                                {/* Top row: Image, Name, Category, Price */}
                                                <div className="flex items-start gap-3">
                                                    <img
                                                        src={imageUrl}
                                                        alt={item.name}
                                                        className="w-16 h-16 rounded-xl object-cover bg-neutral-900 border border-white/10 shrink-0"
                                                        onError={(e) => {
                                                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop";
                                                        }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <h4 className="font-semibold text-white text-sm truncate">{item.name}</h4>
                                                            <span className="font-bold text-amber-400 text-sm shrink-0">
                                                                ₹{Number(item.price).toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <span className="inline-block mt-1 px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] text-gray-300">
                                                            {item.category || "General"}
                                                        </span>
                                                        <p className="text-xs text-gray-400 line-clamp-1 mt-1">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Bottom row: Stock Toggle Button & Actions */}
                                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                                                    {/* Easy 1-tap Stock Toggle Button */}
                                                    <button
                                                        disabled={isThisToggling}
                                                        onClick={() => handleToggleStatus(item)}
                                                        className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                                                            isAvailable
                                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                                                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                                                        }`}
                                                    >
                                                        {isThisToggling ? (
                                                            <>
                                                                <RefreshCw className="w-3 h-3 animate-spin" />
                                                                <span>Updating...</span>
                                                            </>
                                                        ) : isAvailable ? (
                                                            <>
                                                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                                <span>In Stock (Tap to Disable)</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="w-2 h-2 rounded-full bg-rose-400" />
                                                                <span>Out of Stock (Tap to Enable)</span>
                                                            </>
                                                        )}
                                                    </button>

                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleOpenModal(item)}
                                                            className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all cursor-pointer"
                                                            title="Edit Menu Item"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item, false)}
                                                            className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                                                            title="Archive / Soft Delete"
                                                        >
                                                            <Archive className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* ── DESKTOP VIEW: Full table for larger screens (>= md) ── */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead>
                                            <tr className="border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider bg-white/[0.02]">
                                                <th className="py-3.5 px-4 font-semibold">Item & Details</th>
                                                <th className="py-3.5 px-4 font-semibold">Category</th>
                                                <th className="py-3.5 px-4 font-semibold">Price</th>
                                                <th className="py-3.5 px-4 font-semibold">Stock Status</th>
                                                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {menuItems.map((item) => {
                                                const isAvailable = item.is_available !== undefined ? item.is_available : (item.isAvailable ?? true);
                                                const imageUrl = item.image_url || item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop";
                                                const isThisToggling = togglingId === (item._id || item.id);

                                                return (
                                                    <tr
                                                        key={item._id || item.id}
                                                        className={`hover:bg-white/[0.02] transition-colors ${!isAvailable ? 'opacity-60 bg-black/20' : ''}`}
                                                    >
                                                        {/* Item Info */}
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-3.5">
                                                                <img
                                                                    src={imageUrl}
                                                                    alt={item.name}
                                                                    className="w-12 h-12 rounded-xl object-cover bg-neutral-900 border border-white/10 shrink-0"
                                                                    onError={(e) => {
                                                                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop";
                                                                    }}
                                                                />
                                                                <div className="min-w-0">
                                                                    <h4 className="font-semibold text-white truncate text-sm">
                                                                        {item.name}
                                                                    </h4>
                                                                    <p className="text-xs text-gray-400 line-clamp-1 max-w-xs mt-0.5">
                                                                        {item.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Category */}
                                                        <td className="py-3.5 px-4">
                                                            <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-gray-300">
                                                                {item.category || "General"}
                                                            </span>
                                                        </td>

                                                        {/* Price */}
                                                        <td className="py-3.5 px-4 font-semibold text-amber-400">
                                                            ₹{Number(item.price).toFixed(2)}
                                                        </td>

                                                        {/* Status Toggle Switch */}
                                                        <td className="py-3.5 px-4">
                                                            <button
                                                                disabled={isThisToggling}
                                                                onClick={() => handleToggleStatus(item)}
                                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isAvailable
                                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                                                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                                                                }`}
                                                                title="Click to toggle availability"
                                                            >
                                                                {isThisToggling ? (
                                                                    <>
                                                                        <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                                                                        Updating...
                                                                    </>
                                                                ) : isAvailable ? (
                                                                    <>
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                                        Available
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                                                        Archived / Out
                                                                    </>
                                                                )}
                                                            </button>
                                                        </td>

                                                        {/* Action Buttons */}
                                                        <td className="py-3.5 px-4 text-right">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <button
                                                                    onClick={() => handleOpenModal(item)}
                                                                    className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all cursor-pointer"
                                                                    title="Edit Menu Item"
                                                                >
                                                                    <Edit3 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(item, false)}
                                                                    className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                                                                    title="Archive / Soft Delete"
                                                                >
                                                                    <Archive className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(item, true)}
                                                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                                                                    title="Permanent Hard Delete"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ORDERS MANAGEMENT TAB */}
            {activeTab === 'orders' && (
                <div className="mt-6 space-y-6">
                    {/* Orders KPI Stats Bar (Organized into Today, Month-End, Kitchen, Delivery, and Lifetime) */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
                        {/* Today's Sales Card */}
                        <div
                            onClick={() => setOrderPeriod('today')}
                            className={`bg-[#121214] border rounded-2xl p-4 shadow-sm transition-all cursor-pointer ${
                                orderPeriod === 'today'
                                    ? 'border-amber-500 bg-amber-500/[0.03] shadow-amber-500/10'
                                    : 'border-white/5 hover:border-amber-500/30'
                            }`}
                        >
                            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
                                <span className="text-amber-400 font-bold">Today's Sales</span>
                                <Calendar className="w-4 h-4 text-amber-400" />
                            </div>
                            <p className="text-2xl font-black text-amber-400 mt-1.5">
                                ₹{orderMetrics.todayRevenue.toLocaleString()}
                            </p>
                            <span className="text-[11px] text-gray-400 block mt-0.5">
                                {orderMetrics.todayOrdersCount} today's orders {orderMetrics.todayCancelledCount > 0 ? `(${orderMetrics.todayCancelledCount} cancelled)` : ''}
                            </span>
                        </div>

                        {/* This Month's Sales Card */}
                        <div
                            onClick={() => setOrderPeriod('month')}
                            className={`bg-[#121214] border rounded-2xl p-4 shadow-sm transition-all cursor-pointer ${
                                orderPeriod === 'month'
                                    ? 'border-emerald-500 bg-emerald-500/[0.03] shadow-emerald-500/10'
                                    : 'border-white/5 hover:border-emerald-500/30'
                            }`}
                        >
                            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
                                <span className="text-emerald-400 font-bold">This Month's Sales</span>
                                <DollarSign className="w-4 h-4 text-emerald-400" />
                            </div>
                            <p className="text-2xl font-black text-emerald-400 mt-1.5">
                                ₹{orderMetrics.monthRevenue.toLocaleString()}
                            </p>
                            <span className="text-[11px] text-gray-400 block mt-0.5">
                                {orderMetrics.monthOrdersCount} monthly orders (ledger)
                            </span>
                        </div>

                        {/* In Kitchen / Active */}
                        <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 shadow-sm hover:border-sky-500/20 transition-all">
                            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
                                <span>In Kitchen / Active</span>
                                <ChefHat className="w-4 h-4 text-sky-400" />
                            </div>
                            <p className="text-2xl font-bold text-sky-400 mt-1.5">{orderMetrics.activeCount}</p>
                            <span className="text-[11px] text-gray-500 block mt-0.5">
                                {orderMetrics.pending} pending • {orderMetrics.preparing} cooking
                            </span>
                        </div>

                        {/* Out for Delivery */}
                        <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 shadow-sm hover:border-purple-500/20 transition-all">
                            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
                                <span>Out for Delivery</span>
                                <Truck className="w-4 h-4 text-purple-400" />
                            </div>
                            <p className="text-2xl font-bold text-purple-400 mt-1.5">{orderMetrics.outForDelivery}</p>
                            <span className="text-[11px] text-gray-500 block mt-0.5">Riders on the road</span>
                        </div>

                        {/* Total Lifetime Revenue Card */}
                        <div
                            onClick={() => setOrderPeriod('all')}
                            className={`bg-[#121214] border rounded-2xl p-4 shadow-sm col-span-2 lg:col-span-1 transition-all cursor-pointer ${
                                orderPeriod === 'all'
                                    ? 'border-amber-500/50 bg-amber-500/[0.02]'
                                    : 'border-white/5 hover:border-amber-500/20'
                            }`}
                        >
                            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
                                <span>Lifetime Net Revenue</span>
                                <DollarSign className="w-4 h-4 text-amber-400" />
                            </div>
                            <p className="text-2xl font-bold text-white mt-1.5">₹{orderMetrics.totalRevenue.toLocaleString()}</p>
                            <span className="text-[11px] text-gray-500 block mt-0.5">
                                {orderMetrics.total - orderMetrics.cancelled} fulfilled • Avg ₹{orderMetrics.avgOrderValue}
                            </span>
                        </div>
                    </div>

                    {/* Accounting Rule Compliance Strip */}
                    <div className="px-4 py-2.5 bg-amber-500/5 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-amber-300">
                            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>
                                <strong>Strict Accounting Rule:</strong> All orders cancelled by customer or restaurant (₹{orderMetrics.cancelledRevenue.toLocaleString()}) are strictly excluded from all sales and revenue totals.
                            </span>
                        </div>
                        <span className="text-gray-400 text-[11px] shrink-0 font-medium">
                            {orderMetrics.cancelled} Cancelled Orders Excluded
                        </span>
                    </div>

                    {/* Filter, Search & Status Tabs Bar */}
                    <div className="bg-[#121214] border border-white/5 p-4 rounded-2xl space-y-4 shadow-sm">
                        {/* Row 1: Order Period Filter & Future Admin Tools */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                            {/* Date Period Switcher */}
                            <div className="flex items-center gap-1.5 p-1 bg-[#18181b] border border-white/10 rounded-xl overflow-x-auto">
                                <button
                                    onClick={() => setOrderPeriod('all')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                        orderPeriod === 'all'
                                            ? 'bg-amber-500 text-black font-bold shadow-md'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    All Time ({orderMetrics.total})
                                </button>

                                <button
                                    onClick={() => setOrderPeriod('today')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                                        orderPeriod === 'today'
                                            ? 'bg-amber-500 text-black font-bold shadow-md'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Today's Orders ({orderMetrics.todayOrdersCount})</span>
                                </button>

                                <button
                                    onClick={() => setOrderPeriod('month')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                                        orderPeriod === 'month'
                                            ? 'bg-amber-500 text-black font-bold shadow-md'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>This Month ({orderMetrics.monthOrdersCount})</span>
                                </button>
                            </div>

                            {/* Additional Tools with Under Development notification */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setUnderDevFeature("Financial Report Export (CSV/Excel)")}
                                    className="px-3 py-1.5 bg-[#18181b] hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
                                    title="Export sales reports for accounting"
                                >
                                    <Archive className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="hidden md:inline">Export Ledger</span>
                                </button>

                                <button
                                    onClick={() => setUnderDevFeature("Delivery Partner Dispatch & Fleet Management")}
                                    className="px-3 py-1.5 bg-[#18181b] hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
                                    title="Dispatch orders to delivery partners"
                                >
                                    <Truck className="w-3.5 h-3.5 text-purple-400" />
                                    <span className="hidden md:inline">Partner Fleet</span>
                                </button>
                            </div>
                        </div>

                        {/* Row 2: Status Filter Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {ORDER_STATUS_TABS.map((tab) => {
                                const count = tab.id === 'all'
                                    ? orderMetrics.total
                                    : tab.id === 'Pending'
                                        ? orderMetrics.pending
                                        : tab.id === 'Preparing'
                                            ? orderMetrics.preparing
                                            : tab.id === 'Out for Delivery'
                                                ? orderMetrics.outForDelivery
                                                : tab.id === 'Delivered'
                                                    ? orderMetrics.delivered
                                                    : orderMetrics.cancelled;

                                const isActive = orderStatusFilter === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setOrderStatusFilter(tab.id)}
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${isActive
                                            ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10 font-bold'
                                            : 'bg-[#18181b] text-gray-400 hover:text-white border border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? 'bg-black/20 text-black' : 'bg-white/5 text-gray-400'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Period Active Banner if filtered */}
                        {orderPeriod !== 'all' && (
                            <div className="px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                                    <span className="text-gray-200">
                                        {orderPeriod === 'today'
                                            ? `Viewing Today's Orders (${orderMetrics.todayOrdersCount} orders • Total Sales: ₹${orderMetrics.todayRevenue.toLocaleString()})`
                                            : `Viewing This Month's Orders (${orderMetrics.monthOrdersCount} orders • Total Monthly Sales: ₹${orderMetrics.monthRevenue.toLocaleString()})`
                                        }
                                    </span>
                                </div>
                                <button
                                    onClick={() => setOrderPeriod('all')}
                                    className="text-amber-400 hover:underline font-semibold cursor-pointer text-[11px]"
                                >
                                    Show All Time
                                </button>
                            </div>
                        )}

                        {/* Search, Sort and Refresh controls */}
                        <div className="flex flex-col md:flex-row gap-3 items-center justify-between pt-1 border-t border-white/5">
                            {/* Search Input */}
                            <div className="relative w-full md:w-96">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search by Order ID, customer, phone, city, dish..."
                                    value={orderSearchTerm}
                                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                                    className="w-full bg-[#18181b] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
                                />
                                {orderSearchTerm && (
                                    <button
                                        onClick={() => setOrderSearchTerm('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Sort & Refresh */}
                            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <ArrowUpDown className="w-3.5 h-3.5" />
                                    <span>Sort:</span>
                                </div>
                                <select
                                    value={orderSort}
                                    onChange={(e) => setOrderSort(e.target.value)}
                                    className="bg-[#18181b] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="amount-high">Amount: High to Low</option>
                                    <option value="amount-low">Amount: Low to High</option>
                                </select>

                                <button
                                    onClick={fetchOrdersList}
                                    className="p-2 bg-[#18181b] border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-pointer flex items-center gap-1.5 text-xs"
                                    title="Refresh orders feed"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin text-amber-400' : ''}`} />
                                    <span className="hidden sm:inline">Refresh</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Orders Listing Content */}
                    {loadingOrders ? (
                        <div className="py-24 text-center text-gray-400 bg-[#121214] border border-white/5 rounded-2xl">
                            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-amber-500 mb-3" />
                            <p className="text-sm font-semibold text-white">Loading orders feed...</p>
                            <p className="text-xs text-gray-500 mt-1">Retrieving latest customer orders from database</p>
                        </div>
                    ) : ordersError ? (
                        <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-2xl text-center space-y-2">
                            <AlertCircle className="w-6 h-6 mx-auto text-rose-400" />
                            <p className="font-semibold">{ordersError}</p>
                            <button
                                onClick={fetchOrdersList}
                                className="px-4 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-lg text-xs font-semibold cursor-pointer"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="py-20 text-center text-gray-400 bg-[#121214] border border-white/5 rounded-2xl space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-gray-600">
                                <ShoppingBag className="w-7 h-7" />
                            </div>
                            <h4 className="font-bold text-white text-base">No Orders Found</h4>
                            <p className="text-xs text-gray-500 max-w-sm mx-auto">
                                {orderSearchTerm || orderStatusFilter !== 'all'
                                    ? `No orders match your filter "${orderStatusFilter !== 'all' ? orderStatusFilter : ''} ${orderSearchTerm}".`
                                    : "No orders have been placed yet. New customer orders will show up here in real time."}
                            </p>
                            {(orderSearchTerm || orderStatusFilter !== 'all') && (
                                <button
                                    onClick={() => {
                                        setOrderSearchTerm('');
                                        setOrderStatusFilter('all');
                                    }}
                                    className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black rounded-xl text-xs font-semibold transition-all cursor-pointer"
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map((ord, idx) => {
                                const orderId = ord._id || ord.id || `order-${idx}`;
                                const status = ord.status || "Pending";
                                const statusConfig = ORDER_STATUS_MAP[status] || ORDER_STATUS_MAP.Pending;
                                const isUpdating = updatingOrderId === orderId;
                                const isCopied = copiedOrderId === orderId;
                                const customerName = ord.userId?.name || ord.address?.name || "Customer";
                                const customerEmail = ord.userId?.email;
                                const totalAmount = ord.totalCartPrice || ord.totalAmount || 0;
                                const totalItemsCount = (ord.items || []).reduce((sum, it) => sum + (it.qnty || it.quantity || 1), 0);

                                return (
                                    <div
                                        key={orderId}
                                        className="bg-[#121214] border border-white/5 hover:border-white/10 rounded-2xl p-5 shadow-sm transition-all duration-200 space-y-4"
                                    >
                                        {/* Card Top: Order Identity, Time & Status */}
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-white/5">
                                            {/* Left: ID, Time, Customer */}
                                            <div className="flex flex-wrap items-center gap-3">
                                                {/* Order ID Pill with Copy button */}
                                                <div className="flex items-center gap-1.5 bg-[#18181b] border border-white/10 px-2.5 py-1 rounded-lg">
                                                    <span className="text-xs font-mono font-bold text-amber-400">
                                                        #{orderId.slice(-8).toUpperCase()}
                                                    </span>
                                                    <button
                                                        onClick={() => handleCopyOrderId(orderId)}
                                                        className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                                        title="Copy Full Order ID"
                                                    >
                                                        {isCopied ? (
                                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                        ) : (
                                                            <Copy className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Date & Time */}
                                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                                                    <span>{formatOrderDate(ord.createdAt)}</span>
                                                    {getTimeAgo(ord.createdAt) && (
                                                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-gray-400 font-medium">
                                                            {getTimeAgo(ord.createdAt)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Customer Tag */}
                                                <div className="flex items-center gap-1.5 text-xs text-gray-300">
                                                    <User className="w-3.5 h-3.5 text-gray-500" />
                                                    <span className="font-semibold text-white">{customerName}</span>
                                                    {customerEmail && (
                                                        <span className="text-gray-500 text-[11px] hidden sm:inline">({customerEmail})</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: Live Status & Total Amount */}
                                            <div className="flex items-center gap-3 justify-between lg:justify-end">
                                                {/* Status Badge */}
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.badgeBg}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                                                    {statusConfig.label}
                                                </span>

                                                {/* Total Price */}
                                                <div className="text-right">
                                                    <span className="text-lg font-black text-white tracking-tight">
                                                        ₹{Number(totalAmount).toFixed(2)}
                                                    </span>
                                                    <p className="text-[10px] text-emerald-400 font-semibold">Free Delivery</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Middle: Ordered Items & Delivery Details Grid */}
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                            {/* Items Breakdown (Left 7 cols) */}
                                            <div className="lg:col-span-7 bg-[#17171a] border border-white/5 rounded-xl p-3.5 space-y-2.5">
                                                <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-white/5 font-semibold">
                                                    <span className="flex items-center gap-1.5">
                                                        <Utensils className="w-3.5 h-3.5 text-amber-400" />
                                                        Items in Order ({totalItemsCount})
                                                    </span>
                                                    <span className="text-gray-500 font-normal">Portion • Rate</span>
                                                </div>

                                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                                    {(ord.items || []).map((it, i) => {
                                                        const p = it.productId || {};
                                                        const itemName = p.name || it.name || "Special Dish";
                                                        const itemImg = p.image_url || p.imageUrl || it.imageUrl;
                                                        const qty = it.qnty || it.quantity || 1;
                                                        const price = it.price || p.price || 0;
                                                        const portion = it.portion || (p.portion?.half ? "Custom Portion" : "Single Serving");
                                                        const lineTotal = price * qty;

                                                        return (
                                                            <div key={i} className="flex items-center justify-between gap-3 text-xs py-1">
                                                                <div className="flex items-center gap-2.5 min-w-0">
                                                                    {itemImg ? (
                                                                        <img
                                                                            src={itemImg}
                                                                            alt={itemName}
                                                                            className="w-9 h-9 rounded-lg object-cover bg-neutral-900 border border-white/10 shrink-0"
                                                                            onError={(e) => {
                                                                                e.target.style.display = 'none';
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-amber-400">
                                                                            🍽️
                                                                        </div>
                                                                    )}
                                                                    <div className="min-w-0">
                                                                        <p className="font-semibold text-white truncate text-xs">{itemName}</p>
                                                                        <p className="text-[10px] text-gray-400">
                                                                            {portion} • <span className="text-amber-400 font-semibold">₹{price}</span> each
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="text-right shrink-0">
                                                                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[11px] font-bold text-gray-200">
                                                                        x{qty}
                                                                    </span>
                                                                    <p className="text-xs font-semibold text-white mt-0.5">
                                                                        ₹{lineTotal}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Delivery Address & Contact (Right 5 cols) */}
                                            <div className="lg:col-span-5 bg-[#17171a] border border-white/5 rounded-xl p-3.5 flex flex-col justify-between space-y-3">
                                                <div>
                                                    <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-white/5 font-semibold">
                                                        <span className="flex items-center gap-1.5">
                                                            <MapPin className="w-3.5 h-3.5 text-rose-400" />
                                                            Delivery Address
                                                        </span>
                                                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                                            {ord.address?.country || 'India'}
                                                        </span>
                                                    </div>

                                                    <div className="mt-2 text-xs space-y-1 text-gray-300">
                                                        <p className="font-medium text-white">{ord.address?.street || 'Customer address'}</p>
                                                        <p className="text-gray-400">
                                                            {ord.address?.city}{ord.address?.state ? `, ${ord.address.state}` : ''} - {ord.address?.postalCode}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Phone & Payment Mode */}
                                                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                                                    {ord.address?.phone ? (
                                                        <a
                                                            href={`tel:${ord.address.phone}`}
                                                            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                                                        >
                                                            <Phone className="w-3.5 h-3.5" />
                                                            <span>{ord.address.phone}</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-500 text-xs">No phone provided</span>
                                                    )}

                                                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-[10px] font-semibold">
                                                        Cash on Delivery
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Bottom: Status Workflow & Action Controls */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 bg-white/[0.01] -mx-5 -mb-5 p-4 rounded-b-2xl">
                                            {/* Fast Next Stage Progression Button */}
                                            <div className="flex items-center gap-2">
                                                {statusConfig.next ? (
                                                    <button
                                                        disabled={isUpdating}
                                                        onClick={() => handleUpdateOrderStatus(orderId, statusConfig.next)}
                                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${statusConfig.nextBtnBg}`}
                                                    >
                                                        {isUpdating ? (
                                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                        )}
                                                        <span>{statusConfig.nextLabel}</span>
                                                    </button>
                                                ) : status === 'Delivered' ? (
                                                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span>Order Fulfilled</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
                                                        <X className="w-4 h-4" />
                                                        <span>Order Cancelled</span>
                                                    </div>
                                                )}

                                                {/* KOT / Invoice Print Button */}
                                                <button
                                                    onClick={() => setActiveKOTOrder(ord)}
                                                    className="px-3 py-1.5 bg-[#1a1a1e] hover:bg-[#222226] border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                                                    title="View and print Kitchen Order Ticket / Customer Receipt"
                                                >
                                                    <Printer className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>Print KOT / Invoice</span>
                                                </button>
                                            </div>

                                            {/* Jump Status Dropdown */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] text-gray-400 font-medium">Change Status:</span>
                                                <select
                                                    disabled={isUpdating}
                                                    value={status}
                                                    onChange={(e) => handleUpdateOrderStatus(orderId, e.target.value)}
                                                    className="bg-[#18181b] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-amber-500 cursor-pointer disabled:opacity-50"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Preparing">Preparing in Kitchen</option>
                                                    <option value="Out for Delivery">Out for Delivery</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* KITCHEN ORDER TICKET (KOT) / INVOICE MODAL */}
            {activeKOTOrder && (
                <div
                    className="fixed inset-0 z-[2000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-hidden"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setActiveKOTOrder(null);
                        }
                    }}
                >
                    <div className="bg-[#141417] border border-white/15 rounded-2xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl relative text-gray-100 overflow-hidden animate-fadeIn">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 shrink-0 bg-[#141417]">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                    <Utensils className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-white text-base sm:text-lg tracking-tight">Star7Foodies Receipt</h3>
                                    <p className="text-[11px] text-gray-400">Kitchen Order Ticket & Customer Invoice</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveKOTOrder(null)}
                                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Printable Receipt Body */}
                        <div id="kot-receipt-content" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
                            {/* Receipt Meta */}
                            <div className="bg-[#18181c] p-3.5 rounded-xl border border-white/5 grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Order Number</span>
                                    <span className="font-mono font-bold text-amber-400 text-sm">
                                        #{activeKOTOrder._id?.slice(-8).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Order Time</span>
                                    <span className="font-medium text-white">
                                        {formatOrderDate(activeKOTOrder.createdAt)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Customer</span>
                                    <span className="font-medium text-white">
                                        {activeKOTOrder.userId?.name || activeKOTOrder.address?.name || "Valued Customer"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Contact Phone</span>
                                    <span className="font-medium text-white">
                                        {activeKOTOrder.address?.phone || "N/A"}
                                    </span>
                                </div>
                                <div className="col-span-2 pt-1 border-t border-white/5">
                                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Delivery Address</span>
                                    <span className="text-gray-300">
                                        {activeKOTOrder.address?.street}, {activeKOTOrder.address?.city} ({activeKOTOrder.address?.postalCode})
                                    </span>
                                </div>
                            </div>

                            {/* Itemized Table */}
                            <div className="border border-white/10 rounded-xl overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-white/5 text-gray-400 font-semibold border-b border-white/10">
                                        <tr>
                                            <th className="py-2.5 px-3">Item Description</th>
                                            <th className="py-2.5 px-3 text-center">Portion</th>
                                            <th className="py-2.5 px-3 text-center">Qty</th>
                                            <th className="py-2.5 px-3 text-right">Price</th>
                                            <th className="py-2.5 px-3 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {(activeKOTOrder.items || []).map((it, i) => {
                                            const p = it.productId || {};
                                            const name = p.name || it.name || "Special Dish";
                                            const qty = it.qnty || it.quantity || 1;
                                            const rate = it.price || p.price || 0;
                                            const portion = it.portion || (p.portion?.half ? "Custom" : "Standard");
                                            return (
                                                <tr key={i} className="hover:bg-white/[0.02]">
                                                    <td className="py-2 px-3 font-medium text-white">{name}</td>
                                                    <td className="py-2 px-3 text-center text-gray-400 text-[11px]">{portion}</td>
                                                    <td className="py-2 px-3 text-center font-bold text-amber-400">{qty}</td>
                                                    <td className="py-2 px-3 text-right text-gray-400">₹{rate}</td>
                                                    <td className="py-2 px-3 text-right font-bold text-white">₹{rate * qty}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Financial Summary */}
                            <div className="bg-[#18181c] p-3.5 rounded-xl border border-white/5 space-y-1.5 text-xs">
                                <div className="flex justify-between text-gray-400">
                                    <span>Items Subtotal</span>
                                    <span>₹{activeKOTOrder.totalCartPrice || activeKOTOrder.totalAmount || 0}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Delivery Fee</span>
                                    <span className="text-emerald-400 font-semibold">FREE (Special Offer)</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Taxes & GST (Included)</span>
                                    <span>₹0.00</span>
                                </div>
                                <div className="flex justify-between text-white font-extrabold text-sm pt-2 border-t border-white/10">
                                    <span>Net Payable</span>
                                    <span className="text-amber-400">₹{activeKOTOrder.totalCartPrice || activeKOTOrder.totalAmount || 0}</span>
                                </div>
                            </div>

                            {/* Footer message */}
                            <p className="text-center text-[10px] text-gray-500 pt-1">
                                Thank you for dining with Star7Foodies! • Powered by Star7Foodies Kitchen Management System
                            </p>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-white/10 bg-[#161619] shrink-0">
                            <button
                                onClick={() => setActiveKOTOrder(null)}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Print Ticket (KOT)</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CREATE / EDIT MODAL */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !submitting) {
                            handleCloseModal();
                        }
                    }}
                >
                    <div className="bg-[#141417] border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-xl max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl relative overflow-hidden animate-fadeIn">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b border-white/10 bg-[#141417] shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                    <Utensils className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                                        {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {editingItem ? 'Update dish details, prices & stock' : 'Publish a new dish to your live restaurant menu'}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                                title="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                            {/* Scrollable Form Body */}
                            <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 space-y-4">
                                {/* Error Alert inside Modal */}
                                {formError && (
                                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                                        <span>{formError}</span>
                                    </div>
                                )}

                                {/* Item Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                        Dish / Item Name <span className="text-amber-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Royal Chicken Biryani"
                                        required
                                        className="w-full bg-[#1c1c20] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                </div>

                                {/* Category & Price */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                            Category <span className="text-amber-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#1c1c20] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer appearance-none pr-9"
                                            >
                                                {CATEGORIES.filter(c => c !== 'All').map(c => (
                                                    <option key={c} value={c} className="bg-[#1c1c20] text-white">{c}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                            Base Price (₹) <span className="text-amber-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">₹</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                placeholder="249"
                                                required
                                                className="w-full bg-[#1c1c20] border border-white/10 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                        Description <span className="text-amber-400">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        rows="2"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Rich basmati rice layered with aromatic saffron spices and tender pieces..."
                                        required
                                        className="w-full bg-[#1c1c20] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none transition-colors"
                                    />
                                </div>

                                {/* Image Upload or URL */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-gray-300">
                                        Dish Image <span className="text-amber-400">*</span>
                                    </label>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                        {previewUrl ? (
                                            <div className="relative group shrink-0">
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-white/10 bg-[#1c1c20]"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80";
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImageFile(null);
                                                        setPreviewUrl('');
                                                        setFormData(prev => ({ ...prev, image_url: '' }));
                                                    }}
                                                    className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 shadow-md transition-colors"
                                                    title="Remove image"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-dashed border-white/20 bg-white/[0.02] flex flex-col items-center justify-center text-gray-500 shrink-0">
                                                <UploadCloud className="w-5 h-5 text-gray-400 mb-1" />
                                                <span className="text-[9px]">No image</span>
                                            </div>
                                        )}
                                        <div className="flex-1 w-full space-y-2">
                                            <label className="flex items-center justify-center gap-2 border border-dashed border-white/20 hover:border-amber-500/50 rounded-xl p-2.5 cursor-pointer text-xs text-gray-300 hover:text-white transition-all bg-white/[0.02] hover:bg-amber-500/[0.03]">
                                                <UploadCloud className="w-4 h-4 text-amber-400 shrink-0" />
                                                <span className="truncate">{imageFile ? imageFile.name : 'Upload from device (Cloudinary)'}</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                            <input
                                                type="text"
                                                name="image_url"
                                                value={formData.image_url}
                                                onChange={(e) => {
                                                    handleInputChange(e);
                                                    if (!imageFile) setPreviewUrl(e.target.value);
                                                }}
                                                placeholder="Or paste direct image URL (https://...)"
                                                className="w-full bg-[#1c1c20] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Portion Prices (Optional) */}
                                <div className="bg-[#1c1c20]/60 border border-white/5 p-3 rounded-xl space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-300">Portion Pricing (Optional)</span>
                                        <span className="text-[10px] text-gray-500">Leave blank if standard dish</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-400 mb-1">
                                                Half Portion (₹)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">₹</span>
                                                <input
                                                    type="number"
                                                    name="halfPortion"
                                                    value={formData.halfPortion}
                                                    onChange={handleInputChange}
                                                    placeholder="Optional"
                                                    className="w-full bg-[#161619] border border-white/10 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-400 mb-1">
                                                Full Portion (₹)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">₹</span>
                                                <input
                                                    type="number"
                                                    name="fullPortion"
                                                    value={formData.fullPortion}
                                                    onChange={handleInputChange}
                                                    placeholder="Optional"
                                                    className="w-full bg-[#161619] border border-white/10 rounded-lg pl-7 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stock Availability Toggle */}
                                <div className="flex items-center justify-between bg-[#1c1c20] border border-white/5 p-3 sm:p-3.5 rounded-xl">
                                    <div className="pr-2">
                                        <p className="text-xs font-semibold text-white">Item Availability (In Stock)</p>
                                        <p className="text-[11px] text-gray-400">Controls whether customers can order this dish right now</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            name="is_available"
                                            checked={formData.is_available}
                                            onChange={handleInputChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Sticky Modal Actions Footer */}
                            <div className="flex items-center justify-end gap-3 px-5 py-3.5 sm:px-6 sm:py-4 border-t border-white/10 bg-[#161619] shrink-0">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={submitting}
                                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/10 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <span>{editingItem ? 'Save Changes' : 'Create Item'}</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* UNDER DEVELOPMENT NOTIFICATION MODAL */}
            {underDevFeature && (
                <div
                    className="fixed inset-0 z-[2000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setUnderDevFeature(null);
                        }
                    }}
                >
                    <div className="bg-[#141417] border border-amber-500/30 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-fadeIn">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                            <AlertCircle className="w-7 h-7" />
                        </div>
                        <div className="space-y-2">
                            <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                Feature In Progress
                            </span>
                            <h3 className="text-lg font-extrabold text-white">{underDevFeature}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed px-2">
                                This module is currently under active development and will be released in an upcoming update. All core restaurant functions—live order dispatch, customer receipts & KOT printing, and menu catalogue management—are fully operational.
                            </p>
                        </div>
                        <button
                            onClick={() => setUnderDevFeature(null)}
                            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold rounded-xl text-xs shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
                        >
                            Got It
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;