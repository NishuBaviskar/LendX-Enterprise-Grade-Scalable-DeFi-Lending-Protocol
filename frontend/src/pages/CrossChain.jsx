import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, ArrowRightLeft, ShieldCheck } from 'lucide-react';

const CrossChain = () => {
    const [isBridging, setIsBridging] = useState(false);

    const handleBridge = () => {
        setIsBridging(true);
        setTimeout(() => setIsBridging(false), 3000);
    };

    return (
        <div className="p-8 text-white max-w-4xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold mb-2">Omni-Chain Portal</h1>
                <p className="text-gray-500">Securely move liquidity between Polygon, Ethereum, and Arbitrum Simulation.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#16181d] border border-gray-800 p-6 rounded-3xl">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-bold text-blue-400">SOURCE</span>
                        <span className="bg-gray-800 px-3 py-1 rounded-full text-xs">Ethereum</span>
                    </div>
                    <div className="bg-[#0a0b0d] p-6 rounded-2xl border border-gray-800 text-center">
                        <p className="text-gray-500 text-xs mb-1">Balance</p>
                        <h2 className="text-3xl font-mono">14.50 ETH</h2>
                    </div>
                </div>

                <div className="bg-[#16181d] border border-gray-800 p-6 rounded-3xl">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-bold text-purple-400">DESTINATION</span>
                        <span className="bg-gray-800 px-3 py-1 rounded-full text-xs">Polygon PoS</span>
                    </div>
                    <div className="bg-[#0a0b0d] p-6 rounded-2xl border border-gray-800 text-center">
                        <p className="text-gray-500 text-xs mb-1">Expected</p>
                        <h2 className="text-3xl font-mono text-gray-400">--.-- MATIC</h2>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <button 
                    onClick={handleBridge}
                    disabled={isBridging}
                    className={`flex items-center gap-3 px-12 py-4 rounded-2xl font-bold transition-all ${
                        isBridging ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 shadow-xl shadow-purple-900/20'
                    }`}
                >
                    {isBridging ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Share2 /></motion.div> : <ArrowRightLeft />}
                    {isBridging ? 'Finalizing ZK-Proof...' : 'Initiate Cross-Chain Swap'}
                </button>
            </div>
        </div>
    );
};

export default CrossChain;