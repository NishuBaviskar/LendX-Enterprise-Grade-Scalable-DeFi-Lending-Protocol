import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { account, contract, connectWallet } = useWeb3();
    const [healthFactor, setHealthFactor] = useState("0");

    useEffect(() => {
        if (contract && account) {
            const fetchHealth = async () => {
                const hf = await contract.getHealthFactor(account);
                setHealthFactor(ethers.formatEther(hf));
            };
            fetchHealth();
            // Real-time update listener
            contract.on("Deposited", fetchHealth);
        }
    }, [contract, account]);

    return (
        <div className="min-h-screen bg-[#0a0b0d] text-white p-8">
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                    LendX Protocol
                </h1>
                <button 
                    onClick={connectWallet}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition"
                >
                    {account ? `${account.substring(0,6)}...${account.substring(38)}` : "Connect Wallet"}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Health Factor Gauge */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#16181d] p-6 rounded-2xl border border-gray-800"
                >
                    <h3 className="text-gray-400 mb-2">Your Health Factor</h3>
                    <div className="text-4xl font-mono text-green-400">
                        {parseFloat(healthFactor) > 100 ? "∞" : healthFactor}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Liquidation occurs at &lt; 1.0</p>
                </motion.div>

                {/* Net Worth Card */}
                <div className="bg-[#16181d] p-6 rounded-2xl border border-gray-800">
                    <h3 className="text-gray-400 mb-2">Net Worth</h3>
                    <div className="text-4xl font-bold">$12,450.00</div>
                </div>

                {/* APY Rewards */}
                <div className="bg-[#16181d] p-6 rounded-2xl border border-gray-800">
                    <h3 className="text-gray-400 mb-2">Avg. Supply APY</h3>
                    <div className="text-4xl font-bold text-purple-400">4.2%</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;