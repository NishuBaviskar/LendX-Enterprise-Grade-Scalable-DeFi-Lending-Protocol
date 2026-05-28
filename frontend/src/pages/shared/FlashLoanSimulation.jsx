import React, { useState } from 'react';
import { Zap, ShieldCheck, Play, Terminal } from 'lucide-react';

const FlashLoanSimulation = () => {
    const [executing, setExecuting] = useState(false);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Zap className="text-yellow-500 fill-yellow-500" /> Flash Loan Simulator
                </h1>
                <p className="text-gray-500">Execute zero-collateral arbitrage within a single atomic transaction.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800 space-y-6">
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loan Amount</label>
                        <input type="number" placeholder="100.0 ETH" className="w-full bg-[#0a0b0d] border border-gray-800 p-5 rounded-2xl text-white outline-none focus:border-yellow-500" />
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 p-5 rounded-2xl flex items-start gap-3">
                        <ShieldCheck className="text-yellow-500 shrink-0" size={20} />
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Flash loans must be repaid in the same block. If the repayment + 0.09% fee is not returned, the transaction reverts as if it never happened.
                        </p>
                    </div>
                    <button onClick={() => setExecuting(true)} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                        <Play size={18} fill="currentColor" /> Execute Atomic Arb
                    </button>
                </div>

                <div className="bg-[#0a0b0d] p-6 rounded-[32px] border border-gray-800 font-mono text-xs overflow-hidden">
                    <div className="flex items-center gap-2 mb-4 text-gray-600">
                        <Terminal size={14} /> <span>Simulation Console</span>
                    </div>
                    <div className="space-y-2 text-green-500">
                        <p>{'>'} Requesting 100 ETH Flash Loan...</p>
                        {executing && (
                            <>
                                <p>{'>'} Loan Approved (Nonce: 0x88...)</p>
                                <p>{'>'} Executing Arbitrage on Uniswap V3...</p>
                                <p className="text-yellow-500">{'>'} Profit Found: 1.25 ETH</p>
                                <p>{'>'} Repaying Principal + 0.09 ETH Fee...</p>
                                <p className="text-white font-bold">{'>'} TRANSACTION SUCCESSFUL</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashLoanSimulation;