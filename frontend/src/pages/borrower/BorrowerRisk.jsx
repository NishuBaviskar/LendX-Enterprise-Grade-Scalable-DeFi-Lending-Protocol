import React from 'react';
import { ShieldAlert, BarChart, Info } from 'lucide-react';

const BorrowerRisk = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Risk Analysis</h1>
            <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
                <div className="flex items-start gap-6">
                    <div className="bg-orange-500/20 p-4 rounded-2xl"><ShieldAlert className="text-orange-500" size={32} /></div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Liquidation Mechanics</h3>
                        <p className="text-gray-500 mt-2 leading-relaxed">
                            Your position becomes eligible for liquidation when your **Health Factor drops below 1.0**. 
                            In this event, authorized liquidators will repay your debt in exchange for your collateral at a **10% discount**.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#16181d] p-8 rounded-[32px] border border-gray-800">
                    <h4 className="text-gray-500 font-bold text-xs uppercase mb-6">Price Sensitivity</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-sm text-gray-400">Current ETH Price</span>
                            <span className="text-white font-mono">$2,450.00</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-sm text-red-400">Liquidation Price</span>
                            <span className="text-red-400 font-mono font-bold">$1,980.24</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full mt-2">
                            <div className="w-3/4 h-full bg-blue-500 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BorrowerRisk;