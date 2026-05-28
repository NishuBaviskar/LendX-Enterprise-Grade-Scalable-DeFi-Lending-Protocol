import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Search, Download, FileText, Filter, AlertCircle, Clock } from 'lucide-react';

const AdminAuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/audit/logs');
                setLogs(response.data);
            } catch (err) {
                console.error("Audit fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => 
        log.actionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actor?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white">Security Audit Trails</h1>
                    <p className="text-gray-500">Off-chain persistence of on-chain critical events</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600/10 text-blue-500 border border-blue-500/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-all">
                    <Download size={16} /> Export CSV
                </button>
            </div>

            <div className="bg-[#16181d] rounded-[32px] border border-gray-800 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-800 flex gap-4 bg-[#1c1f26]">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by Action or Wallet Address..." 
                            className="w-full bg-[#0a0b0d] border border-gray-800 pl-12 pr-4 py-3 rounded-xl text-white text-sm outline-none focus:border-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#0a0b0d] text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <tr>
                                <th className="p-6">Event Type</th>
                                <th className="p-6">Actor / User</th>
                                <th className="p-6">Severity</th>
                                <th className="p-6">Timestamp</th>
                                <th className="p-6">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-sm">
                            {loading ? (
                                [1,2,3].map(i => <LoadingRow key={i} />)
                            ) : (
                                filteredLogs.map(log => (
                                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-6 font-bold text-white flex items-center gap-2">
                                            <FileText size={14} className="text-blue-500" /> 
                                            {log.actionType}
                                        </td>
                                        <td className="p-6 font-mono text-gray-400 text-xs">
                                            {log.actor?.substring(0, 6)}...{log.actor?.substring(38)}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                log.severity === 'HIGH' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                                            }`}>
                                                {log.severity || 'LOW'}
                                            </span>
                                        </td>
                                        <td className="p-6 text-gray-500 flex items-center gap-2">
                                            <Clock size={14} /> {log.timestamp}
                                        </td>
                                        <td className="p-6 text-gray-400 italic text-xs">
                                            {log.details || 'N/A'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const LoadingRow = () => (
    <tr className="animate-pulse">
        <td colSpan="5" className="p-6"><div className="h-4 bg-gray-800 rounded w-full"></div></td>
    </tr>
);

export default AdminAuditLogs;