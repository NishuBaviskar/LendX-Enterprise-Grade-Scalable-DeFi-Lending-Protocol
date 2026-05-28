import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, Plus, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

const GovernanceDashboard = () => {
    const navigate = useNavigate();
    const [proposals] = useState([
        { id: 1, title: "LIP-01: Increase ETH Collateral Factor to 85%", status: "Active", votes: 420000, deadline: "2 days left" },
        { id: 2, title: "LIP-02: Update Oracle to Chainlink V4", status: "Passed", votes: 890000, deadline: "Executed" },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Governance</h1>
                    <p className="text-gray-500 font-medium">LendX Improvement Proposals (LIPs)</p>
                </div>
                <button 
                    onClick={() => navigate('/dao/create')}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-900/20"
                >
                    <Plus size={20} /> New Proposal
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DaoStat title="Voting Power" value="25,000 LX" icon={<Vote className="text-purple-500" />} />
                <DaoStat title="Active Proposals" value="3" icon={<Clock className="text-blue-500" />} />
                <DaoStat title="Passed LIPs" value="12" icon={<CheckCircle2 className="text-green-500" />} />
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white ml-2">Recent Proposals</h3>
                {proposals.map((prop) => (
                    <div 
                        key={prop.id}
                        onClick={() => navigate(`/dao/proposal/${prop.id}`)}
                        className="bg-[#16181d] p-6 rounded-3xl border border-gray-800 hover:border-purple-500/40 transition-all cursor-pointer flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-6">
                            <div className={`w-2 h-12 rounded-full ${prop.status === 'Active' ? 'bg-blue-500' : 'bg-green-500'}`} />
                            <div>
                                <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{prop.title}</h4>
                                <div className="flex gap-4 mt-1 text-xs text-gray-500 font-medium uppercase tracking-widest">
                                    <span>{prop.votes.toLocaleString()} Votes Cast</span>
                                    <span>•</span>
                                    <span>{prop.deadline}</span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const DaoStat = ({ title, value, icon }) => (
    <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
        <div className="w-12 h-12 bg-[#0a0b0d] rounded-2xl flex items-center justify-center mb-6">{icon}</div>
        <p className="text-gray-500 text-sm font-semibold uppercase">{title}</p>
        <h2 className="text-3xl font-bold text-white mt-1">{value}</h2>
    </div>
);

export default GovernanceDashboard;