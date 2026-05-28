import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { ethers } from 'ethers';
import { Layers, Loader2, CheckCircle, Zap, AlertCircle } from 'lucide-react';
import RollupArtifact from '../../abis/RollupBatcher.json';

const L2DepositModal = ({ isOpen, onClose }) => {
    // Pulling account and base web3 state from context
    const { account } = useWeb3();
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('idle'); // idle | batching | success | error

    const handleL2Deposit = async () => {
        if (!amount || !account) return;
        setStatus('batching');

        try {
            // 1. Explicitly get the signer for this transaction
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // 2. Initialize the RollupBatcher Contract
            const rollupAddress = import.meta.env.VITE_ROLLUP_BATCHER_ADDRESS;
            
            if (!rollupAddress) {
                console.error("VITE_ROLLUP_BATCHER_ADDRESS is missing in .env");
                setStatus('error');
                return;
            }

            const rollupContract = new ethers.Contract(rollupAddress, RollupArtifact.abi, signer);

            // 3. Submit to L2 Batcher (zkEVM Simulation)
            const tx = await rollupContract.submitTransaction(
                ethers.parseEther(amount),
                "DEPOSIT"
            );
            
            console.log("L2 Transaction Sent:", tx.hash);
            await tx.wait();
            
            // 4. Update Backend Audit Log for the Auditor
            try {
                await fetch('http://localhost:5000/api/l2/batch-log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        batchId: Date.now(), 
                        txCount: 1, 
                        stateRoot: tx.hash 
                    })
                });
            } catch (apiError) {
                console.warn("Backend log failed, but blockchain tx was successful:", apiError);
            }

            setStatus('success');
            
            // Auto-close after success
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setAmount('');
            }, 3000);
        } catch (error) {
            // CHECK FOR USER REJECTION (Error 4001)
            if (error.code === "ACTION_REJECTED" || error.code === 4001) {
                console.warn("User rejected the transaction signature.");
                setStatus('idle'); // Silent reset to idle
            } else {
                console.error("L2 Batching Failed", error);
                setStatus('error');
                setTimeout(() => setStatus('idle'), 4000);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#16181d] w-full max-w-md rounded-[32px] border border-blue-500/20 p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                        <Layers size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">L2 Rollup Deposit</h2>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">zkEVM Batching Engine</p>
                    </div>
                </div>

                {status === 'success' ? (
                    <div className="py-10 text-center space-y-4 animate-in zoom-in">
                        <CheckCircle className="text-green-500 mx-auto" size={64} />
                        <p className="text-white font-bold text-lg">Transaction Batched!</p>
                        <p className="text-gray-500 text-sm">Your deposit is part of the next L1 finalization.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-[#0a0b0d] p-6 rounded-2xl border border-gray-800 focus-within:border-blue-500 transition-all">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount (ETH)</label>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-transparent text-2xl font-bold text-white outline-none mt-2"
                                placeholder="0.00"
                            />
                        </div>

                        {status === 'error' && (
                            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-xl text-xs font-bold">
                                <AlertCircle size={14} /> Transaction Failed. Try again.
                            </div>
                        )}

                        <div className="flex items-start gap-3 p-4 bg-blue-600/5 rounded-xl border border-blue-500/10">
                            <Zap className="text-blue-500 shrink-0" size={18} />
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                Your transaction is batched off-chain and submitted as a group. This reduces gas costs by <b>~90%</b>.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={onClose} className="flex-1 py-4 bg-gray-800 text-white font-bold rounded-2xl transition-colors hover:bg-gray-700">Cancel</button>
                            <button 
                                onClick={handleL2Deposit}
                                disabled={status === 'batching' || !amount}
                                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                            >
                                {status === 'batching' ? <Loader2 className="animate-spin" size={20} /> : "Supply L2"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default L2DepositModal;