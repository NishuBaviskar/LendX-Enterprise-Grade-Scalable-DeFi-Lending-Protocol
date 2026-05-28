import React, { useState } from 'react';
import { FileText, Save, Info, Layers, ShieldAlert } from 'lucide-react';

const CreateProposal = () => {
    const [formData, setFormData] = useState({ title: '', desc: '', type: 'PARAM' });

    return (
        <div className="max-w-3xl mx-auto space-y-8 py-4">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-white">Draft Proposal</h1>
                <p className="text-gray-500">Propose a change to the LendX ecosystem</p>
            </header>

            <div className="bg-[#16181d] p-10 rounded-[40px] border border-gray-800 space-y-6 shadow-2xl">
                <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">LIP Title</label>
                    <input 
                        type="text" 
                        placeholder="e.g., LIP-04: Adjust Liquidation Penalty"
                        className="w-full bg-[#0a0b0d] border border-gray-800 p-5 rounded-2xl text-white outline-none focus:border-purple-500 transition-all"
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />

                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Proposal Category</label>
                    
                    {/* MODIFIED CODE: UUPS Upgrade Support & Advanced Features */}
                    <div className="relative">
                        <select 
                            className="w-full bg-[#0a0b0d] border border-gray-800 p-5 rounded-2xl text-white outline-none focus:border-purple-500 appearance-none transition-all"
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                        >
                            <option value="PARAM">Parameter Change (Interest Rates)</option>
                            <option value="UPGRADE">UUPS Contract Upgrade (Implementation V2)</option>
                            <option value="SHARD">Add New Shard Pool (Liquidity Segmentation)</option>
                            <option value="ASSET">New Asset Listing</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            <Layers size={18} />
                        </div>
                    </div>

                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Description & Rationale</label>
                    <textarea 
                        rows="6"
                        placeholder="Describe why this change is needed..."
                        className="w-full bg-[#0a0b0d] border border-gray-800 p-5 rounded-2xl text-white outline-none focus:border-purple-500 transition-all resize-none"
                        onChange={(e) => setFormData({...formData, desc: e.target.value})}
                    />
                </div>

                {/* Conditional Alert for UUPS Upgrades */}
                {formData.type === 'UPGRADE' && (
                    <div className="bg-blue-600/10 p-5 rounded-2xl border border-blue-500/30 flex items-start gap-4 animate-in slide-in-from-top-2 duration-300">
                        <ShieldAlert className="text-blue-500 shrink-0" size={20} />
                        <div>
                            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">UUPS Implementation Notice</p>
                            <p className="text-[11px] text-gray-400 mt-1">
                                This proposal will trigger the `upgradeToAndCall` function. Ensure the new implementation address is verified on-chain before execution.
                            </p>
                        </div>
                    </div>
                )}

                <div className="bg-purple-600/5 p-6 rounded-2xl border border-purple-500/10 flex items-start gap-4">
                    <Info className="text-purple-500 shrink-0" size={20} />
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Submitting a proposal requires a minimum of **10,000 LX** voting power. Once submitted, the proposal will enter a 48-hour voting window.
                    </p>
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20">
                    <Save size={20} /> Launch Proposal
                </button>
            </div>
        </div>
    );
};

export default CreateProposal;