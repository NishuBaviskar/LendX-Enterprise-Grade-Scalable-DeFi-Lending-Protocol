import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const LogoutButton = ({ collapsed = false }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20`}
        >
            <LogOut size={20} />
            {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
    );
};

export default LogoutButton;