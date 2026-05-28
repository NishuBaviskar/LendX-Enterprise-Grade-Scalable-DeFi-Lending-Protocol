import React from 'react';
import { User, Award, BarChart, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../context/Web3Context';

const LenderProfile = () => {
    const { user } = useAuth();
    const { account } = useWeb3();

    return (
        <div className="max-w-4xl space-y-8">
            <div className="bg-[#16181d] p-10 rounded-[40px] border border-gray-800 flex items-center gap-8">
                <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center border-4 border-blue-600/30">
                    <User size={48} className="text-blue-500" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">{user?.email}</h2>
                    <p className="text-blue-500 font-bold uppercase text-xs tracking-widest mt-1">Verified Liquidity Provider</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileStat icon={<Award className="text-yellow-500" />} label="Loyalty Tier" value="Platinum" />
                <ProfileStat icon={<BarChart className="text-purple-500" />} label="Total Volume" value="42.5 ETH" />
                <ProfileStat icon={<ShieldCheck className="text-green-500" />} label="Security Status" value="2FA Active" />
                <div className="bg-[#16181d] p-6 rounded-3xl border border-gray-800 flex flex-col justify-center">
                    <span className="text-gray-500 text-xs font-bold uppercase">Wallet Address</span>
                    <span className="text-white font-mono text-sm mt-1 truncate">{account}</span>
                </div>
            </div>
        </div>
    );
};

const ProfileStat = ({ icon, label, value }) => (
    <div className="bg-[#16181d] p-6 rounded-3xl border border-gray-800 flex items-center gap-4">
        <div className="p-3 bg-[#0a0b0d] rounded-2xl">{icon}</div>
        <div>
            <p className="text-gray-500 text-xs font-bold uppercase">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);

export default LenderProfile;