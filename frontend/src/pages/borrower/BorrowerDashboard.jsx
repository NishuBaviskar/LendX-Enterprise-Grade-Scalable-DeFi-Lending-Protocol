import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { ShieldCheck, AlertTriangle, Info, Loader2, TrendingUp, RefreshCw } from 'lucide-react';
import { ethers } from 'ethers';

const BorrowerDashboard = () => {
    const { contract, account, loading: web3Loading } = useWeb3();
    const [data, setData] = useState({ hf: '0', borrowed: '0', collateral: '0' });
    const [isFetching, setIsFetching] = useState(false);

    const fetchBorrowerData = useCallback(async () => {
        // PREVENT FETCH IF NO CONTRACT OR ACCOUNT
        if (!contract || !account) return;
        
        setIsFetching(true);
        try {
            // CALLING SMART CONTRACT READ FUNCTIONS
            const hfRaw = await contract.getHealthFactor(account);
            const borrowRaw = await contract.userBorrows(account);
            const collateralRaw = await contract.userDeposits(account);
            
            // LOGIC: If Health Factor is excessively high (no debt), display as infinity
            const hfFormatted = ethers.formatUnits(hfRaw, 18);
            
            setData({
                hf: parseFloat(hfFormatted) > 1000000 ? "Infinity" : parseFloat(hfFormatted).toFixed(2),
                borrowed: ethers.formatEther(borrowRaw),
                collateral: ethers.formatEther(collateralRaw)
            });
        } catch (err) {
            console.error("Blockchain Fetch Error:", err);
        } finally {
            setIsFetching(false);
        }
    }, [contract, account]);

    useEffect(() => {
        fetchBorrowerData();
    }, [fetchBorrowerData, contract]); // Re-fetch if contract instance updates

    if (web3Loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="text-blue-500 animate-spin" size={48} />
                <p className="text-gray-500 font-medium tracking-wide">Initializing Blockchain Connection...</p>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="bg-[#16181d] p-10 rounded-[32px] border border-gray-800 text-center">
                <ShieldCheck className="mx-auto text-gray-700 mb-4" size={64} />
                <h2 className="text-2xl font-bold text-white">Identity Not Verified</h2>
                <p className="text-gray-500 mt-2">Connect your MetaMask to pull real-time loan data.</p>
            </div>
        );
    }

    const isRisky = data.hf !== "Infinity" && parseFloat(data.hf) < 1.5 && parseFloat(data.hf) > 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Borrower Console</h1>
                    <p className="text-gray-500 font-medium italic">Active Session: {account.substring(0, 8)}...{account.substring(38)}</p>
                </div>
                <button 
                    onClick={fetchBorrowerData}
                    className="p-3 bg-gray-800 rounded-2xl text-gray-400 hover:text-blue-500 transition-all active:rotate-180"
                >
                    <RefreshCw size={20} className={isFetching ? "animate-spin" : ""} />
                </button>
            </header>

            {isRisky && (
                <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl flex items-center gap-4 animate-pulse">
                    <AlertTriangle className="text-red-500" />
                    <p className="text-red-500 text-sm font-black uppercase">Liquidation Warning: Health Factor below 1.5</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 🛡️ HEALTH FACTOR GAUGE */}
                <div className="bg-[#16181d] p-8 rounded-[40px] border border-gray-800 flex flex-col items-center justify-center text-center shadow-xl">
                    <p className="text-gray-500 mb-2 font-bold uppercase text-[10px] tracking-widest">Protocol Health</p>
                    <div className={`text-5xl font-black mb-4 ${data.hf === "Infinity" || parseFloat(data.hf) > 1.5 ? 'text-green-500' : 'text-red-500'}`}>
                        {data.hf === "Infinity" ? "∞" : data.hf}
                    </div>
                    <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                        <div 
                            className={`h-full transition-all duration-1000 ${data.hf === "Infinity" || parseFloat(data.hf) > 1.5 ? 'bg-green-500' : 'bg-red-500'}`} 
                            style={{ width: `${data.hf === "Infinity" ? 100 : Math.min(parseFloat(data.hf) * 40, 100)}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-gray-600 mt-4 leading-tight uppercase font-bold">Safety threshold: 1.0</p>
                </div>

                {/* 💰 FINANCIAL STATS */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#16181d] p-8 rounded-[40px] border border-gray-800 relative overflow-hidden group">
                        <TrendingUp size={100} className="absolute -right-4 -bottom-4 text-blue-500/5 group-hover:text-blue-500/10 transition-all" />
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Locked Collateral</p>
                        <h2 className="text-4xl font-black text-white mt-2">{data.collateral} <span className="text-sm text-gray-600">ETH</span></h2>
                        <div className="mt-4 flex items-center gap-2 text-[10px] text-blue-500 font-bold uppercase">
                            <ShieldCheck size={12} /> Insurance Backed
                        </div>
                    </div>

                    <div className="bg-[#16181d] p-8 rounded-[40px] border border-gray-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-3xl rounded-full" />
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Active Debt</p>
                        <h2 className="text-4xl font-black text-white mt-2">{data.borrowed} <span className="text-sm text-gray-600">ETH</span></h2>
                        <p className="text-[10px] text-gray-600 mt-4 uppercase font-bold">Variable Interest: 4.2% APY</p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-600/5 border border-blue-500/20 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-blue-600 text-white rounded-3xl shadow-lg shadow-blue-500/20">
                        <Info size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Enterprise Loan Limit</h3>
                        <p className="text-gray-500 text-sm">Your Maximum Borrowing Capacity is 80% of Collateral (LTV).</p>
                    </div>
                </div>
                <button className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-blue-500 hover:text-white transition-all">
                    Adjust Collateral
                </button>
            </div>
        </div>
    );
};

export default BorrowerDashboard;