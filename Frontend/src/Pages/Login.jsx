import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaEnvelope, 
    FaLock, 
    FaEye, 
    FaEyeSlash, 
    FaGoogle, 
    FaUtensils, 
    FaArrowRight,
    FaExclamationCircle
} from 'react-icons/fa';
import { loginUser } from '../Api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await loginUser({ email, password });
            const user = response.user ? response.user : response;
            alert(`Email: ${user?.email} & role: ${user?.role}`);
        } catch (err) {
            setError(err.message || "Something went wrong. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) setError(null);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError(null);
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8 relative bg-[#0a0a0b]">
            {/* Ambient Background Glow */}
            <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl pointer-events-none"
                style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, rgba(0,0,0,0) 70%)' }}
            ></div>

            {/* Login Card */}
            <div 
                className="bg-[#121214] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 animate-fadeIn"
                style={{ maxWidth: '420px', width: '100%' }}
            >
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/20 mb-1">
                        <FaUtensils className="text-lg" />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">
                        Welcome to Star7<span className="text-amber-500">Foodies</span>
                    </h2>
                    <p className="text-xs text-gray-400">
                        Sign in to track orders & enjoy fast food delivery
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-fadeIn">
                        <FaExclamationCircle className="shrink-0 text-sm mt-0.5" />
                        <span className="font-medium leading-relaxed">{error}</span>
                    </div>
                )}

                {/* Google Sign In Button */}
                <button 
                    type="button" 
                    disabled={loading}
                    className={`w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <FaGoogle className="text-amber-400 text-sm group-hover:scale-110 transition-transform" />
                    <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">OR EMAIL</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                            Email
                        </label>
                        <div className="relative flex items-center">
                            <FaEnvelope className="absolute left-3 text-gray-400 text-xs pointer-events-none z-10" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="name@example.com"
                                required
                                disabled={loading}
                                style={{ paddingLeft: '36px' }}
                                className="w-full pr-4 py-2.5 bg-white/5 border border-white/10 focus:border-amber-500/60 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                                Password
                            </label>
                            <a href="#forgot" className="text-[11px] text-amber-400 hover:underline font-semibold">
                                Forgot?
                            </a>
                        </div>
                        <div className="relative flex items-center">
                            <FaLock className="absolute left-3 text-gray-400 text-xs pointer-events-none z-10" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                required
                                disabled={loading}
                                style={{ paddingLeft: '36px', paddingRight: '36px' }}
                                className="w-full py-2.5 bg-white/5 border border-white/10 focus:border-amber-500/60 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-gray-400 hover:text-white p-1 transition-colors cursor-pointer z-10"
                            >
                                {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center gap-2 pt-1">
                        <input 
                            type="checkbox" 
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={loading}
                            className="w-3.5 h-3.5 rounded border-white/10 bg-white/5 accent-amber-500 cursor-pointer disabled:opacity-50"
                        />
                        <label htmlFor="remember" className="text-xs text-gray-400 cursor-pointer select-none">
                            Keep me logged in
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                        {!loading && <FaArrowRight className="text-[10px]" />}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="text-center text-xs text-gray-400 pt-3 border-t border-white/5">
                    New to Star7 Foodies?{' '}
                    <Link to="/register" className="text-amber-400 font-bold hover:underline">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;