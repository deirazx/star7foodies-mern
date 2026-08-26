import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCommentAlt } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const contactDetails = [
        {
            icon: <FaPhone className="text-amber-500 text-lg" />,
            title: 'Call Support',
            lines: ['+91 98765 43210', '+91 1800 123 4567'],
            label: 'Mon-Sun, 9am - 12pm'
        },
        {
            icon: <FaEnvelope className="text-amber-500 text-lg" />,
            title: 'Email Us',
            lines: ['support@star7foodies.com', 'careers@star7foodies.com'],
            label: 'Response within 2 hours'
        },
        {
            icon: <FaMapMarkerAlt className="text-amber-500 text-lg" />,
            title: 'Headquarters',
            lines: ['Star7 Foodies Tech Park', 'Sector 62, Noida, UP, India'],
            label: 'Pin: 201301'
        },
        {
            icon: <FaClock className="text-amber-500 text-lg" />,
            title: 'Working Hours',
            lines: ['Express Delivery: 24/7', 'Customer Support: 8am - 3am'],
            label: 'All Days Active'
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Thank you ${formData.name}! Your message about "${formData.subject}" has been noted.`);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-[#0a0a0b] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl pointer-events-none"
                style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, rgba(0,0,0,0) 70%)' }}
            ></div>

            <div className="max-w-6xl mx-auto space-y-12 relative z-10">
                {/* Hero Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto animate-fadeIn">
                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                        Get In Touch
                    </span>
                    <h1 className="text-4xl font-black tracking-tight leading-none bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        We'd Love to <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Hear From You</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                        Have a question about an order, partner opportunities, or just want to send some feedback? Reach out to us and our support crew will resolve it.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8 sm:gap-12 items-start">
                    {/* Contact Details Grid (Left) */}
                    <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6 animate-slideUp">
                        {contactDetails.map((detail) => (
                            <div
                                key={detail.title}
                                className="bg-[#121214]/60 border border-white/5 p-5 rounded-2xl flex gap-4 hover:border-white/10 hover:bg-[#121214] transition-all duration-300 group"
                            >
                                <div className="shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-amber-500/10 transition-colors duration-300">
                                    {detail.icon}
                                </div>
                                <div className="space-y-1 overflow-hidden">
                                    <h4 className="text-xs font-black text-white tracking-wide uppercase">{detail.title}</h4>
                                    {detail.lines.map((line, i) => (
                                        <p key={i} className="text-xs text-gray-300 truncate font-semibold">{line}</p>
                                    ))}
                                    <p className="text-[10px] text-amber-500 font-medium pt-0.5">{detail.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form Container (Right) */}
                    <div className="lg:col-span-3 bg-[#121214] border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl relative space-y-6 animate-slideUp">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm">
                                <FaCommentAlt />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white">Send Us a Message</h3>
                                <p className="text-[10px] text-gray-400">Fill out the form below and we'll reply shortly.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                {/* Name Input */}
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Full Name"
                                        required
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
                                    />
                                </div>

                                {/* Email Input */}
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="name@example.com"
                                        required
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Subject Input */}
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="What is this regarding?"
                                    required
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
                                />
                            </div>

                            {/* Message Input */}
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Type your message here..."
                                    required
                                    rows="4"
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-all resize-none"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>Send Message</span>
                                <FaPaperPlane className="text-[10px]" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
