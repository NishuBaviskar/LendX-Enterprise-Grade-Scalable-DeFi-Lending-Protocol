import React from 'react';
import { ShieldCheck, Target, Award, Key } from 'lucide-react';
import { useWeb3 } from '../../context/Web3Context';

const LiquidatorProfile = () => {
    const { account } = useWeb3();

    return (
        <div className="max-w-4xl space-y-8">
            <div className="bg-red-600/10 p-10 rounded-[40px] border border-red-600/20 flex items-center gap-8">
                <div className="w-24 h-24 bg-[#0a0b0d] rounded-full border-4 border-red-600 flex items-center justify-center">
                    <Target size={48} className="text-red-500" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">Liquidator Profile</h2>
                    <p className="text-red-500 font-bold uppercase text-xs tracking-widest mt-1">Official Protocol Enforcer</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#16181d] p-6 rounded-3xl border border-gray-800 flex items-center gap-4">
                    <Award className="text-yellow-500" />
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase">Rank</p>
                        <p className="text-white font-bold">Top 5% Enforcer</p>
                    </div>
                </div>
                <div className="bg-[#16181d] p-6 rounded-3xl border border-gray-800 flex items-center gap-4">
                    <Key className="text-blue-500" />
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase">Access Status</p>
                        <p className="text-green-500 font-bold">Active Permission</p>
                    </div>
                </div>
                <div className="md:col-span-2 bg-[#16181d] p-6 rounded-3xl border border-gray-800">
                    <p className="text-gray-500 text-xs font-bold uppercase mb-2">Connected Enforcer Wallet</p>
                    <p className="text-white font-mono text-sm break-all">{account}</p>
                </div>
            </div>
        </div>
    );
};

export default LiquidatorProfile;