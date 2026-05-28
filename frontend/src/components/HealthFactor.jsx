import React from 'react';

const HealthFactor = ({ value }) => {
    const hf = parseFloat(value);
    const getColor = () => {
        if (hf > 2) return 'text-green-500';
        if (hf > 1.1) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-[#0a0b0d] rounded-2xl border border-gray-800">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Health Factor</span>
            <span className={`text-4xl font-mono font-bold ${getColor()}`}>
                {hf > 100 ? '∞' : hf.toFixed(2)}
            </span>
            <div className="w-full h-1.5 bg-gray-800 rounded-full mt-4 overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${hf > 1.1 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min((hf / 3) * 100, 100)}%` }}
                />
            </div>
        </div>
    );
};

export default HealthFactor;