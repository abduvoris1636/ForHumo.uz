'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Player, Team, JoinRequest, TeamInvite, TeamMember } from '@/lib/esport-types';
import { MOCK_PLAYERS } from '@/lib/esport-data';
import { formatDistanceToNow } from 'date-fns';
import {
    Users, QrCode, Send, ArrowRight, X, Check, Timer, Copy, CheckCircle, RefreshCw, Trophy, Gamepad2, Search, Settings, Trash2, Upload, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { compressImage } from '@/lib/image-utils';

interface TeamManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    team: Team;
    onUpdateTeam: (updatedTeam: Team) => void;
    onDeleteTeam?: (teamId: string) => void;
}

type Tab = 'CODE' | 'INCOMING' | 'OUTGOING' | 'SETTINGS';

export function TeamManagementModal({ isOpen, onClose, team, onUpdateTeam, onDeleteTeam }: TeamManagementModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('CODE');

    // --- SETTINGS STATE ---
    const [editName, setEditName] = useState(team.name);
    const [editTag, setEditTag] = useState(team.tag);
    const [editLogo, setEditLogo] = useState(team.logo || '');
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    // Sync state when opening
    useEffect(() => {
        if (isOpen) {
            setEditName(team.name);
            setEditTag(team.tag);
            setEditLogo(team.logo || '');
            setIsDeleteConfirmOpen(false);
        }
    }, [isOpen, team]);

    const handleSaveChanges = async () => {
        try {
            const res = await fetch('/api/teams/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamId: team.id,
                    userId: team.ownerId,
                    name: editName,
                    tag: editTag,
                    logo: editLogo
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update team');
            }

            const updatedTeamData = await res.json();

            // Trigger refresh
            onUpdateTeam({ ...team, ...updatedTeamData });
            alert('Team settings updated successfully!');

        } catch (err: any) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleDeleteTeam = () => {
        if (onDeleteTeam) {
            onDeleteTeam(team.id);
            onClose();
        }
    };

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

    const handleGenerateCode = async () => {
        try {
            const res = await fetch('/api/teams/invite/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId: team.id, userId: team.ownerId })
            });

            if (!res.ok) throw new Error('Failed to generate code');

            const invite = await res.json();

            // Update local state and parent
            onUpdateTeam({
                ...team,
                joinCode: {
                    code: invite.code,
                    expiresAt: invite.expiresAt,
                    createdAt: invite.createdAt
                }
            });

        } catch (error) {
            console.error(error);
            alert("Failed to generate invite key");
        }
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
    const validRequests = team.requests.filter(r => {
        const expires = new Date(new Date(r.requestedAt).getTime() + 24 * 60 * 60 * 1000); // 24h
        return new Date() < expires;
    });

    const handleActionRequest = async (playerId: string, action: 'ACCEPT' | 'REJECT') => {
        try {
            const res = await fetch('/api/teams/requests/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamId: team.id,
                    userId: playerId, // The player requesting
                    currentUserId: team.ownerId, // The one approving
                    action
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to process request');
            }

            // Success - Refetch
            onUpdateTeam({ ...team }); // Triggers re-fetch in parent
            alert(`Request ${action === 'ACCEPT' ? 'Accepted' : 'Rejected'}`);

        } catch (error: any) {
            console.error(error);
            alert("Error accepting request: " + error.message);
        }
    };

    // Helper to get display info
    const getRequestUser = (req: JoinRequest) => {
        if (req.playerDetails) return req.playerDetails;
        return getPlayer(req.playerId) || { nickname: 'Unknown', avatar: '', level: 0 };
    };

    // --- OUTGOING INVITES LOGIC ---
    const [searchQuery, setSearchQuery] = useState('');
    const sortedInvites = [...team.invites].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

    const handleSendInvite = (playerId: string) => {
        if (team.invites.some(i => i.playerId === playerId && i.status === 'PENDING')) return;

        const newInvite: TeamInvite = {
            playerId,
            invitedBy: team.ownerId,
            sentAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            status: 'PENDING'
        };

        onUpdateTeam({
            ...team,
            invites: [...team.invites, newInvite]
        });
        setSearchQuery('');
    };

    const filteredPlayers = searchQuery.length > 2 ? MOCK_PLAYERS.filter(p => {
        const isMe = p.id === team.ownerId;
        const inThisTeam = team.members.some(m => m.playerId === p.id);
        const hasPendingInvite = team.invites.some(i => i.playerId === p.id && i.status === 'PENDING');
        const alreadyInAnyTeam = p.teamId !== undefined;

        if (isMe || inThisTeam || hasPendingInvite || alreadyInAnyTeam) return false;

        return (
            p.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.includes(searchQuery)
        );
    }) : [];

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
                        <button
                            onClick={() => setActiveTab('SETTINGS')}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all mt-auto border-t border-zinc-800 pt-3
                                ${activeTab === 'SETTINGS' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'}
                            `}
                        >
                            <Settings className="w-4 h-4" />
                            Settings
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
                                            const p = getRequestUser(req);
                                            // Calculate time remaining (24h expiry)
                                            const expiresVal = new Date(req.requestedAt).getTime() + 24 * 60 * 60 * 1000;
                                            const timeUntilExpiry = Math.max(0, expiresVal - Date.now());
                                            const hoursLeft = Math.ceil(timeUntilExpiry / (1000 * 60 * 60));

                                            return (
                                                <div key={req.playerId} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 flex items-center gap-4 hover:border-zinc-700 transition-colors">
                                                    <img src={p.avatar || '/placeholder-avatar.png'} alt={p.nickname} className="w-10 h-10 rounded-full bg-zinc-800 object-cover" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-white text-sm">{p.nickname}</h4>
                                                            <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">Lvl {p.level}</span>
                                                        </div>
                                                        <div className="text-[10px] text-zinc-500 flex items-center gap-2 mt-0.5">
                                                            <span>Expires in {hoursLeft}h</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleActionRequest(req.playerId, 'REJECT')}
                                                            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleActionRequest(req.playerId, 'ACCEPT')}
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

                        {/* 4. SETTINGS TAB */}
                        {activeTab === 'SETTINGS' && (
                            <div className="h-full flex flex-col overflow-y-auto pr-2">
                                <h3 className="text-sm font-bold text-zinc-400 uppercase mb-4">Edit Team Identity</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">Team Name</label>
                                        <input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full bg-black/30 border border-zinc-800 rounded p-2.5 text-sm focus:border-blue-500 outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">Tag (2-4 Chars)</label>
                                        <input
                                            value={editTag}
                                            onChange={(e) => setEditTag(e.target.value.toUpperCase().slice(0, 4))}
                                            className="w-full bg-black/30 border border-zinc-800 rounded p-2.5 text-sm font-mono focus:border-blue-500 outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">Team Logo</label>
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 rounded border border-zinc-700 bg-zinc-900 overflow-hidden shrink-0">
                                                <img src={editLogo} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <input
                                                    value={editLogo.length > 100 ? "(Image Data Loaded)" : editLogo}
                                                    onChange={(e) => {
                                                        // Only allow editing if it's not a long data string, or if clearing
                                                        if (e.target.value.length < 100 || e.target.value === '') {
                                                            setEditLogo(e.target.value);
                                                        }
                                                    }}
                                                    className="w-full bg-black/30 border border-zinc-800 rounded p-2 text-xs focus:border-blue-500 outline-none text-zinc-500"
                                                    placeholder="Logo URL or Upload..."
                                                    readOnly={editLogo.length > 100}
                                                />
                                                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs font-bold cursor-pointer transition-colors border border-zinc-700">
                                                    <Upload className="w-3 h-3" /> Upload from Device
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            if (e.target.files?.[0]) {
                                                                try {
                                                                    const b64 = await compressImage(e.target.files[0]);
                                                                    setEditLogo(b64);
                                                                } catch (err) {
                                                                    console.error(err);
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSaveChanges}
                                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg transition-all"
                                    >
                                        Save Changes
                                    </button>
                                </div>

                                {/* DANGER ZONE */}
                                <div className="mt-auto pt-6 border-t border-red-500/20">
                                    <h3 className="text-sm font-bold text-red-500 uppercase mb-2 flex items-center gap-2">
                                        <Trash2 className="w-4 h-4" /> Danger Zone
                                    </h3>

                                    {!isDeleteConfirmOpen ? (
                                        <button
                                            onClick={() => setIsDeleteConfirmOpen(true)}
                                            className="w-full py-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold rounded-lg transition-colors text-sm"
                                        >
                                            Delete Team
                                        </button>
                                    ) : (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center animate-in fade-in zoom-in">
                                            <p className="text-xs text-red-400 mb-3 font-bold">
                                                Are you sure? This action cannot be undone.
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setIsDeleteConfirmOpen(false)}
                                                    className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleDeleteTeam}
                                                    className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded shadow-lg"
                                                >
                                                    Confirm
                                                </button>
                                            </div>
                                        </div>
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
