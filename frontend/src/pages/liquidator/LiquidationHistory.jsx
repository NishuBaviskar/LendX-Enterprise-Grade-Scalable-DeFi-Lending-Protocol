import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { CheckCircle2, ExternalLink, Clock, TrendingUp, Wallet } from 'lucide-react';

const LiquidatorDashboard = () => {
    const { account, contract } = useWeb3();
    const [stats, setStats] = useState({ totalRepaid: '0.0', totalBonus: '0.0', count: 0 });
    
    // Mock data for history - In production, fetch from backend/subgraph
    const [history, setHistory] = useState([
        { id: 1, user: '0x88...2a', repaid: '1.5 ETH', bonus: '0.15 ETH', time: '2h ago', status: 'Finalized' },
        { id: 2, user: '0x34...1c', repaid: '0.8 ETH', bonus: '0.08 ETH', time: '1d ago', status: 'Finalized' },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* --- STATS OVERVIEW --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#16181d] p-6 rounded-[32px] border border-gray-800">
                    <div className="flex items-center gap-3 text-blue-500 mb-2">
                        <Wallet size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Total Repaid</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">2.30 <span className="text-sm text-gray-500">ETH</span></h3>
                </div>
                <div className="bg-[#16181d] p-6 rounded-[32px] border border-gray-800">
                    <div className="flex items-center gap-3 text-green-500 mb-2">
                        <TrendingUp size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Profit Seized</span>
                    </div>
                    <h3 className="text-3xl font-bold text-green-500">+0.23 <span className="text-sm text-gray-400">ETH</span></h3>
                </div>
                <div className="bg-[#16181d] p-6 rounded-[32px] border border-gray-800">
                    <div className="flex items-center gap-3 text-purple-500 mb-2">
                        <CheckCircle2 size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Liquidations</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">14 <span className="text-sm text-gray-500">Events</span></h3>
                </div>
            </div>

            {/* --- HISTORY TABLE --- */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white px-2">Settlement History</h2>
                <div className="bg-[#16181d] rounded-[32px] border border-gray-800 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0a0b0d] text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <tr>
                                <th className="p-6">Borrower Address</th>
                                <th className="p-6">Debt Repaid</th>
                                <th className="p-6">Bonus Seized</th>
                                <th className="p-6">Status</th>
                                <th className="p-6">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {history.map(item => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-6 font-mono text-gray-400 text-sm">{item.user}</td>
                                    <td className="p-6 text-white font-bold">{item.repaid}</td>
                                    <td className="p-6 text-green-400 font-bold">+{item.bonus}</td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full uppercase">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-gray-500 text-sm flex items-center gap-2 mt-1">
                                        <Clock size={14} /> {item.time}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LiquidatorDashboard;