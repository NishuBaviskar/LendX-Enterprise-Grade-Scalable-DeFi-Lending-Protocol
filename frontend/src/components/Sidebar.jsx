import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './LogoutButton';
import { 
  LayoutDashboard, ShieldAlert, Coins, 
  ArrowDownLeft, Skull, Vote, Search, 
  Globe, Zap, History 
} from 'lucide-react';

const Sidebar = () => {
    const { role } = useAuth();

    // Configuration for different role-based navigation
    const roleMenus = {
        super_admin: [
            { name: 'Admin Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20}/> },
            { name: 'System Control', path: '/admin/control', icon: <ShieldAlert size={20}/> },
            { name: 'Audit Logs', path: '/admin/logs', icon: <History size={20}/> },
        ],
        lender: [
            { name: 'Lender Dashboard', path: '/lender/dashboard', icon: <LayoutDashboard size={20}/> },
            { name: 'Supply Market', path: '/lender/supply', icon: <Coins size={20}/> },
            { name: 'My Activity', path: '/lender/activity', icon: <History size={20}/> },
        ],
        borrower: [
            { name: 'Borrower Dashboard', path: '/borrower/dashboard', icon: <LayoutDashboard size={20}/> },
            { name: 'Loan Center', path: '/borrower/loans', icon: <ArrowDownLeft size={20}/> },
            { name: 'Risk Metrics', path: '/borrower/risk', icon: <Search size={20}/> },
        ],
        liquidator: [
            { name: 'Ops Dashboard', path: '/liquidator/dashboard', icon: <LayoutDashboard size={20}/> },
            { name: 'Target Center', path: '/liquidator/center', icon: <Skull size={20}/> },
        ],
        dao_member: [
            { name: 'Governance', path: '/dao/dashboard', icon: <Vote size={20}/> },
        ],
        auditor: [
            { name: 'Auditor Panel', path: '/auditor/dashboard', icon: <Search size={20}/> },
            { name: 'Health Check', path: '/auditor/health', icon: <ShieldAlert size={20}/> },
        ]
    };

    const sharedMenu = [
        { name: 'Global Markets', path: '/markets', icon: <Globe size={20}/> },
        { name: 'Flash Loan Sim', path: '/flash-loan', icon: <Zap size={20}/> },
    ];

    const currentMenu = roleMenus[role] || [];

    return (
        <aside className="w-64 bg-[#16181d] border-r border-gray-800 h-screen sticky top-0 flex flex-col justify-between overflow-y-auto">
            <div className="p-6 space-y-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">L</div>
                    <span className="text-xl font-black text-white tracking-tighter">LENDX</span>
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 ml-2">Personal Menu</p>
                    {currentMenu.map((item) => (
                        <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            {item.icon} <span className="text-sm font-bold">{item.name}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 ml-2">Shared Tools</p>
                    {sharedMenu.map((item) => (
                        <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            {item.icon} <span className="text-sm font-bold">{item.name}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-gray-800">
                <LogoutButton />
            </div>
        </aside>
    );
};

export default Sidebar;