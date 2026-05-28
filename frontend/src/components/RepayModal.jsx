import React, { useState } from 'react';
import { ethers } from 'ethers';

const RepayModal = ({ isOpen, onClose, contract }) => {
    const [amount, setAmount] = useState('');

    const handleRepay = async () => {
        try {
            const tx = await contract.repay({ value: ethers.parseEther(amount) });
            await tx.wait();
            onClose();
        } catch (err) { console.error(err); }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
            <div className="bg-[#16181d] border border-gray-800 w-96 p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">Repay Loan</h3>
                <p className="text-xs text-gray-500 mb-2">Principal + Interest</p>
                <input 
                    type="number"
                    className="w-full bg-[#0a0b0d] border border-gray-800 p-3 rounded-lg text-white mb-4"
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button onClick={handleRepay} className="w-full bg-green-600 text-white py-3 rounded-xl">Repay Now</button>
            </div>
        </div>
    );
};