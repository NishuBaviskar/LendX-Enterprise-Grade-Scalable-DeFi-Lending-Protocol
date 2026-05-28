import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { X, Loader2, AlertCircle, ArrowRight, Wallet } from 'lucide-react';

const L2WithdrawModal = ({ isOpen, onClose, contract, account, currentBalance, onRefresh }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewBalance, setPreviewBalance] = useState(currentBalance);

    // Update preview whenever amount changes
    useEffect(() => {
        const val = parseFloat(amount) || 0;
        const remaining = parseFloat(currentBalance) - val;
        setPreviewBalance(remaining >= 0 ? remaining.toFixed(4) : "0.00");
    }, [amount, currentBalance]);

    if (!isOpen) return null;

    const handleWithdraw = async (e) => {
        e.preventDefault();
        if (!amount || !contract) return;

        setLoading(true);
        try {
            // Call the new withdraw function we added to the contract
            const tx = await contract.withdraw(ethers.parseEther(amount));
            await tx.wait();
            
            alert("Withdrawal Successful!");
            onRefresh(); // Refresh the parent dashboard data
            onClose();
        } catch (err) {
            console.error(err);
            alert("Withdrawal Failed: Ensure you aren't withdrawing collateral backing an active loan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0a0b0d]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#16181d] w-full max-w-md rounded-[40px] border border-gray-800 p-8 relative shadow-2xl animate-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute right-6 top-6 text-gray-500 hover:text-white">
                    <X size={24} />
                </button>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Withdraw ETH</h2>
                    <p className="text-sm text-gray-500 font-medium">Reclaim your liquidity from the pool</p>
                </div>

                <form onSubmit={handleWithdraw} className="space-y-6">
                    {/* Amount Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between px-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount to Withdraw</label>
                            <span className="text-[10px] text-blue-500 font-bold">MAX: {currentBalance} ETH</span>
                        </div>
                        <div className="relative">
                            <input 
                                type="number" step="0.01" value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-[#0a0b0d] border border-gray-800 p-5 rounded-2xl text-xl font-bold text-white focus:border-blue-500 outline-none"
                                placeholder="0.00"
                                required
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-blue-500">ETH</span>
                        </div>
                    </div>

                    {/* Preview Box */}
                    <div className="bg-blue-600/5 border border-blue-500/10 p-5 rounded-3xl flex items-center justify-between">
                        <div className="text-center">
                            <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Current</p>
                            <p className="text-sm font-bold text-gray-400">{currentBalance} ETH</p>
                        </div>
                        <ArrowRight className="text-gray-700" size={16} />
                        <div className="text-center">
                            <p className="text-[9px] text-blue-500 font-bold uppercase mb-1">Remaining</p>
                            <p className="text-lg font-black text-white">{previewBalance} ETH</p>
                        </div>
                    </div>

                    {/* Warning Note */}
                    <div className="flex gap-3 px-1">
                        <AlertCircle className="text-gray-600 shrink-0" size={16} />
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                            Withdrawals are processed on Layer 1 (Sepolia). Ensure you have enough ETH for gas fees.
                        </p>
                    </div>

                    <button 
                        type="submit" disabled={loading || !amount || parseFloat(amount) > parseFloat(currentBalance)}
                        className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-blue-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : "Confirm Withdrawal"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default L2WithdrawModal;