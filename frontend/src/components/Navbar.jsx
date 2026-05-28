import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { Wallet, Bell, User, Loader2, Link2, Link2Off } from 'lucide-react';

const Navbar = () => {
    const { user, role } = useAuth();
    const { account, connectWallet, loading } = useWeb3();

    return (
        <nav className="h-20 bg-[#0a0b0d]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <span className="text-gray-500 font-medium">LendX</span>
                <span className="text-gray-800">/</span>
                <span className="text-white font-bold capitalize">{role?.replace('_', ' ')} Portal</span>
            </div>

            <div className="flex items-center gap-6">
                {/* ⚡ THE WALLET CONNECT PROVISION */}
                {!account ? (
                    <button 
                        onClick={connectWallet}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <>
                                <Link2 size={18} />
                                Connect Wallet
                            </>
                        )}
                    </button>
                ) : (
                    <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-500 font-mono text-xs font-bold">
                            {account.substring(0, 6)}...{account.substring(38)}
                        </span>
                        <Link2Off 
                            size={14} 
                            className="text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
                            onClick={() => window.location.reload()} // Simple way to reset connection
                            title="Disconnect"
                        />
                    </div>
                )}

                <div className="h-8 w-px bg-gray-800" />

                {/* Notifications & User Profile */}
                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0b0d]" />
                    </button>
                    
                    <div className="flex items-center gap-3 pl-2 border-l border-gray-800">
                        <div className="text-right hidden md:block">
                            <p className="text-xs font-bold text-white truncate max-w-[120px]">{user?.email}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{role}</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center border border-gray-700">
                            <User size={20} className="text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;