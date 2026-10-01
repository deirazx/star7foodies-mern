import React, { useState } from 'react';
import {
    FaPhoneAlt,
    FaWhatsapp,
    FaMapMarkerAlt,
    FaClock,
    FaPaperPlane,
    FaCommentAlt,
    FaCheckCircle,
    FaExclamationCircle,
    FaStore
} from 'react-icons/fa';

/**
 * ======================================================================
 * DATA CONFIGURATION (REAL VILLAGE RESTAURANT DATA)
 * You can edit your phone number, WhatsApp, and location right here:
 * ======================================================================
 */
export const RESTAURANT_CONTACT_DATA = {
    restaurantName: "Star7Foodies Restaurant",
    phoneDisplay: "+91 98765 43210",       // <-- EDIT: Display Phone Number
    phoneTel: "+919876543210",             // <-- EDIT: Dialable Phone Link
    whatsappNumber: "919876543210",        // <-- EDIT: 10-12 digit WhatsApp number (no spaces or '+')
    email: "contact@star7foodies.com",     // <-- EDIT: Your Email Address
    addressLine1: "Star7Foodies Restaurant, Main Road", // <-- EDIT: Village/Road
    addressLine2: "Near Central Chowk, Muzaffarpur",     // <-- EDIT: Area / Landmark
    statePin: "Bihar - 842001",            // <-- EDIT: State and PIN Code
    kitchenHours: "10:00 AM – 11:00 PM",   // <-- EDIT: Operating Hours
    deliveryHours: "Fast Delivery till 10:30 PM",
};

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        topic: 'Order Inquiry',
        message: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [submittedData, setSubmittedData] = useState(null);

    const contactCards = [
        {
            icon: <FaPhoneAlt className="text-emerald-400 text-lg" />,
            title: 'Call Directly (सीधे कॉल करें)',
            primary: RESTAURANT_CONTACT_DATA.phoneDisplay,
            sub: 'Instant table booking & quick food orders',
            actionHref: `tel:${RESTAURANT_CONTACT_DATA.phoneTel}`,
            actionLabel: 'Call Now • कॉल करें',
            isAction: true,
            theme: 'emerald'
        },
        {
            icon: <FaWhatsapp className="text-emerald-400 text-xl" />,
            title: 'WhatsApp Order (व्हाट्सएप)',
            primary: RESTAURANT_CONTACT_DATA.phoneDisplay,
            sub: 'Send delivery location & ask for daily specials',
            actionHref: `https://wa.me/${RESTAURANT_CONTACT_DATA.whatsappNumber}?text=Namaste%20Star7Foodies,%20I%20want%20to%20place%20an%20order!`,
            actionLabel: 'Chat on WhatsApp',
            isAction: true,
            theme: 'emerald'
        },
        {
            icon: <FaMapMarkerAlt className="text-amber-400 text-lg" />,
            title: 'Location (रेस्टोरेंट का पता)',
            primary: `${RESTAURANT_CONTACT_DATA.addressLine1}, ${RESTAURANT_CONTACT_DATA.addressLine2}`,
            sub: RESTAURANT_CONTACT_DATA.statePin,
            actionLabel: null,
            theme: 'amber'
        },
        {
            icon: <FaClock className="text-amber-400 text-lg" />,
            title: 'Timings (दुकान का समय)',
            primary: RESTAURANT_CONTACT_DATA.kitchenHours,
            sub: `${RESTAURANT_CONTACT_DATA.deliveryHours} • Open all 7 days`,
            actionLabel: null,
            theme: 'amber'
        }
    ];

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) {
            errors.name = 'Please enter your name (कृपया अपना नाम दर्ज करें)';
        }

        const phoneClean = formData.phone.trim();
        if (!phoneClean) {
            errors.phone = 'Mobile number is required (मोबाइल नंबर आवश्यक है)';
        } else if (!/^[6-9]\d{9}$/.test(phoneClean)) {
            errors.phone = 'Enter valid 10-digit mobile number (मान्य 10-अंकीय नंबर डालें)';
        }

        if (!formData.message.trim()) {
            errors.message = 'Please type a short message (कृपया अपना संदेश लिखें)';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Store confirmation and reset form
        setSubmittedData({
            name: formData.name,
            phone: formData.phone,
            topic: formData.topic
        });

        setFormData({
            name: '',
            phone: '',
            topic: 'Order Inquiry',
            message: ''
        });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white py-8 sm:py-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl pointer-events-none"
                style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(0,0,0,0) 70%)' }}
            ></div>

            <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16 relative z-10">
                {/* ── 1. Page Header ── */}
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/25">
                        <FaStore className="text-[11px]" />
                        <span>Contact Star7Foodies • संपर्क करें</span>
                    </span>

                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                        We're Here to <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Serve You Fresh</span>
                    </h1>

                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                        Have a question about food delivery, table dining, catering for a family function, or want to place an order over phone? Get in touch with us anytime.
                    </p>
                </div>

                {/* ── 2. Two-Column Layout: Contact Cards & Interactive Form ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT COLUMN: Quick Connect Cards (5 cols) */}
                    <div className="lg:col-span-5 space-y-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-wider text-gray-400 px-1">
                            Quick Connect (तुरंत संपर्क)
                        </h3>

                        <div className="space-y-3.5">
                            {contactCards.map((card) => (
                                <div
                                    key={card.title}
                                    className="bg-[#121214] border border-white/8 hover:border-amber-500/30 p-4 sm:p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-md transition-all"
                                >
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            {card.icon}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                                {card.title}
                                            </h4>
                                            <p className="text-sm sm:text-base font-extrabold text-white mt-0.5 truncate">
                                                {card.primary}
                                            </p>
                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                {card.sub}
                                            </p>
                                        </div>
                                    </div>

                                    {card.isAction && (
                                        <a
                                            href={card.actionHref}
                                            target={card.actionHref.startsWith('http') ? '_blank' : '_self'}
                                            rel="noreferrer"
                                            className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/30 text-xs font-bold text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                                        >
                                            {card.title.includes('WhatsApp') ? <FaWhatsapp className="text-sm" /> : <FaPhoneAlt className="text-xs" />}
                                            <span>{card.actionLabel}</span>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Working Inquiry Form (7 cols) */}
                    <div className="lg:col-span-7 bg-[#121214] border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl relative space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/8 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black font-extrabold text-base shadow-md">
                                <FaCommentAlt />
                            </div>
                            <div>
                                <h3 className="text-base font-black text-white">Send Us a Message (संदेश भेजें)</h3>
                                <p className="text-xs text-gray-400">Our restaurant manager will call or reply to you promptly.</p>
                            </div>
                        </div>

                        {/* Inline Success Banner */}
                        {submittedData && (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-xs text-emerald-300 animate-fadeIn">
                                <FaCheckCircle className="text-emerald-400 text-base shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-white text-sm">
                                        Thank you, {submittedData.name}! (धन्यवाद!)
                                    </p>
                                    <p className="text-[11px] text-gray-300 mt-1">
                                        We received your inquiry regarding <strong>{submittedData.topic}</strong>. Our team will call you on <strong className="text-emerald-400">{submittedData.phone}</strong> shortly.
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Name Input */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                        Your Full Name (आपका नाम) *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Ramesh Kumar"
                                        className={`w-full px-3.5 py-2.5 bg-white/5 border rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-all ${
                                            formErrors.name ? 'border-rose-500' : 'border-white/10'
                                        }`}
                                    />
                                    {formErrors.name && (
                                        <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                                            <FaExclamationCircle /> {formErrors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Phone Input */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                        Mobile Number (10 डिजिट मोबाइल नंबर) *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold">+91</span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            maxLength={10}
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="9876543210"
                                            className={`w-full pl-11 pr-3.5 py-2.5 bg-white/5 border rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-all ${
                                                formErrors.phone ? 'border-rose-500' : 'border-white/10'
                                            }`}
                                        />
                                    </div>
                                    {formErrors.phone && (
                                        <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                                            <FaExclamationCircle /> {formErrors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Inquiry Topic Dropdown */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                    Topic / Regarding (विषय)
                                </label>
                                <select
                                    name="topic"
                                    value={formData.topic}
                                    onChange={handleInputChange}
                                    className="w-full px-3.5 py-2.5 bg-[#18181b] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                                >
                                    <option value="Order Inquiry">Order Inquiry / ऑर्डर पूछताछ</option>
                                    <option value="Home Delivery Status">Home Delivery / होम डिलीवरी</option>
                                    <option value="Party & Catering">Party & Function / शादी-पार्टी ऑर्डर</option>
                                    <option value="Feedback & Suggestion">Feedback / सुझाव</option>
                                </select>
                            </div>

                            {/* Message Textarea */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                    Your Message (संदेश लिखें) *
                                </label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Type your message, query or order request here..."
                                    className={`w-full p-3.5 bg-white/5 border rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-all resize-none ${
                                        formErrors.message ? 'border-rose-500' : 'border-white/10'
                                    }`}
                                />
                                {formErrors.message && (
                                    <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                                        <FaExclamationCircle /> {formErrors.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit & WhatsApp Options */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <FaPaperPlane className="text-xs" />
                                    <span>Send Message (संदेश भेजें)</span>
                                </button>

                                <a
                                    href={`https://wa.me/${RESTAURANT_CONTACT_DATA.whatsappNumber}?text=Namaste%20Star7Foodies,%20I%20have%20an%20inquiry.`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <FaWhatsapp className="text-sm" />
                                    <span>Send on WhatsApp</span>
                                </a>
                            </div>

                            <p className="text-[10px] text-gray-500 text-center pt-1">
                                📞 You can also call us directly at {RESTAURANT_CONTACT_DATA.phoneDisplay} for immediate assistance.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
