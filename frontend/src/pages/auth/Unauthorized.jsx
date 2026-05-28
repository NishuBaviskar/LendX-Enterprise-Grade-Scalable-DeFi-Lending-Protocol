import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ChevronLeft } from 'lucide-react';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-6">
            <div className="text-center space-y-6 max-w-md">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/10 rounded-full border border-red-500/20 mb-4 animate-pulse">
                    <ShieldAlert className="text-red-500" size={48} />
                </div>
                <h1 className="text-4xl font-bold text-white">Access Restricted</h1>
                <p className="text-gray-500 leading-relaxed">
                    Your current account role does not have permission to access this administrative layer. This attempt has been logged for security audit.
                </p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-[#16181d] text-white border border-gray-800 rounded-2xl hover:bg-gray-800 transition-all"
                    >
                        <ChevronLeft size={18} /> Go Back
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
                    >
                        <Home size={18} /> Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;