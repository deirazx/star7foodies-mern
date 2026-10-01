import React from 'react';
import {
    FaUtensils,
    FaMotorcycle,
    FaShieldAlt,
    FaHeart,
    FaPhoneAlt,
    FaWhatsapp,
    FaCheckCircle,
    FaQuoteLeft,
    FaStore
} from 'react-icons/fa';
import founderImg from '../assets/founder.jpg';

/**
 * ======================================================================
 * DATA CONFIGURATION (REAL VILLAGE RESTAURANT DATA)
 * You can edit the phone, WhatsApp, and restaurant address right here:
 * ======================================================================
 */
const RESTAURANT_INFO = {
    name: "Star7Foodies",
    tagline: "Desi Swad, Behtareen Quality & Tez Delivery",
    phone: "+91 98765 43210",          // <-- EDIT: Your Restaurant Phone Number
    whatsapp: "+91 98765 43210",       // <-- EDIT: Your Restaurant WhatsApp Number
    location: "Main Road, Muzaffarpur, Bihar", // <-- EDIT: Your Village/Town Location
    founderName: "Bittu Kumar",        // <-- Founder Name
    founderRole: "Founder & Managing Director",
};

const About = () => {
    // Village & Town Realistic Milestones
    const stats = [
        { label: 'Happy Customers (संतुष्ट ग्राहक)', value: '5,000+' },
        { label: 'Fresh Dishes (स्वादिष्ट व्यंजन)', value: '50+' },
        { label: 'Avg Delivery Time (तेज़ डिलीवरी)', value: '25-30m' },
        { label: 'Pure & Hygienic (शुद्धता)', value: '100%' },
    ];

    const values = [
        {
            icon: <FaShieldAlt className="text-amber-400 text-2xl" />,
            title: '100% Pure & Fresh Ingredients (शुद्ध और ताज़ा भोजन)',
            desc: 'Every meal is made using fresh market vegetables, premium spices, and pure cooking oil under strict daily hygiene standards.',
        },
        {
            icon: <FaMotorcycle className="text-amber-400 text-2xl" />,
            title: 'Express Village Delivery (घर-घर तक डिलीवरी)',
            desc: 'No need to travel far to the city. Our dedicated delivery boys bring your hot meals straight to your doorstep and village chowk.',
        },
        {
            icon: <FaUtensils className="text-amber-400 text-2xl" />,
            title: 'Honest & Affordable Prices (किफायती दाम)',
            desc: 'High restaurant standards at honest, reasonable village-friendly prices. No hidden charges, just authentic taste.',
        },
        {
            icon: <FaHeart className="text-amber-400 text-2xl" />,
            title: 'Warm Desi Hospitality (अपनापन और भरोसा)',
            desc: 'We treat every customer like family. If you ever need something customized for a birthday, family feast or party, we are just a phone call away.',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white py-8 sm:py-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div
                className="absolute top-20 left-1/4 -translate-x-1/2 rounded-full blur-3xl pointer-events-none"
                style={{ width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, rgba(0,0,0,0) 70%)' }}
            ></div>
            <div
                className="absolute bottom-20 right-1/4 translate-x-1/2 rounded-full blur-3xl pointer-events-none"
                style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, rgba(0,0,0,0) 70%)' }}
            ></div>

            <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24 relative z-10">
                {/* ── 1. Hero Section ── */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/25">
                        <FaStore className="text-[11px]" />
                        <span>Our Story • हमारी कहानी</span>
                    </span>

                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                        Bringing Hot, Delicious Food to <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                            Every Village Home & Family
                        </span>
                    </h1>

                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl mx-auto">
                        Started with a big dream in our local area, <strong className="text-amber-400">Star7Foodies</strong> is dedicated to serving top-tier restaurant food — from piping hot biryanis and paneer delicacies to crispy snacks and burgers — with express home delivery right to your door.
                    </p>
                </div>

                {/* ── 2. Statistics Grid (Village Friendly Numbers) ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-[#121214] border border-white/8 hover:border-amber-500/30 p-4 sm:p-6 rounded-2xl text-center space-y-1 shadow-lg transition-all hover:scale-[1.02] duration-200"
                        >
                            <h3 className="text-2xl sm:text-4xl font-black text-amber-400">{stat.value}</h3>
                            <p className="text-[11px] sm:text-xs text-gray-300 font-bold">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── 3. FOUNDER & CEO SPOTLIGHT (Mobile Optimized & Looking Great) ── */}
                <div className="bg-gradient-to-br from-[#16161a] to-[#0f0f12] border border-amber-500/25 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
                    {/* Decorative Background Accent */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        {/* Founder Image Holder - High Resolution & Responsive */}
                        <div className="md:col-span-5 flex flex-col items-center text-center space-y-4">
                            <div className="relative group">
                                {/* Amber Glow Ring */}
                                <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300"></div>

                                {/* Founder Photo: Tall, Crisp, Professional Portrait */}
                                <img
                                    src={founderImg}
                                    alt={`${RESTAURANT_INFO.founderName} - Founder`}
                                    className="w-48 h-56 sm:w-56 sm:h-64 md:w-60 md:h-72 object-cover object-top rounded-2xl border-2 border-amber-400 relative z-10 shadow-2xl bg-neutral-900"
                                />

                                {/* Verified Badge */}
                                <div className="absolute bottom-2 right-2 z-20 bg-black/80 backdrop-blur-md border border-amber-400/50 text-amber-400 px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-md">
                                    <FaCheckCircle className="text-emerald-400" />
                                    <span>Verified</span>
                                </div>
                            </div>

                            {/* Founder Title Details */}
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-white">{RESTAURANT_INFO.founderName}</h3>
                                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                                    {RESTAURANT_INFO.founderRole}
                                </p>
                                <p className="text-[11px] text-gray-400">
                                    Star7Foodies Group • {RESTAURANT_INFO.location}
                                </p>
                            </div>

                            {/* Direct Connect Buttons (Village Friendly) */}
                            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 w-full max-w-xs">
                                <a
                                    href={`tel:${RESTAURANT_INFO.phone.replace(/\s+/g, '')}`}
                                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs font-bold transition-all shadow-sm"
                                    title="Call Founder Directly"
                                >
                                    <FaPhoneAlt className="text-[10px]" />
                                    <span>Call Directly</span>
                                </a>

                                <a
                                    href={`https://wa.me/${RESTAURANT_INFO.whatsapp.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                                    title="WhatsApp Founder"
                                >
                                    <FaWhatsapp className="text-xs" />
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                        </div>

                        {/* Founder Story & Message */}
                        <div className="md:col-span-7 space-y-4 text-left">
                            <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-extrabold uppercase tracking-wide">
                                <FaQuoteLeft className="text-amber-500/60" />
                                <span>Message from the Founder</span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                                "Our mission is to bring city-standard culinary taste and fast delivery to our village community."
                            </h3>

                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                                "Growing up in our locality, I always noticed that finding fresh, high-quality, and delicious restaurant food required traveling miles away into big cities. When families wanted to celebrate or enjoy a warm meal at night, there were few quick options."
                            </p>

                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                                "With <strong className="text-white">Star7Foodies</strong>, we set out to change that forever. We built a modern, spotless kitchen with authentic recipes, pure ingredients, and our own delivery riders so that anyone in our village and nearby areas can order top-notch meals right to their doorstep in under 30 minutes."
                            </p>

                            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                                <div>
                                    <p className="font-extrabold text-white text-sm">{RESTAURANT_INFO.founderName}</p>
                                    <p className="text-[11px] text-gray-400">Founder & Managing Director, Star7Foodies</p>
                                </div>
                                <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                                    Serving with Love ❤️
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 4. Core Values Section ── */}
                <div className="space-y-8">
                    <div className="text-center space-y-2 max-w-xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            Why People Love Star7<span className="text-amber-400">Foodies</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400">
                            Four promises we make to every customer with every single order.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {values.map((val) => (
                            <div
                                key={val.title}
                                className="bg-[#121214] border border-white/8 hover:border-amber-500/30 p-5 sm:p-6 rounded-2xl flex gap-4 transition-all duration-200"
                            >
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                    {val.icon}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs sm:text-sm font-black text-white tracking-tight leading-snug">
                                        {val.title}
                                    </h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        {val.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
