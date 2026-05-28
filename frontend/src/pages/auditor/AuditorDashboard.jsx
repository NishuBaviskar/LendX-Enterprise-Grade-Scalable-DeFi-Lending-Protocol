import React from 'react';
import { ShieldCheck, Activity, Search, AlertCircle, FileSearch } from 'lucide-react';

const AuditorDashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Audit Terminal</h1>
                    <p className="text-gray-500">Real-time protocol integrity monitoring</p>
                </div>
                <div className="flex gap-3">
                    <span className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-xs font-bold uppercase flex items-center gap-2">
                        <ShieldCheck size={14} /> System Verified
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AuditStat title="Total Tx Scanned" value="12,402" icon={<Activity className="text-blue-500" />} />
                <AuditStat title="Oracle Latency" value="120ms" icon={<Activity className="text-purple-500" />} />
                <AuditStat title="Security Alerts" value="0" icon={<AlertCircle className="text-green-500" />} />
                <AuditStat title="Reports Generated" value="14" icon={<FileSearch className="text-orange-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-6">Real-time Risk Vectors</h3>
                    <div className="space-y-4">
                        <RiskBar label="Flash Loan Exposure" percent={15} color="bg-blue-500" />
                        <RiskBar label="Liquidation Pressure" percent={8} color="bg-orange-500" />
                        <RiskBar label="Oracle Variance" percent={2} color="bg-green-500" />
                    </div>
                </div>

                <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-6">Compliance Checklist</h3>
                    <div className="space-y-3">
                        {['UUPS Proxy Verified', 'AccessControl Gaps', 'Reentrancy Checks', 'Insolvency Buffer'].map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-[#0a0b0d] rounded-xl">
                                <span className="text-sm text-gray-400">{item}</span>
                                <ShieldCheck className="text-green-500" size={16} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AuditStat = ({ title, value, icon }) => (
    <div className="bg-[#16181d] p-6 rounded-3xl border border-gray-800">
        <div className="p-3 bg-[#0a0b0d] rounded-2xl w-fit mb-4">{icon}</div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-2xl font-bold text-white mt-1">{value}</h2>
    </div>
);

const RiskBar = ({ label, percent, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-gray-500">
            <span>{label}</span>
            <span>{percent}%</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full">
            <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }} />
        </div>
    </div>
);

export default AuditorDashboard;