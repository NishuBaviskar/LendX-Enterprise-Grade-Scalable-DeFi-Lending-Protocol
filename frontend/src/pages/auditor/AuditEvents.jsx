import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Search, Filter, Database, ArrowRight, Zap, Layers, ShieldCheck } from 'lucide-react';

const AuditEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuditTrails = async () => {
            try {
                // FETCHING FROM BACKEND (WHICH HAS DAG VALIDATOR LOGS)
                const response = await api.get('/audit/logs');
                setEvents(response.data);
            } catch (err) {
                console.error("Audit Stream Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAuditTrails();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Database className="text-blue-500" /> Audit Stream
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Immutable ledger of on-chain and state-channel events.</p>
                </div>
                <div className="flex gap-3">
                    <button className="p-4 bg-[#16181d] border border-gray-800 rounded-2xl text-gray-400 hover:text-white transition-all"><Filter size={18} /></button>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search Hash..." 
                            className="bg-[#16181d] border border-gray-800 pl-12 pr-6 py-4 rounded-2xl text-white outline-none focus:border-blue-500 w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-[#16181d] rounded-[40px] border border-gray-800 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-[#0a0b0d] text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                        <tr>
                            <th className="p-6">Type</th>
                            <th className="p-6">Entity</th>
                            <th className="p-6">Security Check</th>
                            <th className="p-6">Timestamp</th>
                            <th className="p-6"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                        {events.map((e) => (
                            <tr key={e.id} className="hover:bg-white/5 transition-all cursor-pointer group">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${e.actionType === 'STATE_CHANNEL_REPAYMENT' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                            {e.actionType === 'STATE_CHANNEL_REPAYMENT' ? <Zap size={16} /> : <Layers size={16} />}
                                        </div>
                                        <span className="text-xs font-black text-white">{e.actionType}</span>
                                    </div>
                                </td>
                                <td className="p-6 font-mono text-[10px] text-gray-500">
                                    {e.actor?.substring(0, 10)}...
                                </td>
                                <td className="p-6">
                                    {e.dagNodeId ? (
                                        <span className="flex items-center gap-2 text-[10px] font-bold text-green-500 bg-green-500/5 px-3 py-1 rounded-full w-fit border border-green-500/10">
                                            <ShieldCheck size={12} /> DAG VALIDATED
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-blue-400 bg-blue-400/5 px-3 py-1 rounded-full w-fit border border-blue-400/10 uppercase">
                                            On-Chain Finality
                                        </span>
                                    )}
                                </td>
                                <td className="p-6 text-xs text-gray-500">
                                    {e.timestamp || "Just now"}
                                </td>
                                <td className="p-6">
                                    <ArrowRight size={16} className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {events.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <Database className="mx-auto text-gray-800" size={48} />
                        <p className="text-gray-500 font-bold">No audit events synchronized yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditEvents;