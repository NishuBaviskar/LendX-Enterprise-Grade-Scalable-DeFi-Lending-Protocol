import React from 'react';

const MarketTable = ({ assets, onAction }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="text-gray-500 text-xs uppercase border-b border-gray-800">
                    <tr>
                        <th className="px-6 py-4">Asset</th>
                        <th className="px-6 py-4 text-right">Market Size</th>
                        <th className="px-6 py-4 text-right">APY</th>
                        <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {assets.map((asset) => (
                        <tr key={asset.symbol} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">{asset.name}</td>
                            <td className="px-6 py-4 text-right font-mono text-gray-400">{asset.tvl}</td>
                            <td className="px-6 py-4 text-right text-green-400 font-mono">{asset.apy}</td>
                            <td className="px-6 py-4 text-center">
                                <button 
                                    onClick={() => onAction(asset)}
                                    className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition"
                                >
                                    Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MarketTable;