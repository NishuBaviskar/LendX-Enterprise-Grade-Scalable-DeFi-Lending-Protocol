import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';

const LiquidationList = () => {
    const { contract } = useWeb3();
    const [atRiskUsers, setAtRiskUsers] = useState([]);

    // In a production app, we would use The Graph to index all users.
    // For this simulation, we check a list of known addresses.
    const checkRiskyUsers = async () => {
        const users = ["0xUserAddress1...", "0xUserAddress2..."]; 
        const risky = [];

        for (const addr of users) {
            const hf = await contract.getHealthFactor(addr);
            const hfFloat = parseFloat(ethers.formatEther(hf));
            if (hfFloat < 1.1) { // Alerting at 1.1, liquidatable at 1.0
                risky.push({ address: addr, healthFactor: hfFloat });
            }
        }
        setAtRiskUsers(risky);
    };

    return (
        <div className="bg-[#16181d] rounded-xl overflow-hidden border border-red-900/30">
            <div className="bg-red-900/10 p-4 border-b border-red-900/30">
                <h3 className="text-red-500 font-bold flex items-center">
                    <span className="mr-2">⚠️</span> High Risk Positions
                </h3>
            </div>
            <table className="w-full text-left">
                <thead className="bg-[#1c1f26] text-gray-400 text-sm">
                    <tr>
                        <th className="p-4">User Address</th>
                        <th className="p-4">Health Factor</th>
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {atRiskUsers.map(user => (
                        <tr key={user.address}>
                            <td className="p-4 font-mono text-xs">{user.address}</td>
                            <td className={`p-4 font-bold ${user.healthFactor < 1 ? 'text-red-500' : 'text-yellow-500'}`}>
                                {user.healthFactor.toFixed(4)}
                            </td>
                            <td className="p-4">
                                <button className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded">
                                    Liquidate
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};