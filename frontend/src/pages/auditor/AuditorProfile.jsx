import React from 'react';
import { Search, ShieldAlert, Award, Hash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AuditorProfile = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl space-y-8">
            <div className="bg-blue-600/10 p-10 rounded-[40px] border border-blue-600/20 flex items-center gap-8">
                <div className="w-24 h-24 bg-[#0a0b0d] rounded-full border-4 border-blue-600 flex items-center justify-center">
                    <Search size={48} className="text-blue-500" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">System Auditor</h2>
                    <p className="text-blue-500 font-bold uppercase text-xs tracking-widest mt-1">Certified Transparency Officer</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ProfileItem icon={<Hash />} label="Audit ID" value="LNDX-AUD-2026" />
                <ProfileItem icon={<Award />} label="Clearance" value="Level 4 (Public Scan)" />
                <ProfileItem icon={<ShieldAlert />} label="Alerts" value="Real-time Push" />
            </div>
        </div>
    );
};

const ProfileItem = ({ icon, label, value }) => (
    <div className="bg-[#16181d] p-6 rounded-3xl border border-gray-800 text-center">
        <div className="p-3 bg-gray-800 rounded-2xl text-blue-500 w-fit mx-auto mb-4">{icon}</div>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
        <p className="text-lg font-bold text-white mt-1">{value}</p>
    </div>
);

export default AuditorProfile;