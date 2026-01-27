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
    currentUserId: string; // Added prop
    onUpdateTeam: (updatedTeam: Team) => void;
    onDeleteTeam?: (teamId: string) => void;
}

type Tab = 'CODE' | 'INCOMING' | 'OUTGOING' | 'SETTINGS';

export function TeamManagementModal({ isOpen, onClose, team, currentUserId, onUpdateTeam, onDeleteTeam }: TeamManagementModalProps) {
    const isOwner = team.ownerId === currentUserId;
    const [activeTab, setActiveTab] = useState<Tab>('CODE');

    // --- SETTINGS STATE ---
    // ... (rest of state)

    // ... (rest of useEffects)

    const handleSaveChanges = async () => {
        if (!isOwner) return; // Client-side guard
        // ... (rest of logic using currentUserId instead of team.ownerId if needed, though Update uses userId)
        try {
            const res = await fetch('/api/teams/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamId: team.id,
                    userId: currentUserId, // Use actual user ID
                    name: editName,
                    tag: editTag,
                    logo: editLogo
                })
            });
            // ... (rest of logic)
        };

        // ...

        const handleGenerateCode = async () => {
            if (!isOwner) return;
            try {
                const res = await fetch('/api/teams/invite/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ teamId: team.id, userId: currentUserId }) // Use actual user ID
                });
                // ...
            };

            // ...

            const handleActionRequest = async (playerId: string, action: 'ACCEPT' | 'REJECT') => {
                if (!isOwner) return;
                try {
                    const res = await fetch('/api/teams/requests/action', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            teamId: team.id,
                            userId: playerId,
                            currentUserId: currentUserId, // Use actual user ID
                            action
                        })
                    });
                    // ...
                };

                // ... (rendering)

                {/* Sidebar Tabs */ }
                    <div className="w-48 bg-[#151922] border-r border-zinc-800 p-2 space-y-1">
                        {/* ... (Code button always visible?) Maybe hide if not owner? Or view only? User said generate code failing. */}
                        {/* Let's show Tab but hide Generate button if not owner */}
                        
                        <button onClick={() => setActiveTab('CODE')} ... > ... </button>
                        <button onClick={() => setActiveTab('INCOMING')} ... > ... </button>
                        <button onClick={() => setActiveTab('OUTGOING')} ... > ... </button>

                {
                    isOwner && (
                        <button
                            onClick={() => setActiveTab('SETTINGS')}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all mt-auto border-t border-zinc-800 pt-3
                                    ${activeTab === 'SETTINGS' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'}
                                `}
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </button>
                    )
                }
                    </div >

        {/* Content Area */ }
        < div className = "flex-1 p-6 bg-[#0f1219]" >

            {/* 1. CODE TAB */ }
    {
        activeTab === 'CODE' && (
            <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
                {/* ... View Code logic ... */}

                {isOwner ? (
                    /* Show Generate Button logic */
                    !team.joinCode || timeLeft === 0 ? (
                        // ... Generate Button ...
                        <button onClick={handleGenerateCode} ... >Generate Key</button>
        ) : (
                                        // ... View & Regenerate ...
                                    )
                                ) : (
            /* Non-Owner View */
            <div className="text-zinc-500 text-sm">
                Ask your captain to generate an invite key.
            </div>
        )
    }
                            </div >
                        )
}

{/* 2. INCOMING REQUESTS */ }
{/* ... Hide buttons if not owner ... */ }
<div className="flex gap-2">
    {isOwner && (
        <>
            <button onClick={() => handleActionRequest(req.playerId, 'REJECT')} ... ><X ... /></button>
    <button onClick={() => handleActionRequest(req.playerId, 'ACCEPT')} ... ><Check ... /></button>
                                                            </>
                                                        )}
                                                    </div >


    {/* 3. OUTGOING INVITES TAB */ }
{
    activeTab === 'OUTGOING' && (
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
    )
}

{/* 4. SETTINGS TAB */ }
{
    activeTab === 'SETTINGS' && (
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
    )
}

                    </div >
                </div >
            </DialogContent >
        </Dialog >
    );
}
