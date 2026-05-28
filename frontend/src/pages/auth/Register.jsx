import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import { UserPlus, Wallet, Mail, Lock, ShieldCheck } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ email: '', password: '', walletAddress: '', role: 'borrower' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', formData);
            alert("Application Submitted. Please log in.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || "Registration Failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0b0d] px-4 py-10 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/5 blur-[120px]" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#16181d] p-10 rounded-[32px] border border-gray-800 w-full max-w-lg shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Join Ecosystem</h2>
                    <p className="text-gray-500 mt-2">Onboard with role-based permissions</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                                type="email" placeholder="Email" required
                                className="w-full bg-[#0a0b0d] border border-gray-800 p-4 pl-12 rounded-2xl text-white focus:border-blue-500 outline-none transition-all"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                                type="password" placeholder="Password" required
                                className="w-full bg-[#0a0b0d] border border-gray-800 p-4 pl-12 rounded-2xl text-white focus:border-blue-500 outline-none transition-all"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                        <div className="relative">
                            <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                                type="text" placeholder="Wallet Address (0x...)" required
                                className="w-full bg-[#0a0b0d] border border-gray-800 p-4 pl-12 rounded-2xl text-white focus:border-blue-500 outline-none transition-all font-mono text-sm"
                                onChange={(e) => setFormData({...formData, walletAddress: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-2">Request Role</label>
                            <select 
                                className="w-full bg-[#0a0b0d] border border-gray-800 p-4 rounded-2xl text-white focus:border-blue-500 outline-none appearance-none"
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                value={formData.role}
                            >
                                <option value="borrower">Borrower</option>
                                <option value="lender">Lender</option>
                                <option value="liquidator">Liquidator</option>
                                <option value="auditor">Auditor</option>
                                <option value="super_admin">SuperAdmin</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all"
                    >
                        {loading ? "Initializing..." : "Register Account"}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    Already a member? <Link to="/login" className="text-blue-500 hover:underline">Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;