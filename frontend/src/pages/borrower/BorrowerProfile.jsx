import React from 'react';
import { User, ShieldCheck, Zap, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BorrowerProfile = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl space-y-8">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-10 rounded-[40px] border border-blue-500/20 flex items-center gap-8">
                <div className="w-24 h-24 bg-[#0a0b0d] rounded-full border-4 border-blue-500 flex items-center justify-center">
                    <User size={48} className="text-blue-500" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">{user?.email}</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Premium Borrower</span>
                        <div className="flex text-yellow-500"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#16181d] p-8 rounded-3xl border border-gray-800 text-center">
                    <Zap className="text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-500 text-xs font-bold uppercase">ZK-Credit Score</p>
                    <h3 className="text-3xl font-black text-white mt-1">742</h3>
                </div>
                <div className="bg-[#16181d] p-8 rounded-3xl border border-gray-800 text-center">
                    <ShieldCheck className="text-green-500 mx-auto mb-4" />
                    <p className="text-gray-500 text-xs font-bold uppercase">Verification</p>
                    <h3 className="text-3xl font-black text-white mt-1">L2</h3>
                </div>
            </div>
        </div>
    );
};

export default BorrowerProfile;