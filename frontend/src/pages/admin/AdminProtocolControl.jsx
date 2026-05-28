import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { ZapOff, UserX, Settings, ShieldAlert, Cpu } from 'lucide-react';

const AdminProtocolControl = () => {
    const { contract } = useWeb3();
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const togglePause = async () => {
        setLoading(true);
        try {
            const tx = await contract.togglePause();
            await tx.wait();
            alert("Protocol State Changed!");
        } catch (e) { alert("Access Denied: SuperAdmin only"); }
        setLoading(false);
    };

    return (
        <div className="max-w-5xl space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">Protocol Control Room</h1>
                <p className="text-gray-500">Global administrative overrides and security parameters.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Emergency Controls */}
                <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-[32px] space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/20 rounded-2xl"><ZapOff className="text-red-500" /></div>
                        <h3 className="text-xl font-bold text-white">Emergency Stop</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Immediately halt all contract interactions including deposits, borrows, and withdrawals. This should only be used in case of a critical vulnerability.
                    </p>
                    <button onClick={togglePause} disabled={loading} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-900/20">
                        {loading ? "Processing..." : "Trigger Emergency Pause"}
                    </button>
                </div>

                {/* Blacklist Management */}
                <div className="bg-[#16181d] border border-gray-800 p-8 rounded-[32px] space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-500/10 rounded-2xl"><UserX className="text-orange-500" /></div>
                        <h3 className="text-xl font-bold text-white">Risk Restriction</h3>
                    </div>
                    <p className="text-sm text-gray-400">Restrict a specific wallet address from using the protocol due to detected malicious activity.</p>
                    <input 
                        type="text" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="0x... address" 
                        className="w-full bg-[#0a0b0d] border border-gray-800 p-4 rounded-xl text-white outline-none focus:border-blue-500"
                    />
                    <button className="w-full py-4 bg-[#2b2f36] hover:bg-orange-600 text-white font-bold rounded-2xl transition-all">
                        Update Blacklist
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProtocolControl;