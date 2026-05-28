import React, { useState } from 'react';
import { ethers } from 'ethers';

const BorrowModal = ({ isOpen, onClose, contract }) => {
    const [amount, setAmount] = useState('');

    const handleBorrow = async () => {
        try {
            const tx = await contract.borrow(ethers.parseEther(amount));
            await tx.wait();
            onClose();
        } catch (err) {
            alert("Transaction Reverted: Check Health Factor");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
            <div className="bg-[#16181d] border border-gray-800 w-96 p-6 rounded-2xl">
                <h3 className="text-white font-bold mb-4">Borrow Assets</h3>
                <input 
                    type="number"
                    className="w-full bg-[#0a0b0d] border border-gray-800 p-3 rounded-lg text-white mb-4"
                    placeholder="Amount to borrow..."
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button 
                    onClick={handleBorrow}
                    className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700"
                >
                    Execute Borrow
                </button>
            </div>
        </div>
    );
};

export default BorrowModal;