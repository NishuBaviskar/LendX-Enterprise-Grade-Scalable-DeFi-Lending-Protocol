import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { History, Download, ArrowDownCircle, ArrowUpCircle, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const LenderActivity = () => {
    const { account } = useWeb3();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            if (!account) return;
            try {
                // Fetching real audit logs filtered for the current lender
                const response = await api.get('/audit/logs');
                const myActions = response.data.filter(log => 
                    log.actor?.toLowerCase() === account.toLowerCase()
                );
                
                // Map the Backend logs to the UI format
                const mapped = myActions.map(log => ({
                    type: log.actionType.includes('SUPPLY') ? 'Deposit' : 'Withdraw',
                    amount: log.details.split('Amount: ')[1]?.split(' ')[0] || '0.0',
                    date: log.timestamp || 'Just now',
                    tx: log.id.substring(0, 10) + '...',
                    status: 'Completed'
                }));
                
                setActivities(mapped);
            } catch (err) {
                console.error("Activity Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, [account]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <History className="text-blue-500" /> Transaction History
                </h1>
                <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <Download size={20} />
                </button>
            </header>

            <div className="bg-[#16181d] rounded-[32px] border border-gray-800 overflow-hidden">
                {loading ? (
                    <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
                ) : activities.length === 0 ? (
                    <div className="p-20 text-center text-gray-500">No recent activity recorded for this wallet.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-[#0a0b0d] text-xs font-black text-gray-500 uppercase tracking-widest">
                            <tr>
                                <th className="p-6">Activity</th>
                                <th className="p-6">Amount (ETH)</th>
                                <th className="p-6">Date</th>
                                <th className="p-6">Audit ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {activities.map((act, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-6 flex items-center gap-3 font-bold text-white">
                                        {act.type === 'Deposit' ? <ArrowDownCircle className="text-green-500" size={18}/> : <ArrowUpCircle className="text-blue-500" size={18}/>}
                                        {act.type}
                                    </td>
                                    <td className="p-6 text-white font-mono">{act.amount}</td>
                                    <td className="p-6 text-gray-500 text-sm">{act.date}</td>
                                    <td className="p-6 text-blue-500/60 font-mono text-xs group-hover:text-blue-400 transition-colors">{act.tx}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default LenderActivity;