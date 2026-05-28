import React from 'react';
import { useWeb3 } from '../context/Web3Context';

const Profile = () => {
    const { account } = useWeb3();

    return (
        <div className="p-8 text-white">
            <div className="bg-[#16181d] p-8 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full"></div>
                    <div>
                        <h2 className="text-2xl font-bold">Account Overview</h2>
                        <p className="text-gray-500 font-mono">{account}</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0a0b0d] p-4 rounded-xl border border-gray-800">
                        <p className="text-gray-500 text-sm">Role</p>
                        <p className="text-lg font-semibold text-blue-400">Governance Delegate</p>
                    </div>
                    <div className="bg-[#0a0b0d] p-4 rounded-xl border border-gray-800">
                        <p className="text-gray-500 text-sm">Credit Score</p>
                        <p className="text-lg font-semibold text-green-400">782 / 850</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;