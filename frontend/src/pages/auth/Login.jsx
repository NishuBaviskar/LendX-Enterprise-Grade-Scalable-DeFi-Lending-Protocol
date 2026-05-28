import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await login(formData.email, formData.password);
            const idTokenResult = await userCredential.user.getIdTokenResult();
            const userRole = idTokenResult.claims.role;

            // Route-based redirection
            const roleRedirects = {
                super_admin: '/admin/dashboard',
                lender: '/lender/dashboard',
                borrower: '/borrower/dashboard',
                liquidator: '/liquidator/dashboard',
                auditor: '/auditor/dashboard',
                dao_member: '/dao/dashboard'
            };

            navigate(roleRedirects[userRole] || '/markets');
        } catch (err) {
            alert("Invalid credentials or system error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0b0d] px-4 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-blue-600/10 blur-[120px]" />
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#16181d] p-10 rounded-[32px] border border-gray-800 w-full max-w-md relative z-10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-2xl mb-4 border border-blue-500/20">
                        <ShieldCheck className="text-blue-500" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Secure Sign-In</h2>
                    <p className="text-gray-500 mt-2">Access the LendX Enterprise Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <button 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Enter Protocol <ArrowRight size={18}/></>}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    New to the protocol? <Link to="/register" className="text-blue-500 hover:underline">Request Access</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;