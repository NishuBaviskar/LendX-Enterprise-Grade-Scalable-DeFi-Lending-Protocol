import React from 'react';
import { ShieldCheck, Mail, Wallet, Calendar, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../context/Web3Context';

const AdminProfile = () => {
    const { user } = useAuth();
    const { account } = useWeb3();

    return (
        <div className="max-w-4xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-48 rounded-[40px] relative">
                <div className="absolute -bottom-12 left-12 w-32 h-32 bg-[#16181d] rounded-full border-8 border-[#0a0b0d] flex items-center justify-center">
                    <ShieldCheck size={60} className="text-blue-500" />
                </div>
            </div>

            <div className="pt-8 px-12 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">{user?.email || 'Admin User'}</h1>
                    <p className="text-blue-500 font-bold uppercase text-xs tracking-widest mt-1">SuperAdmin / System Owner</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoTile icon={<Wallet />} label="Authorized Wallet" value={account || "Not Connected"} />
                    <InfoTile icon={<Key />} label="Access Level" value="Root Authority (Level 5)" />
                    <InfoTile icon={<Calendar />} label="Role Assigned" value="Feb 2026" />
                    <InfoTile icon={<Mail />} label="System Alerts" value="Enabled (Critical Only)" />
                </div>
            </div>
        </div>
    );
};

const InfoTile = ({ icon, label, value }) => (
    <div className="bg-[#16181d] p-6 rounded-3xl border border-gray-800 flex items-center gap-4">
        <div className="p-3 bg-gray-800 rounded-2xl text-blue-500">{icon}</div>
        <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</p>
            <p className="text-white font-medium mt-1 truncate max-w-[200px]">{value}</p>
        </div>
    </div>
);

export default AdminProfile;