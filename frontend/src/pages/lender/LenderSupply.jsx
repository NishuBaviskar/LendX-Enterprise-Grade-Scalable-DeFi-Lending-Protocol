import { ethers } from 'ethers';
import {
    AlertTriangle,
    CheckCircle,
    Globe,
    Info,
    Layers,
    Loader2,
    ShieldCheck,
    Wallet
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L2DepositModal from '../../components/modals/L2DepositModal';
import L2WithdrawModal from '../../components/modals/L2WithdrawModal';
import { useWeb3 } from '../../context/Web3Context';

const LenderSupply = () => {

    // --- STATE & CONTEXT ---
    const { contract, account, loading: web3Loading } = useWeb3();
    const navigate = useNavigate();

    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('idle');
    const [userBalance, setUserBalance] = useState('0.0');
    const [contractError, setContractError] = useState(null);

    // --- NEW FEATURE STATE ---
    const [isL2Open, setIsL2Open] = useState(false);
    const [activeTab, setActiveTab] = useState('selection');

    // --- WITHDRAW MODAL STATE ---
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

    // --- GLOBAL POOL UTILIZATION ---
    const [utilization, setUtilization] = useState(0);


    // --- FETCH LOGIC ---
    const getOnChainData = useCallback(async () => {
        if (!contract || !account) return;
        
        try {

            setContractError(null);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const targetAddr = import.meta.env.VITE_LENDING_POOL_ADDRESS;
            
            const code = await provider.getCode(targetAddr);

            if (code === "0x" || code === "0x0") {
                setContractError(`Contract missing. Please re-migrate and update .env`);
                return;
            }

            const balance = await contract.userDeposits(account);
            setUserBalance(ethers.formatEther(balance));

        } catch (e) {

            console.error("🔍 DEBUG INFO:", e);
            setContractError("Failed to communicate with the smart contract.");

        }

    }, [contract, account]);


    useEffect(() => {
        getOnChainData();
    }, [getOnChainData, status]);


    // --- GLOBAL LIQUIDITY CHECK ---
    useEffect(() => {

        const checkGlobalLiquidity = async () => {

            if (contract) {

                try {

                    const totalReserves = await contract.getTotalReserves();
                    const totalBorrows = await contract.getTotalBorrows();

                    const reserves = Number(ethers.formatEther(totalReserves));
                    const borrows = Number(ethers.formatEther(totalBorrows));

                    const rate = reserves > 0 ? (borrows / reserves) * 100 : 0;

                    setUtilization(rate);

                } catch (err) {

                    console.error("Utilization check failed", err);

                }

            }else {
        console.warn("Contract functions not yet synced. Run sync.ps1");
    }

        };

        checkGlobalLiquidity();

    }, [contract]);


    // --- HANDLE SUPPLY ---
    const handleSupply = async (e) => {

        e.preventDefault();

        if (!amount || !contract) return;
        
        setStatus('pending');

        try {

            const tx = await contract.deposit({
                value: ethers.parseEther(amount)
            });

            await tx.wait();
            
            setStatus('success');
            setAmount('');

            setTimeout(() => {
                setStatus('idle');
                setActiveTab('selection');
            }, 3000);

        } catch (err) {

            console.error("Supply Error:", err);
            setStatus('error');

            setTimeout(() => setStatus('idle'), 4000);

        }

    };


    if (web3Loading) {

        return (
            <div className="flex justify-center p-20">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );

    }


    return (

        <div className="max-w-4xl mx-auto space-y-8 py-4 px-4">


            {/* ERROR BANNER */}
            {contractError && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center gap-4 animate-bounce">
                    <AlertTriangle className="text-red-500 shrink-0" />
                    <div className="text-sm text-red-500 font-bold">
                        {contractError}
                    </div>
                </div>
            )}


            {/* UTILIZATION WARNING */}
            {utilization > 90 && (
                <div className="bg-orange-500/10 border border-orange-500/50 p-4 rounded-2xl flex items-center gap-4 mb-6 animate-pulse">
                    <Info className="text-orange-500" />
                    <div>
                        <p className="text-orange-500 font-bold text-sm">
                            Low Pool Liquidity (Utilization: {utilization.toFixed(1)}%)
                        </p>
                        <p className="text-orange-400 text-xs">
                            The pool is highly utilized. Large withdrawals may fail until more debt is repaid.
                        </p>
                    </div>
                </div>
            )}


            {/* HEADER WITH WITHDRAW BUTTON */}
            <header className="flex justify-between items-end">

                <div className="text-left">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Supply Liquidity
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Manage your lending positions
                    </p>
                </div>

                <button
                    onClick={() => setIsWithdrawOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-2xl font-bold text-sm hover:bg-gray-700 transition-all border border-gray-700"
                >
                    <Wallet size={16} />
                    Withdraw ETH
                </button>

            </header>


            {activeTab === 'selection' ? (

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    <SupplyCard 
                        title="Testnet L1"
                        desc="Standard Ganache Pool. High Security Settlement."
                        icon={<ShieldCheck className="text-blue-500" size={32} />}
                        action="Supply L1"
                        onClick={() => setActiveTab('l1_form')}
                    />

                    <SupplyCard 
                        title="L2 zkRollup"
                        desc="Batch 10 txs off-chain. Save  Gas fees."
                        icon={<Layers className="text-purple-500" size={32} />}
                        action="Open Batcher"
                        onClick={() => setIsL2Open(true)}
                        highlight
                    />

                    <SupplyCard 
                        title="Polygon Bridge"
                        desc="Sidechain Bridge. Optimized for high yield."
                        icon={<Globe className="text-pink-500" size={32} />}
                        action="Bridge Assets"
                        onClick={() => navigate('/bridge')}
                    />

                </div>

            ) : (

                <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-300">

                    <button 
                        onClick={() => setActiveTab('selection')}
                        className="mb-4 text-blue-500 text-sm font-bold flex items-center gap-2 hover:underline"
                    >
                        ← Back to Layer Selection
                    </button>


                    <div className="bg-[#16181d] p-8 rounded-[40px] border border-gray-800 shadow-2xl relative overflow-hidden">

                        {status === 'pending' && (
                            <div className="absolute inset-0 bg-[#0a0b0d]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4">
                                <Loader2 className="text-blue-500 animate-spin" size={48} />
                                <p className="text-white font-bold">
                                    Waiting for Confirmation...
                                </p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="absolute inset-0 bg-green-500/10 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4">
                                <CheckCircle className="text-green-500" size={64} />
                                <p className="text-green-500 font-bold text-xl">
                                    Deposit Successful!
                                </p>
                            </div>
                        )}


                        <form onSubmit={handleSupply} className="space-y-6">

                            <div className="flex justify-between items-end px-2">

                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        Your Position
                                    </p>
                                    <p className="text-xl font-bold text-white">
                                        {userBalance} ETH
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        Wallet
                                    </p>
                                    <p className="text-xs font-mono text-blue-500">
                                        {account?.substring(0, 10)}...
                                    </p>
                                </div>

                            </div>


                            <div className="relative">

                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-[#0a0b0d] border border-gray-800 p-8 rounded-3xl text-3xl font-bold text-white focus:border-blue-500 outline-none transition-all"
                                    required
                                />

                                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-blue-600/10 px-4 py-2 rounded-2xl border border-blue-500/20">
                                    <span className="font-bold text-blue-500">
                                        ETH
                                    </span>
                                </div>

                            </div>


                            <button
                                type="submit"
                                disabled={!account || status !== 'idle' || !!contractError}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-blue-900/40"
                            >
                                Confirm L1 Supply
                            </button>

                        </form>

                    </div>

                </div>

            )}


            <div className="bg-blue-600/5 border border-blue-500/10 p-6 rounded-3xl flex items-start gap-4">
                <ShieldCheck className="text-blue-500 shrink-0" size={24} />
                <p className="text-xs text-gray-500 leading-relaxed">
                    Funds are protected by cross-chain over-collateralization and monitored by the 24/7 Audit Layer.
                </p>
            </div>


            <L2DepositModal
                isOpen={isL2Open}
                onClose={() => setIsL2Open(false)}
            />


            {/* WITHDRAW MODAL */}
            <L2WithdrawModal
                isOpen={isWithdrawOpen}
                onClose={() => setIsWithdrawOpen(false)}
                contract={contract}
                account={account}
                currentBalance={userBalance}
                onRefresh={getOnChainData}
            />

        </div>
    );
};


const SupplyCard = ({ title, desc, icon, action, onClick, highlight }) => (

    <div className={`p-8 rounded-[32px] border ${highlight ? 'border-purple-500/50 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-gray-800 bg-[#16181d]'} transition-all hover:scale-[1.02] flex flex-col justify-between`}>

        <div>
            <div className="mb-6">{icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">{desc}</p>
        </div>

        <button
            onClick={onClick}
            className={`w-full py-4 font-bold rounded-2xl transition-all ${
                highlight
                    ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-900/20'
                    : 'bg-gray-800 text-white hover:bg-white hover:text-black'
            }`}
        >
            {action}
        </button>

    </div>

);

export default LenderSupply;