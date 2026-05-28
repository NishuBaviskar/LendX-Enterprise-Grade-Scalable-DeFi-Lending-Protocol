import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { motion, AnimatePresence } from 'framer-motion';

const Governance = () => {
    const { contract, account } = useWeb3();
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch existing proposals from the DAO contract
    const fetchProposals = async () => {
        if (!contract) return;
        const count = await contract.proposalCount();
        const items = [];
        for (let i = 1; i <= count; i++) {
            const p = await contract.proposals(i);
            items.push(p);
        }
        setProposals(items.reverse());
    };

    const handleVote = async (id, support) => {
        setLoading(true);
        try {
            const tx = await contract.vote(id, support);
            await tx.wait();
            fetchProposals();
        } catch (err) {
            console.error("Voting failed", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProposals();
    }, [contract]);

    return (
        <div className="p-8 bg-[#0a0b0d] min-h-screen text-white">
            <h2 className="text-3xl font-bold mb-8">Protocol Governance</h2>
            
            <div className="grid gap-6">
                {proposals.map((p) => (
                    <motion.div 
                        key={p.id.toString()}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#16181d] border border-gray-800 p-6 rounded-xl"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs text-blue-400 font-mono">PROPOSAL #{p.id.toString()}</span>
                                <h3 className="text-xl font-semibold mt-1">{p.description}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Status</p>
                                <span className="text-green-400">Active</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => handleVote(p.id, true)}
                                className="bg-green-600/20 border border-green-600 hover:bg-green-600 py-3 rounded-lg transition"
                            >
                                Vote For ({p.votesFor.toString()})
                            </button>
                            <button 
                                onClick={() => handleVote(p.id, false)}
                                className="bg-red-600/20 border border-red-600 hover:bg-red-600 py-3 rounded-lg transition"
                            >
                                Vote Against ({p.votesAgainst.toString()})
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Governance;