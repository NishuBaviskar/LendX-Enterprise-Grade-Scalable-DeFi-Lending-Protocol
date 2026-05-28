import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { ethers } from 'ethers';
import { Crosshair, Zap, AlertTriangle, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';
import FlashArtifact from '../../abis/FlashLoanProtection.json';

const LiquidationCenter = () => {
    const { contract, signer } = useWeb3(); 
    const [riskyPositions, setRiskyPositions] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState(null);

    // --- FLASH LOAN PROTECTION LOGIC ---
    const getSecureHealthFactor = async (userAddress) => {
        try {
            const FLASH_PROT_ADDR = import.meta.env.VITE_FLASH_PROTECTION_ADDRESS;
            if (!FLASH_PROT_ADDR) return "1.0"; // Fallback if addr not set

            const protectionContract = new ethers.Contract(
                FLASH_PROT_ADDR, 
                FlashArtifact.abi, 
                signer
            );

            // Fetch the verified HF using the Snapshot mechanism
            const secureHF = await protectionContract.verifyHealthFactor(userAddress);
            return ethers.formatUnits(secureHF, 18);
        } catch (err) {
            console.error("Security check failed:", err);
            return "0.0";
        }
    };

    const scanPositions = async () => {
        if (!signer) return;
        setScanning(true);
        setError(null);
        try {
            // Now points to the route we just created
            const response = await api.get('/audit/risky-positions');
            
            const verifiedPositions = await Promise.all(
                response.data.map(async (pos) => {
                    const secureHF = await getSecureHealthFactor(pos.address);
                    return { ...pos, secureHF };
                })
            );

            setRiskyPositions(verifiedPositions);
        } catch (err) {
            console.error("Error scanning positions:", err);
            setError("Auditor API Offline. Check backend server.");
        } finally {
            setScanning(false);
        }
    };

    useEffect(() => {
        if (signer) scanPositions();
    }, [signer]); 

    const handleLiquidate = async (user, debt) => {
        try {
            const finalHF = await getSecureHealthFactor(user);
            if (parseFloat(finalHF) >= 1) {
                alert("🚨 Blocked: Snapshot HF is safe. Flash loan manipulation detected!");
                return;
            }

            const tx = await contract.liquidate(user, { value: ethers.parseEther(debt) });
            await tx.wait();
            alert("✅ Liquidation Successful!");
            scanPositions();
        } catch (err) {
            alert("Execution Failed: Check balance or Role permissions.");
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center bg-[#16181d] p-8 rounded-[40px] border border-gray-800">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Crosshair className="text-red-500" /> Target Center
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Scanning Sepolia for insolvent vaults</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 bg-blue-500/10 px-4 py-2 rounded-2xl border border-blue-500/20">
                        <ShieldCheck size={14} /> Flash Guard Active
                    </div>
                    <button 
                        onClick={scanPositions}
                        className="p-3 bg-gray-800 rounded-2xl text-white hover:bg-gray-700 transition-all"
                    >
                        <Loader2 className={scanning ? "animate-spin" : ""} size={20} />
                    </button>
                </div>
            </header>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm flex items-center gap-2">
                    <AlertTriangle size={16} /> {error}
                </div>
            )}
            
            <div className="grid gap-4">
                {riskyPositions.length === 0 ? (
                    <div className="p-20 border border-dashed border-gray-800 rounded-[40px] text-center">
                        <CheckCircle2 size={48} className="text-gray-800 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Protocol Solvency: 100%</p>
                    </div>
                ) : (
                    riskyPositions.map((pos, i) => (
                        <div key={i} className="bg-[#16181d] p-6 rounded-[32px] border border-red-500/20 flex justify-between items-center transition-all hover:border-red-500/40">
                            <div className="space-y-3">
                                <p className="text-xs font-mono text-blue-500 bg-blue-500/5 px-3 py-1 rounded-lg inline-block">
                                    {pos.address}
                                </p>
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black">Snapshot HF</p>
                                        <p className="text-xl font-bold text-red-400">{pos.secureHF}</p>
                                    </div>
                                    <div className="border-l border-gray-800 pl-8">
                                        <p className="text-[10px] text-gray-500 uppercase font-black">Repayment Amt</p>
                                        <p className="text-xl font-bold text-white">{pos.debt} ETH</p>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleLiquidate(pos.address, pos.debt)}
                                className="bg-red-600 hover:bg-red-700 text-white px-8 py-5 rounded-3xl font-bold flex items-center gap-3 shadow-xl shadow-red-900/20 active:scale-95 transition-all"
                            >
                                <Zap size={18} fill="currentColor" /> Execute
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LiquidationCenter;