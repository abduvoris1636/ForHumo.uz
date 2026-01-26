'use client';

import { useAuthStore } from '@/store/auth-store';
import { MOCK_USERS } from '@/lib/mock-users';
import { ChevronUp, ChevronDown, Check, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function UserSwitcher() {
    const { currentUser, login, initialize } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        initialize();
        // Auto-login first user for dev convenience if empty
        // Access store directly to check if empty? actually initialize handles sync.
        // Let's rely on manual switch for explicit testing, but maybe default to first?
        // For now, let's default to first mock user if no one is logged in.
        const state = useAuthStore.getState();
        if (!state.currentUser) {
            login(MOCK_USERS[0].id);
        }
    }, [initialize, login]);

    if (!currentUser) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full right-0 mb-4 w-80 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md"
                    >
                        <div className="p-3 border-b border-white/5 bg-black/50 flex justify-between items-center">
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Dev: Switch Identity</h3>
                            <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20">Mock Mode</span>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                            {MOCK_USERS.map((u) => (
                                <button
                                    key={u.id}
                                    onClick={() => {
                                        login(u.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-all group ${currentUser.id === u.id ? 'bg-blue-600/10 border border-blue-600/20' : 'hover:bg-white/5 border border-transparent'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border ${currentUser.id === u.id ? 'border-blue-500' : 'border-white/10'}`}>
                                            <Image src={u.avatar} alt={u.nickname} fill className="object-cover" />
                                        </div>
                                        <div className="text-left">
                                            <div className={`font-bold ${currentUser.id === u.id ? 'text-blue-400' : 'text-neutral-200'}`}>{u.nickname}</div>
                                            <div className="text-[10px] text-neutral-500">{u.fullName} • {u.role || 'PLAYER'}</div>
                                        </div>
                                    </div>
                                    {currentUser.id === u.id ? <Check size={16} className="text-blue-400" /> : <div className="w-4 h-4 rounded-full border border-white/10 group-hover:border-white/30" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 pl-1 pr-4 py-1 bg-neutral-900/90 backdrop-blur border border-white/10 rounded-full shadow-lg hover:border-white/20 transition-all group"
            >
                <div className="relative w-8 h-8 rounded-full bg-neutral-800 overflow-hidden ring-2 ring-black">
                    <Image src={currentUser.avatar} alt={currentUser.nickname} fill className="object-cover" />
                </div>
                <div className="flex flex-col text-left mr-2">
                    <span className="text-xs font-bold text-white max-w-[100px] truncate">{currentUser.nickname}</span>
                    <span className="text-[10px] text-neutral-500">View as...</span>
                </div>
                {isOpen ? <ChevronDown size={14} className="text-neutral-400" /> : <ChevronUp size={14} className="text-neutral-400" />}
            </button>
        </div>
    );
}
