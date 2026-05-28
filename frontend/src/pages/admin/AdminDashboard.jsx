import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, ShieldCheck, Activity, Landmark } from 'lucide-react';
import { useWeb3 } from '../../context/Web3Context';
import { ethers } from 'ethers';

const AdminDashboard = () => {
    const { contract } = useWeb3();
    const [stats, setStats] = useState({
        tvl: "1,420,500",
        activeLoans: "842",
        systemRisk: "Low",
        utilization: "64"
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">System Overview</h1>
                    <p className="text-gray-500 mt-1">Real-time protocol liquidity and risk metrics.</p>
                </div>
                <div className="flex gap-3">
                    <span className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-xs font-bold uppercase">
                        <Activity size={14} /> Oracle: Active
                    </span>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Value Locked" value={`$${stats.tvl}`} change="+12.5%" icon={<Landmark className="text-blue-500" />} />
                <StatCard title="Active Positions" value={stats.activeLoans} change="+3%" icon={<Users className="text-purple-500" />} />
                <StatCard title="System Health" value={stats.systemRisk} change="Stable" icon={<ShieldCheck className="text-green-500" />} />
                <StatCard title="Utilization Rate" value={`${stats.utilization}%`} change="+1.2%" icon={<TrendingUp className="text-orange-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Chart Placeholder */}
                <div className="lg:col-span-2 bg-[#16181d] rounded-[32px] p-8 border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-8">Liquidity Depth (ETH/USDC)</h3>
                    <div className="h-64 flex items-end gap-3">
                        {[40, 70, 45, 90, 65, 80, 50, 85, 60, 75].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-600/20 rounded-t-xl hover:bg-blue-600/40 transition-all cursor-crosshair group relative">
                                <div style={{ height: `${h}%` }} className="bg-blue-600 rounded-t-xl" />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}M
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status List */}
                <div className="bg-[#16181d] rounded-[32px] p-8 border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-6">Protocol Status</h3>
                    <div className="space-y-6">
                        <StatusItem label="UUPS Logic" status="V2.0.4" color="text-blue-400" />
                        <StatusItem label="Admin Timelock" status="48 Hours" color="text-orange-400" />
                        <StatusItem label="DAO Quorum" status="65%" color="text-green-400" />
                        <StatusItem label="Security Buffer" status="Active" color="text-purple-400" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, change, icon }) => (
    <div className="bg-[#16181d] p-7 rounded-[32px] border border-gray-800 hover:border-blue-500/30 transition-all group">
        <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#0a0b0d] rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
            <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg uppercase tracking-wider">{change}</span>
        </div>
        <p className="text-gray-500 text-sm font-semibold">{title}</p>
        <h2 className="text-3xl font-bold text-white mt-1">{value}</h2>
    </div>
);

const StatusItem = ({ label, status, color }) => (
    <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className={`font-mono text-sm font-bold ${color}`}>{status}</span>
    </div>
);

export default AdminDashboard;