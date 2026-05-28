import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { ShieldAlert, Users, Settings } from 'lucide-react';

const SuperAdmin = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch all users from Firestore via Backend
        const fetchUsers = async () => {
            const res = await api.get('/auth/all-users'); // You would add this route in backend
            setUsers(res.data);
        };
        fetchUsers();
    }, []);

    const changeRole = async (uid, newRole) => {
        try {
            await api.post('/auth/manage-user-role', { uid, newRole });
            alert("Role updated successfully!");
        } catch (err) {
            alert("Error updating role");
        }
    };

    return (
        <div className="p-8 text-white">
            <header className="flex items-center gap-4 mb-10">
                <div className="bg-red-500/20 p-3 rounded-2xl border border-red-500/40">
                    <ShieldAlert className="text-red-500" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">SuperAdmin Command Center</h1>
                    <p className="text-gray-500">Global Protocol & User Management</p>
                </div>
            </header>

            <div className="grid gap-6">
                <div className="bg-[#16181d] border border-gray-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#0a0b0d] text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="p-4">User UID</th>
                                <th className="p-4">Current Role</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {users.map((u) => (
                                <tr key={u.uid} className="hover:bg-white/5">
                                    <td className="p-4 font-mono text-xs">{u.uid}</td>
                                    <td className="p-4">
                                        <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md text-xs">
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <button 
                                            onClick={() => changeRole(u.uid, 'liquidator')}
                                            className="text-xs bg-gray-800 px-3 py-1 rounded hover:bg-blue-600 transition"
                                        >
                                            Promote to Liquidator
                                        </button>
                                        <button 
                                            onClick={() => changeRole(u.uid, 'blacklisted')}
                                            className="text-xs bg-red-900/20 text-red-500 border border-red-900/50 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition"
                                        >
                                            Blacklist
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SuperAdmin;