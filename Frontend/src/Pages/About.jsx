import React from 'react';
import { FaUtensils, FaTruck, FaAward, FaHeart, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import founderImg from '../assets/founder.jpg';

const About = () => {
    const stats = [
        { label: 'Happy Customers', value: '50K+' },
        { label: 'Dishes Delivered', value: '1M+' },
        { label: 'Restaurant Partners', value: '150+' },
        { label: 'Active Cities', value: '15+' },
    ];

    const values = [
        {
            icon: <FaUtensils className="text-amber-500 text-2xl" />,
            title: 'Hygiene & Quality First',
            desc: 'Every meal is prepared with fresh ingredients under strict hygiene protocols to deliver top-notch quality.',
        },
        {
            icon: <FaTruck className="text-amber-500 text-2xl" />,
            title: 'Express Delivery',
            desc: 'Our delivery fleet works around the clock to make sure you get your meals piping hot and on time.',
        },
        {
            icon: <FaAward className="text-amber-500 text-2xl" />,
            title: 'Curated Chefs',
            desc: 'Collaborating with elite local and regional chefs to bring you authentic flavors and unique cuisines.',
        },
        {
            icon: <FaHeart className="text-amber-500 text-2xl" />,
            title: 'Customer Centricity',
            desc: 'Your satisfaction is our primary reward. Our support and delivery teams strive to make every order a delight.',
        },
    ];

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-[#0a0a0b] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div
                className="absolute top-20 left-1/4 -translate-x-1/2 rounded-full blur-3xl pointer-events-none"
                style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(0,0,0,0) 70%)' }}
            ></div>
            <div
                className="absolute bottom-20 right-1/4 translate-x-1/2 rounded-full blur-3xl pointer-events-none"
                style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(239,68,68,0.04) 0%, rgba(0,0,0,0) 70%)' }}
            ></div>

            <div className="max-w-6xl mx-auto space-y-20 relative z-10">
                {/* Hero Section */}
                <div className="text-center space-y-4 max-w-3xl mx-auto animate-fadeIn">
                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                        Our Story
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                        We are passionate about <br />
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Great Food & Fast Delivery</span>
                    </h1>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Launched in 2026, Star7Foodies was born out of a simple idea: to make premium, high-quality, and delicious food accessible to everyone at lightning-fast speed. We merge advanced logistics with culinary excellence.
                    </p>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {stats.map((stat, idx) => (
                        <div
                            key={stat.label}
                            style={{ animationDelay: `${idx * 0.1}s` }}
                            className="bg-[#121214] border border-white/5 p-6 rounded-2xl text-center space-y-1 shadow-xl hover:border-amber-500/20 transition-all hover:scale-[1.02] duration-300 animate-slideUp"
                        >
                            <h3 className="text-3xl font-black text-amber-500">{stat.value}</h3>
                            <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Core Values Section */}
                <div className="space-y-10">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            What Drives Star7<span className="text-amber-500">Foodies</span>
                        </h2>
                        <p className="text-xs text-gray-400 max-w-lg mx-auto">
                            Our core philosophies define our commitment to serving you the perfect plate every single time.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                        {values.map((val) => (
                            <div
                                key={val.title}
                                className="bg-[#121214]/60 border border-white/5 p-6 rounded-2xl flex gap-4 hover:bg-[#121214] hover:border-white/10 transition-all duration-300 group"
                            >
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-amber-500/10 transition-colors duration-300">
                                    {val.icon}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-black text-white tracking-tight">{val.title}</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">{val.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Founder Section */}
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-8 sm:p-12 grid md:grid-cols-3 gap-8 items-center">
                    <div className="flex flex-col items-center text-center space-y-4 md:border-r md:border-white/10 md:pr-8">
                        {/* Founder Image Holder */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full blur opacity-45 group-hover:opacity-75 transition-opacity duration-300"></div>
                            <img
                                src={founderImg}
                                alt="Founder"
                                className="w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-amber-500 object-cover relative z-10 shadow-lg"
                            />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-white leading-4">Bittu Kumar</h3>
                            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Founder & CEO</p>
                        </div>
                        <div className="flex gap-4 text-gray-400 text-sm">
                            <a href="#github" className="hover:text-white transition-colors"><FaGithub /></a>
                            <a href="#linkedin" className="hover:text-amber-500 transition-colors"><FaLinkedin /></a>
                            <a href="#twitter" className="hover:text-amber-400 transition-colors"><FaTwitter /></a>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-4 text-center md:text-left">
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            "Redefining the Food Delivery Ecosystem"
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                            "At Star7Foodies, we aren't just delivering food; we're bringing joy, convenience, and culinary craftsmanship directly to your doorstep. We believe that good food has the power to transform a day, and we leverage technology to ensure that quality is never compromised for speed."
                        </p>
                        <div className="pt-2">
                            <span className="font-semibold text-white text-xs block">Bittu Kumar</span>
                            <span className="text-[10px] text-gray-400 block">Founder, Star7Foodies Group</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
