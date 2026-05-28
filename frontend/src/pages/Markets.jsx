import React from 'react';
import { motion } from 'framer-motion';

const Markets = () => {
    const assets = [
        { name: 'Ethereum', symbol: 'ETH', apy: '3.2%', tvl: '$1.2B' },
        { name: 'USD Coin', symbol: 'USDC', apy: '5.1%', tvl: '$800M' },
        { name: 'Polygon', symbol: 'MATIC', apy: '4.8%', tvl: '$450M' },
    ];

    return (
        <div className="p-8 bg-[#0a0b0d] min-h-screen">
            <h2 className="text-2xl font-bold text-white mb-6">Lending Markets</h2>
            <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#16181d]">
                <table className="w-full text-left">
                    <thead className="bg-[#1c1f26] text-gray-400">
                        <tr>
                            <th className="p-4">Asset</th>
                            <th className="p-4">Supply APY</th>
                            <th className="p-4">Total Supplied</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-white divide-y divide-gray-800">
                        {assets.map((asset, i) => (
                            <motion.tr 
                                whileHover={{ backgroundColor: '#1c1f26' }}
                                key={i}
                            >
                                <td className="p-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                                    {asset.name}
                                </td>
                                <td className="p-4 text-green-400 font-mono">{asset.apy}</td>
                                <td className="p-4">{asset.tvl}</td>
                                <td className="p-4">
                                    <button className="bg-blue-600 px-4 py-1 rounded text-sm">Supply</button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Markets;