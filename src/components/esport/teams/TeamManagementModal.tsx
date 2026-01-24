'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Player, Team, JoinRequest, TeamInvite, TeamMember } from '@/lib/esport-types';
import { MOCK_PLAYERS } from '@/lib/esport-data';
import { formatDistanceToNow } from 'date-fns';
import {
    Users, QrCode, Send, ArrowRight, X, Check, Timer, Copy, CheckCircle, RefreshCw, Trophy, Gamepad2, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    team: Team;
    onUpdateTeam: (updatedTeam: Team) => void;
}

type Tab = 'CODE' | 'INCOMING' | 'OUTGOING';

export function TeamManagementModal({ isOpen, onClose, team, onUpdateTeam }: TeamManagementModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('CODE');

    // --- CODE TAB LOGIC ---
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isOpen || !team.joinCode) {
            setTimeLeft(0);
            return;
        }
        const expires = new Date(team.joinCode.expiresAt).getTime();
        const updateTimer = () => {
            const now = Date.now();
            const diff = Math.max(0, Math.floor((expires - now) / 1000));
            setTimeLeft(diff);
        };
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [isOpen, team.joinCode]);

    const handleGenerateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

        onUpdateTeam({
            ...team,
            joinCode: { code, expiresAt, createdAt: new Date().toISOString() }
        });
    };

    const handleCopyCode = () => {
        if (team.joinCode) {
            navigator.clipboard.writeText(team.joinCode.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // --- INCOMING REQUESTS LOGIC ---
    // Filter expired requests (Client-side display logic)
    const validRequests = team.requests.filter(r => {
        const expires = new Date(new Date(r.requestedAt).getTime() + 24 * 60 * 60 * 1000); // 24h
        return new Date() < expires;
    });

    const handleActionRequest = (playerId: string, action: 'ACCEPT' | 'REJECT') => {
        let updatedTeam = { ...team };

        if (action === 'ACCEPT') {
            const newMember: TeamMember = {
                playerId: playerId,
                role: 'MEMBER',
                joinedAt: new Date().toISOString()
            };
            const updatedRequests = team.requests.filter(r => r.playerId !== playerId);
            updatedTeam = { ...updatedTeam, members: [...updatedTeam.members, newMember], requests: updatedRequests };
        } else {
            const updatedRequests = team.requests.filter(r => r.playerId !== playerId);
            updatedTeam = { ...updatedTeam, requests: updatedRequests };
        }
        onUpdateTeam(updatedTeam);
    };

    // --- OUTGOING INVITES LOGIC ---
    const [searchQuery, setSearchQuery] = useState('');

    // Valid Invites filter (Showing All History as requested: Pending/Rejected)
    // We assume "active" logic or "history" logic. Let's show recent history.
    const sortedInvites = [...team.invites].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

    const handleSendInvite = (playerId: string) => {
        // Prevent dupes
        if (team.invites.some(i => i.playerId === playerId && i.status === 'PENDING')) return;

        // Check 24h limit logic? For prototype, unlimited invites to different people.
        // Limit 1 invite per player per 24h (Implicit by filtering pending)

        const newInvite: TeamInvite = {
            playerId,
            invitedBy: team.ownerId,
            sentAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
            status: 'PENDING'
        };

        onUpdateTeam({
            ...team,
            invites: [...team.invites, newInvite]
        });
        setSearchQuery(''); // Clear search
    };

    // Search for invitable players (Not in a team, not me)
    const filteredPlayers = searchQuery.length > 2 ? MOCK_PLAYERS.filter(p => {
        const isMe = p.id === team.ownerId; // Or current user
        const inThisTeam = team.members.some(m => m.playerId === p.id);
        const hasPendingInvite = team.invites.some(i => i.playerId === p.id && i.status === 'PENDING');
        // Ideally check global teamId but for mock we can rely on p.teamId if consistent
        const alreadyInAnyTeam = p.teamId !== undefined;

        if (isMe || inThisTeam || hasPendingInvite || alreadyInAnyTeam) return false;

        return (
            p.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.includes(searchQuery)
        );
    }) : [];


    // --- HELPERS to enrich data ---
    const getPlayer = (id: string) => MOCK_PLAYERS.find(p => p.id === id);


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-[#0f1219] border border-zinc-800 text-white min-h-[500px] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b border-zinc-800 bg-[#151922]">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        Manage Team: <span className="text-white">{team.name}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-1">
                    {/* Sidebar Tabs */}
                    <div className="w-48 bg-[#151922] border-r border-zinc-800 p-2 space-y-1">
                        <button
                            onClick={() => setActiveTab('CODE')}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all
                                ${activeTab === 'CODE' ? 'bg-green-500/10 text-green-400' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}
                            `}
                        >
                            <QrCode className="w-4 h-4" />
                            Invite Code
                        </button>
                        <button
                            onClick={() => setActiveTab('INCOMING')}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all relative
                                ${activeTab === 'INCOMING' ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}
                            `}
                        >
                            <ArrowRight className="w-4 h-4" />
                            Requests
                            {validRequests.length > 0 && (
                                <span className="absolute right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('OUTGOING')}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all
                                ${activeTab === 'OUTGOING' ? 'bg-orange-500/10 text-orange-400' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}
                            `}
                        >
                            <Send className="w-4 h-4" />
                            Sent Invites
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 bg-[#0f1219]">

                        {/* 1. CODE TAB */}
                        {activeTab === 'CODE' && (
                            <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
                                {!team.joinCode || timeLeft === 0 ? (
                                    <div className="space-y-4 max-w-xs">
                                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                            <Timer className="w-8 h-8 text-green-500" />
                                        </div>
                                        <h3 className="font-bold text-white">Temporary Invite Key</h3>
                                        <p className="text-zinc-500 text-sm">
                                            Generate a 5-minute key. Players can enter this key to join instantly.
                                        </p>
                                        <button
                                            onClick={handleGenerateCode}
                                            className="px-6 py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full transition-all active:scale-95 shadow-[0_0_15px_-3px_rgba(34,197,94,0.4)]"
                                        >
                                            Generate Key
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full max-w-sm space-y-6 animate-in fade-in zoom-in duration-300">
                                        <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">
                                            Expires in {formatTime(timeLeft)}
                                        </div>
                                        <div className="relative group cursor-pointer" onClick={handleCopyCode}>
                                            <div className="text-6xl font-mono font-black tracking-[0.2em] text-white select-all text-center">
                                                {team.joinCode.code}
                                            </div>
                                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-green-400 font-bold flex items-center gap-1">
                                                {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                {copied ? 'Copied' : 'Click to Copy'}
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-zinc-800 w-full flex justify-center">
                                            <button onClick={handleGenerateCode} className="text-xs text-zinc-600 hover:text-white flex items-center gap-1 transition-colors">
                                                <RefreshCw className="w-3 h-3" /> Regenerate
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 2. INCOMING REQUESTS TAB */}
                        {activeTab === 'INCOMING' && (
                            <div className="h-full flex flex-col">
                                <h3 className="text-sm font-bold text-zinc-400 uppercase mb-4">Pending Requests ({validRequests.length})</h3>
                                {validRequests.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
                                        <Users className="w-12 h-12 mb-2 opacity-20" />
                                        <p className="text-sm">No pending requests</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                                        {validRequests.map((req) => {
                                            const p = getPlayer(req.playerId);
                                            if (!p) return null;
                                            // Calculate time remaining (24h expiry)
                                            const expiresVal = new Date(req.requestedAt).getTime() + 24 * 60 * 60 * 1000;
                                            const timeUntilExpiry = Math.max(0, expiresVal - Date.now());
                                            const hoursLeft = Math.ceil(timeUntilExpiry / (1000 * 60 * 60));

                                            return (
                                                <div key={req.playerId} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 flex items-center gap-4 hover:border-zinc-700 transition-colors">
                                                    <img src={p.avatar} alt={p.nickname} className="w-10 h-10 rounded-full bg-zinc-800 object-cover" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-white text-sm">{p.nickname}</h4>
                                                            <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">Lvl {p.level}</span>
                                                        </div>
                                                        <div className="text-[10px] text-zinc-500 flex items-center gap-2 mt-0.5">
                                                            <span>Expires in {hoursLeft}h</span>
                                                            {/* Show main game for context */}
                                                            {p.gameProfiles[0] && (
                                                                <span className="flex items-center gap-1 text-zinc-400">
                                                                    <Gamepad2 className="w-3 h-3" /> {p.gameProfiles[0].game}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleActionRequest(p.id, 'REJECT')}
                                                            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleActionRequest(p.id, 'ACCEPT')}
                                                            className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black transition-all"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. OUTGOING INVITES TAB */}
                        {activeTab === 'OUTGOING' && (
                            <div className="h-full flex flex-col">
                                {/* Search Bar */}
                                <div className="relative mb-6">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        placeholder="Search player nickname to invite..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-black/30 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-orange-500/50 outline-none transition-all placeholder:text-zinc-600"
                                    />

                                    {/* Search Results Dropdown */}
                                    {searchQuery.length > 2 && (
                                        <div className="absolute top-full mt-2 left-0 right-0 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                                            {filteredPlayers.length === 0 ? (
                                                <div className="p-3 text-xs text-zinc-500 text-center">No eligible players found.</div>
                                            ) : (
                                                filteredPlayers.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => handleSendInvite(p.id)}
                                                        className="w-full text-left p-3 hover:bg-zinc-800 flex items-center gap-3 transition-colors border-b border-zinc-800/50 last:border-0"
                                                    >
                                                        <img src={p.avatar} className="w-8 h-8 rounded-full" />
                                                        <div className="flex-1">
                                                            <div className="text-sm font-bold text-white">{p.nickname}</div>
                                                            <div className="text-[10px] text-zinc-500">Lvl {p.level} • {p.gameProfiles[0]?.game || 'No Game'}</div>
                                                        </div>
                                                        <div className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded">Invite</div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-sm font-bold text-zinc-400 uppercase mb-4">Sent Invites History</h3>
                                <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                                    {sortedInvites.length === 0 ? (
                                        <div className="text-center text-zinc-600 py-10 text-sm">No invites sent recently.</div>
                                    ) : (
                                        sortedInvites.map((inv, idx) => {
                                            const p = getPlayer(inv.playerId);
                                            if (!p) return null;

                                            const isExpired = new Date() > new Date(inv.expiresAt);
                                            const isRejected = inv.status === 'REJECTED';
                                            const isAccepted = inv.status === 'ACCEPTED';
                                            const isPending = inv.status === 'PENDING' && !isExpired;

                                            return (
                                                <div key={idx} className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-3 flex items-center gap-3">
                                                    <img src={p.avatar} className="w-8 h-8 rounded-full grayscale opacity-70" />
                                                    <div className="flex-1">
                                                        <div className="text-sm font-bold text-zinc-300">{p.nickname}</div>
                                                        <div className="text-[10px] text-zinc-500">
                                                            Sent {formatDistanceToNow(new Date(inv.sentAt))} ago
                                                        </div>
                                                    </div>

                                                    {/* STATUS BADGE */}
                                                    {isPending && <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">Pending</span>}
                                                    {isRejected && <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">Rejected</span>}
                                                    {isAccepted && <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">Accepted</span>}
                                                    {(!isPending && !isRejected && !isAccepted && isExpired) && <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 px-2 py-1 rounded">Expired</span>}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
