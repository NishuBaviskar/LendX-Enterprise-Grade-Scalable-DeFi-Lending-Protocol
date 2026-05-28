import React from 'react';
import { Vote, FileSignature, Trophy, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DaoProfile = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl space-y-8">
            <div className="bg-purple-600/10 p-10 rounded-[40px] border border-purple-600/20 flex items-center gap-8">
                <div className="w-24 h-24 bg-[#0a0b0d] rounded-full border-4 border-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
                    <FileSignature size={48} className="text-purple-500" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">{user?.email}</h2>
                    <p className="text-purple-500 font-bold uppercase text-xs tracking-widest mt-1">Core Governance Delegate</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#16181d] p-8 rounded-3xl border border-gray-800">
                    <p className="text-gray-500 text-xs font-bold uppercase mb-2">Voting Activity</p>
                    <div className="flex items-end gap-2 text-4xl font-black text-white">
                        24 <span className="text-sm font-medium text-gray-500 mb-2">Votes Cast</span>
                    </div>
                </div>
                <div className="bg-[#16181d] p-8 rounded-3xl border border-gray-800">
                    <p className="text-gray-500 text-xs font-bold uppercase mb-2">Participation Rate</p>
                    <div className="flex items-end gap-2 text-4xl font-black text-green-500">
                        98% <span className="text-sm font-medium text-gray-500 mb-2">High Efficiency</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DaoProfile;