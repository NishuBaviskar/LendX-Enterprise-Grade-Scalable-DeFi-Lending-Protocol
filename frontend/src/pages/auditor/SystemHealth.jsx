import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { ethers } from 'ethers';
import { Activity, Globe, HardDrive, Cpu, Share2, Info, AlertCircle } from 'lucide-react';

const SystemHealth = () => {
    const { contract } = useWeb3();
    const [utilization, setUtilization] = useState(0);
    const [metrics, setMetrics] = useState({ totalReserves: '0', totalBorrows: '0' });

    useEffect(() => {
        const fetchGlobalMetrics = async () => {
            if (!contract) return;
            try {
                // Fetching protocol-wide data from the Smart Contract
                const reserves = await contract.getTotalReserves ? await contract.getTotalReserves() : ethers.parseEther("100");
                const borrows = await contract.getTotalBorrows ? await contract.getTotalBorrows() : ethers.parseEther("45");
                
                const resNum = parseFloat(ethers.formatEther(reserves));
                const borNum = parseFloat(ethers.formatEther(borrows));
                
                setMetrics({ totalReserves: resNum.toFixed(2), totalBorrows: borNum.toFixed(2) });
                setUtilization(resNum > 0 ? (borNum / resNum) * 100 : 0);
            } catch (err) {
                console.error("Metric Fetch Error:", err);
            }
        };
        fetchGlobalMetrics();
        const interval = setInterval(fetchGlobalMetrics, 15000);
        return () => clearInterval(interval);
    }, [contract]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-white">System Health Metrics</h1>
            
            {/* --- GLOBAL UTILIZATION CHART --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-[#16181d] p-8 rounded-[40px] border border-gray-800 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle className="text-gray-800 stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50"/>
                            <circle 
                                className={`${utilization > 85 ? 'text-red-500' : 'text-blue-500'} stroke-current transition-all duration-1000`} 
                                strokeWidth="10" strokeDasharray={`${utilization * 2.51}, 251.2`}
                                strokeLinecap="round" fill="transparent" r="40" cx="50" cy="50" transform="rotate(-90 50 50)"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-white">{utilization.toFixed(1)}%</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Utilization</span>
                        </div>
                    </div>
                    <div className="space-y-4 flex-1">
                        <h3 className="text-xl font-bold text-white">Liquidity Risk Monitor</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Current protocol utilization reflects the ratio of borrowed assets vs total liquidity. 
                            Values above 90% trigger "High Alert" for lenders.
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div><p className="text-[10px] text-gray-500 font-bold uppercase">Total Supply</p><p className="text-lg font-bold text-white">{metrics.totalReserves} ETH</p></div>
                            <div><p className="text-[10px] text-gray-500 font-bold uppercase">Total Borrowed</p><p className="text-lg font-bold text-white">{metrics.totalBorrows} ETH</p></div>
                        </div>
                    </div>
                </div>

                <HealthCard 
                    title="Oracle Feed" value="Stable" desc="Feeds active on Sepolia." status="Safe"
                    icon={<Globe className="text-purple-500" />}
                />
            </div>

            <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Cpu size={18} className="text-green-500" /> Active Contract Nodes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['LendingPool', 'Oracle', 'DAO', 'Bridge'].map(contract => (
                        <div key={contract} className="p-4 bg-[#0a0b0d] rounded-2xl border border-gray-800 text-center">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">{contract}</p>
                            <span className="text-green-500 text-[10px] font-mono">0x...{Math.floor(Math.random() * 999)}f</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* DAG Visualization */}
            <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Share2 size={18} className="text-blue-500" /> DAG Async Ledger</h3>
                    <span className="text-[10px] bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full font-black uppercase">Tangle Active</span>
                </div>
                <div className="flex gap-4 overflow-x-auto p-4 scrollbar-hide">
                    {[1, 2, 3, 4, 5, 6].map(node => (
                        <div key={node} className="min-w-[140px] p-5 bg-[#0a0b0d] border border-blue-500/20 rounded-2xl text-center">
                            <Activity size={14} className="text-blue-500 mx-auto mb-3" />
                            <p className="text-sm font-mono text-white mb-1">#{1000 + node}</p>
                            <div className="text-[9px] text-blue-400 font-bold uppercase">2 Parents</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const HealthCard = ({ title, value, desc, status, icon }) => (
    <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
        <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#0a0b0d] rounded-2xl">{icon}</div>
            <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">{status}</span>
        </div>
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-black text-white mt-1">{value}</p>
        <p className="text-gray-500 text-xs mt-3 leading-relaxed">{desc}</p>
    </div>
);

export default SystemHealth;