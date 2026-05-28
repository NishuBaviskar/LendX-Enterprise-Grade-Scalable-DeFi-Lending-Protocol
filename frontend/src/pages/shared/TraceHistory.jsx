import React from 'react';
import { Search, Compass, ExternalLink } from 'lucide-react';

const TraceHistory = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Compass className="text-blue-500" /> Protocol Explorer
            </h1>
            
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                <input type="text" placeholder="Trace Transaction Hash, Block, or Address..." className="w-full bg-[#16181d] border border-gray-800 p-5 pl-14 rounded-2xl text-white outline-none focus:border-blue-500" />
            </div>

            <div className="bg-[#16181d] p-10 rounded-[32px] border border-gray-800 text-center space-y-4">
                <div className="w-16 h-16 bg-[#0a0b0d] rounded-full flex items-center justify-center mx-auto">
                    <Activity className="text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white">No active trace selected</h3>
                <p className="text-gray-500 max-w-sm mx-auto">Enter a transaction hash to see the flow of funds through the protocol's liquidity pools.</p>
            </div>
        </div>
    );
};

export default TraceHistory;