import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaGoogle,
    FaUtensils,
    FaArrowRight,
    FaExclamationCircle
} from 'react-icons/fa';
import { registerUser, googleLoginUser } from '../Api/axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Utils/firebase';
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/Slices/auth.js';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await registerUser({ name, email, password });
            alert(`Account created successfully for ${email}!`);
            setName("");
            setEmail("");
            setPassword("");
            navigate('/login');
        } catch (err) {
            setError(err.message || "Failed to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError(null);
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const name = result.user.displayName;
            const email = result.user.email;

            // Sync with backend (auto-registers if new user)
            const response = await googleLoginUser({ name, email });
            const user = response.user ? response.user : response;

            dispatch(setUser(user));
            navigate('/');
        } catch (err) {
            setError(err.message || "Google Sign-Up failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = () => {
        if (error) setError(null);
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-8 relative bg-[#0a0a0b]">
            {/* Background Glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl pointer-events-none"
                style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, rgba(0,0,0,0) 70%)' }}
            ></div>

            {/* Form Card */}
            <div
                className="bg-[#121214] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 animate-fadeIn"
                style={{ maxWidth: '420px', width: '100%' }}
            >
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/20 mb-1">
                        <FaUtensils className="text-lg" />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">
                        Create Account
                    </h2>
                    <p className="text-xs text-gray-400">
                        Join Star7Foodies and order delicious meals instantly
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-fadeIn">
                        <FaExclamationCircle className="shrink-0 text-sm mt-0.5" />
                        <span className="font-medium leading-relaxed">{error}</span>
                    </div>
                )}

                {/* Google Sign Up Button */}
                <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={loading}
                    className={`w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <FaGoogle className="text-amber-400 text-sm group-hover:scale-110 transition-transform" />
                    <span>Sign up with Google</span>
                </button>

                {/* Layout Divider */}
                <div className="flex items-center gap-3">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">OR DETAILS</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                            Full Name
                        </label>
                        <div className="relative flex items-center">
                            <FaUser className="absolute left-3 text-gray-400 text-xs pointer-events-none z-10" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => { setName(e.target.value); handleInputChange(); }}
                                placeholder="Your Name"
                                required
                                disabled={loading}
                                style={{ paddingLeft: '36px' }}
                                className="w-full pr-4 py-2.5 bg-white/5 border border-white/10 focus:border-amber-500/60 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

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
                                onChange={(e) => { setEmail(e.target.value); handleInputChange(); }}
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
                        <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                            Password
                        </label>
                        <div className="relative flex items-center">
                            <FaLock className="absolute left-3 text-gray-400 text-xs pointer-events-none z-10" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); handleInputChange(); }}
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2`}
                    >
                        <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
                        {!loading && <FaArrowRight className="text-[10px]" />}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="text-center text-xs text-gray-400 pt-3 border-t border-white/5">
                    Already have an account?{' '}
                    <Link to="/login" className="text-amber-400 font-bold hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
