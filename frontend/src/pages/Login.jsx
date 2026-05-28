import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, Wallet, ArrowRight } from 'lucide-react';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '', 
        wallet: '', 
        role: 'borrower' 
    });
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isRegister) {
                await api.post('/auth/register', {
                    email: formData.email,
                    password: formData.password,
                    walletAddress: formData.wallet,
                    role: formData.role
                });
                alert("Registration successful! Accessing Secure Gate...");
                setIsRegister(false);
            } else {
                // 1. Perform Firebase Authentication
                const userCredential = await login(formData.email, formData.password);
                
                // 2. Fetch the ID Token Result to see the 'role' claim
                const idTokenResult = await userCredential.user.getIdTokenResult();
                const userRole = idTokenResult.claims.role;

                console.log("Authenticated Role:", userRole);

                // 3. Role-Based Redirection Logic
                if (userRole === 'super_admin') {
                    navigate('/super-admin'); // Go to Admin Dashboard
                } else {
                    navigate('/dashboard'); // Go to User Dashboard
                }
            }
        } catch (err) {
            console.error("Auth Error:", err);
            alert(err.response?.data?.error || "Invalid Credentials or Network Error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0b0d] p-4 font-sans selection:bg-blue-500/30">
            {/* Background decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-blue-600/5 blur-[120px]" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-[#16181d] p-10 rounded-[32px] border border-gray-800 w-full max-w-lg shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600/10 rounded-3xl mb-6 border border-blue-500/20">
                        <ShieldCheck className="text-blue-500" size={40} />
                    </div>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">
                        {isRegister ? 'Join Protocol' : 'Authorized Access'}
                    </h2>
                    <p className="text-gray-500 mt-3 text-lg">LendX Enterprise DeFi Gateway</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input 
                                type="email" 
                                placeholder="Corporate Email" 
                                className="w-full bg-[#0a0b0d] border border-gray-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                required 
                            />
                        </div>
                        
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input 
                                type="password" 
                                placeholder="Secure Password" 
                                className="w-full bg-[#0a0b0d] border border-gray-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>
                    
                    {isRegister && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            className="space-y-4"
                        >
                            <div className="relative group">
                                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Ganache Wallet Address (0x...)" 
                                    className="w-full bg-[#0a0b0d] border border-gray-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" 
                                    onChange={(e) => setFormData({...formData, wallet: e.target.value})} 
                                    required 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-widest ml-1">System Role</label>
                                <select 
                                    className="w-full bg-[#0a0b0d] border border-gray-800 p-5 rounded-2xl text-white outline-none focus:border-blue-500 appearance-none cursor-pointer" 
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    value={formData.role}
                                >
                                    <option value="borrower">Borrower</option>
                                    <option value="lender">Lender</option>
                                    <option value="liquidator">Liquidator</option>
                                    <option value="super_admin">SuperAdmin (Full Control)</option>
                                </select>
                            </div>
                        </motion.div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                    >
                        {loading ? 'Processing...' : isRegister ? 'Initialize Access' : 'Authenticate'}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-10 text-center border-t border-gray-800 pt-6">
                    <button 
                        onClick={() => setIsRegister(!isRegister)} 
                        className="text-gray-500 text-sm hover:text-white font-medium transition-colors"
                    >
                        {isRegister ? 'Already have credentials? Log In' : "Don't have a protocol account? Sign Up"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;