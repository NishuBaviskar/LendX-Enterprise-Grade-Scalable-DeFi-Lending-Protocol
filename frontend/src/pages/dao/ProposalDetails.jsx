import React from 'react';
import { useParams } from 'react-router-dom';
import { Vote, ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

const ProposalDetails = () => {
    const { id } = useParams();

    return (
        <div className="max-w-4xl space-y-8">
            <header className="flex items-center gap-4">
                <button className="p-3 bg-gray-800 rounded-2xl text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-3xl font-bold text-white">Proposal #{id}</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-blue-600/10 text-blue-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">Active</span>
                            <span className="text-gray-500 text-xs">Proposed by 0x55b...99a</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">LIP-01: Increase ETH Collateral Factor to 85%</h2>
                        <p className="text-gray-400 leading-relaxed">
                            This proposal aims to increase capital efficiency for ETH borrowers. Given the high liquidity and low volatility of ETH over the last quarter, we suggest raising the Max LTV to 85% to stay competitive with other market protocols.
                        </p>
                    </div>

                    <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            <MessageSquare size={18} /> Discussion
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-[#0a0b0d] rounded-2xl border border-gray-800">
                                <p className="text-sm text-gray-400">"This increases protocol risk slightly, but the liquidity depth justifies it." - Auditor_0x</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800 space-y-6 text-center">
                        <h3 className="text-white font-bold">Cast Your Vote</h3>
                        <button className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all">
                            <ThumbsUp size={18} /> For
                        </button>
                        <button className="w-full py-4 bg-red-600/10 text-red-500 border border-red-500/30 hover:bg-red-600 hover:text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all">
                            <ThumbsDown size={18} /> Against
                        </button>
                    </div>

                    <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
                        <h3 className="text-white font-bold mb-4">Current Results</h3>
                        <div className="space-y-4">
                            <VoteBar label="For" percent={82} color="bg-green-500" />
                            <VoteBar label="Against" percent={18} color="bg-red-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VoteBar = ({ label, percent, color }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-xs font-bold text-gray-500">
            <span>{label}</span>
            <span>{percent}%</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
        </div>
    </div>
);

export default ProposalDetails;