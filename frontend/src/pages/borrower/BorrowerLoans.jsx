import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { ethers } from 'ethers';
import { ArrowDownLeft, RefreshCcw, Info, Wallet, Zap, ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';
import api from '../../utils/api';
import axios from 'axios';

const BorrowerLoans = () => {
    const { contract, account, signer } = useWeb3();

    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [borrowPower, setBorrowPower] = useState('0.00');
    const [predictedHF, setPredictedHF] = useState(null);

    // EFFECT: Calculate Borrowing Power capped by Pool Liquidity
    useEffect(() => {
        if (contract && account) {
            const getPower = async () => {
                try {

                    const collateral = await contract.userDeposits(account);
                    const debt = await contract.userBorrows(account);

                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const poolLiquidity = await provider.getBalance(await contract.getAddress());

                    const colVal = Number(ethers.formatEther(collateral));
                    const debtVal = Number(ethers.formatEther(debt));
                    const poolVal = Number(ethers.formatEther(poolLiquidity));

                    const userLimit = (colVal * 0.8) - debtVal;

                    const finalLimit = Math.min(userLimit, poolVal);

                    setBorrowPower(finalLimit > 0 ? finalLimit.toFixed(4) : "0.00");

                    if (amount && parseFloat(amount) > 0) {
                        const newDebt = debtVal + parseFloat(amount);
                        const hf = (colVal * 0.85) / newDebt;
                        setPredictedHF(hf);
                    } else {
                        setPredictedHF(null);
                    }

                } catch (err) {
                    console.error("Power calculation failed", err);
                }
            };

            getPower();
        }

    }, [contract, account, amount, loading]);



    // UPDATED FUNCTION (NEW LOGIC ADDED HERE)
    const handleAction = async (type) => {

        if (!amount || !contract) return;

        setLoading(true);

        try {

            const tx = type === 'borrow'
                ? await contract.borrow(ethers.parseEther(amount))
                : await contract.repay({ value: ethers.parseEther(amount) });

            await tx.wait();

            // FIX: Use individual calls if getUserAccountData is missing
            const collateral = await contract.userDeposits(account);
            const debt = await contract.userBorrows(account);

            // Manual Health Factor Calculation
            const colVal = Number(ethers.formatEther(collateral));
            const debtVal = Number(ethers.formatEther(debt));

            const currentHF = debtVal > 0
                ? (colVal * 0.85) / debtVal
                : 100;

            await api.post('/risk/update', {
                address: account,
                hf: currentHF.toFixed(2),
                debt: debtVal.toFixed(4),
                type: type
            });

            alert(`${type.toUpperCase()} Successful!`);

            setAmount('');

        } catch (err) {

            console.error("Post-transaction sync failed:", err);

        } finally {

            setLoading(false);

        }
    };



    const handleStateChannelRepay = async () => {

        if (!amount || !account || !signer) return;

        setLoading(true);

        try {

            const message = ethers.solidityPackedKeccak256(
                ["address", "uint256", "uint256"],
                [account, ethers.parseEther(amount), Date.now()]
            );

            const signature = await signer.signMessage(ethers.getBytes(message));

            await api.post('/repay/offchain', {
                txData: {
                    user: account,
                    amount: amount,
                    token: "ETH",
                    type: "STATE_CHANNEL_REPAY"
                },
                signature: signature
            });

            alert("⚡ Gas-free repayment submitted via State Channel!");

            setAmount('');

        } catch (err) {

            console.error("State Channel Error:", err);

            if (err.code === 4001)
                alert("Signature rejected by user.");

        } finally {

            setLoading(false);

        }
    };



    return (

        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">

            <header className="text-center">
                <h1 className="text-3xl font-bold text-white">Loan Management</h1>
                <p className="text-gray-500 font-medium">
                    Enterprise liquidity and debt control
                </p>
            </header>



            {/* PREDICTIVE RISK WARNING BANNER */}
            {predictedHF && predictedHF < 1.1 && (
                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
                    <AlertTriangle className="text-red-500" />
                    <div>
                        <p className="text-red-500 font-bold text-sm">
                            High Liquidation Risk!
                        </p>
                        <p className="text-red-400 text-xs">
                            Action results in HF: {predictedHF.toFixed(2)}. This position will be targeted by liquidators.
                        </p>
                    </div>
                </div>
            )}



            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div className="bg-[#16181d] p-8 rounded-[40px] border border-gray-800 relative">

                    <div className="mb-8">

                        <div className="flex justify-between mb-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">
                                Amount
                            </label>

                            <span className="text-[10px] text-blue-500 font-bold">
                                POOL MAX: {borrowPower} ETH
                            </span>
                        </div>

                        <div className="relative">

                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-[#0a0b0d] border border-gray-800 p-6 rounded-2xl text-2xl font-bold text-white focus:border-blue-500 outline-none"
                            />

                            <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-blue-500">
                                ETH
                            </span>

                        </div>
                    </div>



                    <div className="flex flex-col gap-4">

                        <button
                            onClick={() => handleAction('borrow')}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2"
                        >

                            {loading
                                ? <Loader2 className="animate-spin" size={20} />
                                : <>
                                    <ArrowDownLeft size={20} />
                                    On-Chain Borrow
                                  </>
                            }

                        </button>



                        <button
                            onClick={() => handleAction('repay')}
                            className="w-full bg-transparent border border-gray-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2"
                        >
                            <RefreshCcw size={20} />
                            Standard Repay
                        </button>



                        <button
                            onClick={handleStateChannelRepay}
                            className="w-full bg-purple-600/10 border border-purple-500/30 text-purple-500 font-bold py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-purple-600 hover:text-white transition-all"
                        >
                            <Zap size={20} />
                            State Channel Repay
                        </button>

                    </div>
                </div>



                <div className="space-y-6">

                    <div className="bg-blue-600/5 p-6 rounded-3xl border border-blue-500/10">

                        <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-4">
                            <Info size={18} /> Loan Parameters
                        </h4>

                        <ul className="space-y-4 text-sm">

                            <li className="flex justify-between">
                                <span className="text-gray-500">Maximum LTV</span>
                                <span className="text-white font-bold">80.00%</span>
                            </li>

                            <li className="flex justify-between">
                                <span className="text-gray-500">Liquidation Threshold</span>
                                <span className="text-white font-bold">85.00%</span>
                            </li>

                            <li className="flex justify-between text-blue-400 font-bold">
                                <span>Projected Health Factor</span>
                                <span>{predictedHF ? predictedHF.toFixed(2) : "1.50"}</span>
                            </li>

                        </ul>
                    </div>



                    <div className="bg-purple-600/5 p-6 rounded-3xl border border-purple-500/10 flex items-start gap-4">

                        <ShieldCheck className="text-purple-500 shrink-0" size={24} />

                        <p className="text-xs text-gray-500 leading-relaxed">
                            State Channels utilize off-chain signatures for zero-gas high-frequency repayments,
                            later batched via DAG validation.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default BorrowerLoans;