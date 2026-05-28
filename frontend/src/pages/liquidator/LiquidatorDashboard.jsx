import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { Skull, TrendingUp, AlertCircle } from 'lucide-react';

const LiquidatorDashboard = () => {
    const { account } = useWeb3();

    const [stats] = useState({
        totalLiquidated: "12.4",
        rewards: "1.24",
        opportunities: "3"
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold text-white">
                    Liquidator Command
                </h1>
                <p className="text-gray-500">
                    Monitor protocol insolvency and execute settlement actions
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <LiquidStat
                    title="Total Debt Cleared"
                    value={`${stats.totalLiquidated} ETH`}
                    icon={<Skull className="text-red-500" />}
                />
                <LiquidStat
                    title="Liquidation Rewards"
                    value={`${stats.rewards} ETH`}
                    icon={<TrendingUp className="text-green-500" />}
                />
                <LiquidStat
                    title="Active Targets"
                    value={stats.opportunities}
                    icon={<AlertCircle className="text-orange-500" />}
                />
            </div>

            <div className="bg-[#16181d] rounded-[32px] p-8 border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-6">
                    Market Risk Heatmap
                </h3>

                <div className="h-4 bg-gray-800 rounded-full flex overflow-hidden">
                    <div className="w-[70%] bg-green-500" title="Healthy" />
                    <div className="w-[20%] bg-orange-500" title="At Risk" />
                    <div
                        className="w-[10%] bg-red-500 animate-pulse"
                        title="Liquidatable"
                    />
                </div>

                <div className="flex justify-between mt-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span>Healthy (HF &gt; 1.5)</span>
                    <span>Warning (1.0 - 1.5)</span>
                    <span>Insolvent (&lt; 1.0)</span>
                </div>
            </div>
        </div>
    );
};

const LiquidStat = ({ title, value, icon }) => (
    <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
        <div className="w-12 h-12 bg-[#0a0b0d] rounded-2xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <p className="text-gray-500 text-sm font-semibold uppercase">
            {title}
        </p>
        <h2 className="text-3xl font-bold text-white mt-1">
            {value}
        </h2>
    </div>
);

export default LiquidatorDashboard;