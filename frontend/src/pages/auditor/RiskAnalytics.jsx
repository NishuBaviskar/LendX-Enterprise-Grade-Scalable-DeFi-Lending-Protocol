import React from 'react';
import { ShieldAlert, Activity, Lock, ZapOff, ShieldCheck, Database } from 'lucide-react';

const RiskAnalytics = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <ShieldAlert className="text-red-500" /> Security Intelligence Hub
                </h1>
                <p className="text-gray-500">Real-time threat detection and mitigation metrics</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SecurityStat title="Flash Loan Guards" value="Active" status="Secured" icon={<ZapOff className="text-orange-500" />} />
                <SecurityStat title="Reentrancy Lock" value="Engaged" status="Safe" icon={<Lock className="text-green-500" />} />
                <SecurityStat title="DAG Validation" value="Syncing" status="Online" icon={<Database className="text-blue-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Activity size={18} className="text-blue-500" /> System Health Distribution
                    </h3>
                    <div className="h-4 bg-gray-800 rounded-full overflow-hidden flex mb-6">
                        <div className="h-full bg-green-500 w-[75%]" title="Safe" />
                        <div className="h-full bg-orange-500 w-[20%]" title="Monitored" />
                        <div className="h-full bg-red-500 w-[5%]" title="At Risk" />
                    </div>
                    <div className="space-y-3">
                        <LegendItem color="bg-green-500" label="Collateralized Deposits" percent="75%" />
                        <LegendItem color="bg-orange-500" label="Active Loans (Normal)" percent="20%" />
                        <LegendItem color="bg-red-500" label="Under-collateralized" percent="5%" />
                    </div>
                </div>

                <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-purple-500" /> Protocol Integrity Log
                    </h3>
                    <div className="space-y-4">
                        <AuditRow event="UUPS Upgrade Check" status="Passed" time="2m ago" />
                        <AuditRow event="L2 Batch Finalized" status="Verified" time="15m ago" />
                        <AuditRow event="DAG Tangle Sync" status="Healthy" time="1h ago" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SecurityStat = ({ title, value, status, icon }) => (
    <div className="bg-[#16181d] p-6 rounded-3xl border border-gray-800">
        <div className="p-3 bg-gray-800 rounded-2xl w-fit mb-4">{icon}</div>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{title}</p>
        <div className="flex justify-between items-end mt-1">
            <h2 className="text-2xl font-bold text-white">{value}</h2>
            <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md uppercase tracking-tighter">{status}</span>
        </div>
    </div>
);

const LegendItem = ({ color, label, percent }) => (
    <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-sm text-gray-400">{label}</span>
        </div>
        <span className="text-sm font-bold text-white">{percent}</span>
    </div>
);

const AuditRow = ({ event, status, time }) => (
    <div className="flex justify-between items-center p-4 bg-[#0a0b0d] rounded-2xl border border-gray-800">
        <div>
            <p className="text-sm text-white font-medium">{event}</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold">{time}</p>
        </div>
        <span className="text-xs font-bold text-purple-500">{status}</span>
    </div>
);

export default RiskAnalytics;