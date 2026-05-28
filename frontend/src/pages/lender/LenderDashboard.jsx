import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { Wallet, TrendingUp, PieChart as PieIcon, ArrowUpRight, Plus } from 'lucide-react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

const LenderDashboard = () => {
    const { contract, account } = useWeb3();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ supplied: '0', earned: '0', apy: '4.2' });

    useEffect(() => {
        if (contract && account) {
            const fetchLenderData = async () => {
                const balance = await contract.userDeposits(account);
                setStats(prev => ({ ...prev, supplied: ethers.formatEther(balance) }));
            };
            fetchLenderData();
        }
    }, [contract, account]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Lender Overview</h1>
                    <p className="text-gray-500">Track your yield and portfolio distribution</p>
                </div>
                <button 
                    onClick={() => navigate('/lender/supply')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20"
                >
                    <Plus size={20} /> Supply Assets
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Supplied" value={`${stats.supplied} ETH`} icon={<Wallet className="text-blue-500" />} />
                <StatCard title="Net APY" value={`${stats.apy}%`} icon={<TrendingUp className="text-green-500" />} />
                <StatCard title="Total Earnings" value="0.0042 ETH" icon={<ArrowUpRight className="text-purple-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-6">Asset Allocation</h3>
                    <div className="flex items-center justify-around h-48">
                        <div className="w-32 h-32 rounded-full border-[12px] border-blue-600 border-t-purple-500 border-l-green-500 flex items-center justify-center relative">
                            <span className="text-xs font-bold text-gray-500 uppercase">Diversified</span>
                        </div>
                        <div className="space-y-3">
                            <LegendItem color="bg-blue-600" label="ETH" percent="70%" />
                            <LegendItem color="bg-purple-500" label="USDC" percent="20%" />
                            <LegendItem color="bg-green-500" label="DAI" percent="10%" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-6">Yield Projection</h3>
                    <div className="space-y-4">
                        <ProjectionRow time="Daily" gain="0.00012 ETH" />
                        <ProjectionRow time="Monthly" gain="0.0036 ETH" />
                        <ProjectionRow time="Yearly" gain="0.0432 ETH" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800 hover:border-blue-500/20 transition-all">
        <div className="w-12 h-12 bg-[#0a0b0d] rounded-2xl flex items-center justify-center mb-6">{icon}</div>
        <p className="text-gray-500 text-sm font-semibold">{title}</p>
        <h2 className="text-3xl font-bold text-white mt-1">{value}</h2>
    </div>
);

const LegendItem = ({ color, label, percent }) => (
    <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-sm text-white font-medium">{label}</span>
        <span className="text-xs text-gray-500">{percent}</span>
    </div>
);

const ProjectionRow = ({ time, gain }) => (
    <div className="flex justify-between items-center p-4 bg-[#0a0b0d] rounded-2xl">
        <span className="text-gray-400">{time} Earnings</span>
        <span className="text-green-400 font-mono font-bold">{gain}</span>
    </div>
);

export default LenderDashboard;