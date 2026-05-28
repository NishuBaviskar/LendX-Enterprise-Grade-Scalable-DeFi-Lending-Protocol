import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { ethers } from 'ethers';
import { ArrowRight, Repeat, Loader2, Globe, ShieldCheck, AlertCircle } from 'lucide-react';
import BridgeArtifact from '../../abis/Bridge.json';

const CrossChain = () => {
    const { account } = useWeb3();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('Idle');

    const handleBridgeTransfer = async () => {
        if (!amount || !account) return;
        setLoading(true);
        setStatus('Pending');

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // CRITICAL: Ensure this address is updated in your .env after truffle migrate
            const bridgeAddress = import.meta.env.VITE_BRIDGE_ADDRESS;
            
            if (!bridgeAddress || bridgeAddress === "0x") {
                throw new Error("Bridge address not configured in .env");
            }

            const bridgeContract = new ethers.Contract(bridgeAddress, BridgeArtifact.abi, signer);

            const valInWei = ethers.parseEther(amount);

            // Execute Bridge Lock
            // We pass address(0) for ETH and include the { value } object
            const tx = await bridgeContract.lockToken(
                "0x0000000000000000000000000000000000000000", 
                valInWei,
                137, 
                { value: valInWei } 
            );

            console.log("Bridge transaction initiated:", tx.hash);
            await tx.wait();
            
            setStatus('Success');
            setTimeout(() => setStatus('Idle'), 5000);
            setAmount('');
        } catch (error) {
            console.error("Bridge Transfer Failed:", error);
            setStatus('Idle');
            alert(`Transfer failed: ${error.reason || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-4 animate-in fade-in">
            <header className="text-center space-y-2">
                <h1 className="text-4xl font-black text-white tracking-tighter">LendX Bridge</h1>
                <p className="text-gray-500 font-medium">Interoperable Asset Transfers (L1 ↔ Sidechain)</p>
            </header>

            <div className="bg-[#16181d] p-10 rounded-[40px] border border-gray-800 relative overflow-hidden shadow-2xl">
                {status === 'Success' && (
                    <div className="absolute inset-0 bg-green-500/10 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-2 animate-in fade-in">
                        <ShieldCheck size={48} className="text-green-500" />
                        <p className="text-white font-bold text-xl">Assets Locked on L1</p>
                        <p className="text-gray-400 text-sm">Relaying to Polygon PoS...</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Source Network</label>
                        <div className="bg-[#0a0b0d] p-6 rounded-3xl border border-gray-800 flex items-center justify-between group hover:border-blue-500/50 transition-colors">
                            <span className="text-white font-bold">Ethereum (Ganache)</span>
                            <div className="w-8 h-8 bg-blue-500/20 rounded-full border border-blue-500/30 group-hover:bg-blue-500/40 transition-all" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Destination</label>
                        <div className="bg-[#0a0b0d] p-6 rounded-3xl border border-gray-800 flex items-center justify-between group hover:border-purple-500/50 transition-colors">
                            <span className="text-white font-bold">Polygon zkEVM</span>
                            <div className="w-8 h-8 bg-purple-500/20 rounded-full border border-purple-500/30 group-hover:bg-purple-500/40 transition-all" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center -my-6 relative z-20">
                    <div className="bg-gray-800 p-4 rounded-full border-8 border-[#16181d] shadow-xl">
                        <Repeat className={`text-white transition-transform duration-1000 ${loading ? 'animate-spin' : ''}`} />
                    </div>
                </div>

                <div className="mt-12 space-y-6">
                    <div className="bg-[#0a0b0d] p-8 rounded-3xl border border-gray-800 focus-within:border-blue-500 transition-all">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount to Bridge</label>
                        <input 
                            type="number" 
                            placeholder="0.00 ETH" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-transparent border-none p-0 mt-2 text-4xl font-black text-white outline-none placeholder:text-gray-800" 
                        />
                    </div>
                    
                    <button 
                        onClick={handleBridgeTransfer}
                        disabled={loading || !amount}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-6 rounded-2xl text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/20"
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : "Initiate Cross-Chain Transfer"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CrossChain;