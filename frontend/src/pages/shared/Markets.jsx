import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { Globe, TrendingUp, Activity } from 'lucide-react';

const Markets = () => {
    const { lastEvent } = useWeb3();
    const [marketData, setMarketData] = useState({ ethAPY: 4.2, totalLiquidity: 1240 });

    // ⚡ Real-time dependency: APY changes when utilization changes
    useEffect(() => {
        if (lastEvent?.type === 'BORROW') {
            // Simulate interest rate spike when liquidity is taken
            setMarketData(prev => ({ ...prev, ethAPY: prev.ethAPY + 0.1 }));
        }
    }, [lastEvent]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Global Markets</h1>
                <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 text-xs font-bold uppercase">
                    <Activity size={14} /> Live Oracle Sync
                </div>
            </div>

            <div className="bg-[#16181d] border border-gray-800 rounded-[32px] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#0a0b0d] text-gray-500 text-xs uppercase font-black">
                        <tr>
                            <th className="p-6">Asset</th>
                            <th className="p-6">Supply APY</th>
                            <th className="p-6">Total Liquidity</th>
                            <th className="p-6">Utilization</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-6 flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">E</div>
                                <span className="text-white font-bold">Ethereum</span>
                            </td>
                            <td className="p-6 text-green-400 font-mono font-bold">{marketData.ethAPY.toFixed(2)}%</td>
                            <td className="p-6 text-white">{marketData.totalLiquidity} ETH</td>
                            <td className="p-6">
                                <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: '65%' }} />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Markets;