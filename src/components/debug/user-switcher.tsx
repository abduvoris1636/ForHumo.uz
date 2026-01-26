'use client';

import { useUserStore } from '@/lib/store/user-store';
import { Users, LogOut, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function UserSwitcher() {
    const { user, users, login, logout, initialize } = useUserStore();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        initialize(); // Ensure store is ready
    }, [initialize]);

    // Auto-login first user if none selected (for dev convenience)
    useEffect(() => {
        if (!user && users.length > 0) {
            login(users[0].id);
        }
    }, [user, users, login]);

    if (!user) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full right-0 mb-4 w-72 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-3 border-b border-white/5 bg-black/50">
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Dev Tool: Switch User</h3>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                            {users.map((u) => (
                                <button
                                    key={u.id}
                                    onClick={() => {
                                        login(u.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors ${user.id === u.id ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'hover:bg-white/5 text-neutral-300'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user.id === u.id ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                                            {u.nickname.substring(0, 1)}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold">{u.nickname}</div>
                                            <div className="text-[10px] opacity-70">{u.role} • {u.teamId ? 'Team Member' : 'No Team'}</div>
                                        </div>
                                    </div>
                                    {user.id === u.id && <Check size={16} />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 pl-1 pr-4 py-1 bg-neutral-900 border border-white/10 rounded-full shadow-lg hover:border-white/20 transition-all group"
            >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-black">
                    {user.nickname.substring(0, 1)}
                </div>
                <div className="flex flex-col text-left mr-2">
                    <span className="text-xs font-bold text-white max-w-[100px] truncate">{user.nickname}</span>
                    <span className="text-[10px] text-neutral-500">Mock User</span>
                </div>
                {isOpen ? <ChevronDown size={14} className="text-neutral-400" /> : <ChevronUp size={14} className="text-neutral-400" />}
            </button>
        </div>
    );
}
