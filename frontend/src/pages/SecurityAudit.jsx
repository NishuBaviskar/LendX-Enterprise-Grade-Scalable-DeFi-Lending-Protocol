import React from 'react';
import { ShieldCheck, ShieldAlert, Zap } from 'lucide-react';

const SecurityAudit = () => {
    const attackScenarios = [
        {
            role: "Liquidator",
            attack: "Front-running Liquidation",
            mitigation: "On-chain Flashbots protection & Slip-page tolerance",
            status: "Protected"
        },
        {
            role: "Borrower",
            attack: "Reentrancy on Repay",
            mitigation: "OpenZeppelin ReentrancyGuard (nonReentrant modifier)",
            status: "Fixed"
        },
        {
            role: "SuperAdmin",
            attack: "Private Key Compromise",
            mitigation: "Multi-Sig Wallet (Gnosis Safe) implementation plan",
            status: "Mitigated"
        }
    ];

    return (
        <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="text-green-500" /> Enterprise Security Audit
            </h2>
            <div className="grid gap-4">
                {attackScenarios.map((s, i) => (
                    <div key={i} className="bg-[#16181d] p-6 rounded-2xl border border-gray-800 flex justify-between">
                        <div>
                            <h4 className="text-blue-400 font-mono text-xs uppercase">{s.role} Boundary</h4>
                            <p className="text-lg font-bold mt-1">{s.attack}</p>
                            <p className="text-gray-500 text-sm mt-1">Mitigation: {s.mitigation}</p>
                        </div>
                        <span className="bg-green-500/10 text-green-500 px-4 py-1 rounded-full h-fit text-xs font-bold border border-green-500/20">
                            {s.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SecurityAudit;