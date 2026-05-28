import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';

const DepositModal = ({ isOpen, onClose, contract }) => {
    const [amount, setAmount] = useState('');

    const handleDeposit = async () => {
        if (!amount) return;
        try {
            const tx = await contract.deposit({ value: ethers.parseEther(amount) });
            await tx.wait();
            onClose();
        } catch (err) {
            console.error("Deposit Error:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#16181d] border border-gray-800 w-full max-w-md p-6 rounded-2xl shadow-2xl"
            >
                <h2 className="text-xl font-bold text-white mb-4">Deposit Collateral</h2>
                <div className="bg-[#0a0b0d] p-4 rounded-xl border border-gray-800 mb-6">
                    <label className="text-xs text-gray-500 uppercase">Amount (ETH)</label>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-transparent text-2xl font-mono text-white outline-none mt-1"
                    />
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 text-gray-400 hover:bg-gray-800 rounded-xl transition">Cancel</button>
                    <button onClick={handleDeposit} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">Confirm Deposit</button>
                </div>
            </motion.div>
        </div>
    );
};

export default DepositModal;