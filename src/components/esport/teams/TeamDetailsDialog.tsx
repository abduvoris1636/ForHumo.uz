'use client';

import { MOCK_PLAYERS } from '@/lib/esport-data';
import Image from 'next/image';
import { Shield, Users, Trophy, Award, Calendar, X, Check, ArrowRight, MoreVertical, Crown, UserMinus, UserCheck, AlertTriangle, KeyRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeamStore } from '@/lib/store/team-store';
import { useAuthStore } from '@/store/auth-store';
import { useEffect, useState } from 'react';
import { TeamRole, TeamMember } from '@/lib/esport-types';

interface TeamDetailsDialogProps {
    teamId: string | null;
    isOpen: boolean;
    onClose: () => void;
    // currentUserId removed - derived from store
    onJoinRequest?: (teamId: string) => void;
    userHasTeam?: boolean; // Still pass this for now or derive? Derive better if possible but prop is fine for generic usage.
}

export function TeamDetailsDialog({ teamId, isOpen, onClose, onJoinRequest, userHasTeam }: TeamDetailsDialogProps) {
    const t = useTranslations('Esport');
    const { getTeam, updateMemberRole, removeMember, transferOwnership, leaveTeam, disbandTeam, initialize } = useTeamStore();
    const { currentUser } = useAuthStore();
    const currentUserId = currentUser?.id;

    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [actionMemberId, setActionMemberId] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ type: 'KICK' | 'TRANSFER' | 'LEAVE' | 'DISBAND', targetId?: string, name?: string } | null>(null);

    const handleGenerateInvite = async () => {
        if (!currentUserId || !teamId) return;
        try {
            const res = await fetch('/api/teams/invite/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId, ownerId: currentUserId })
            });
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            setInviteCode(data.code);
        } catch (e) {
            alert("Error generating code");
        }
    };

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (!isOpen || !teamId) return null;

    const team = getTeam(teamId);
    if (!team) return null;

    // Resolve current user's role in this team
    const currentUserMember = team.members.find(m => m.playerId === currentUserId);
    const currentUserRole = currentUserMember?.role;

    // Enriched members with mock profile data for display
    const enrichedMembers = team.members.map((m: TeamMember) => {
        const profile = MOCK_PLAYERS.find(p => p.id === m.playerId);
        return { ...m, ...profile }; // Merge mock profile data
    });

    const isMember = !!currentUserMember;
    const isPending = team.requests.some(r => r.playerId === currentUserId && r.status === 'PENDING');
    const isDisbanded = team.status === 'DISBANDED';

    const handlePromoteCaptain = async (memberId: string) => {
        if (!currentUserId) return;
        try {
            const res = await fetch('/api/teams/role/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId, targetUserId: memberId, newRole: 'CAPTAIN', requesterId: currentUserId })
            });
            if (!res.ok) throw new Error('Failed');
            window.location.reload();
        } catch (e) {
            alert("Error promoting member");
        }
        setActionMemberId(null);
    };

    const handleDemoteCaptain = async (memberId: string) => {
        if (!currentUserId) return;
        try {
            const res = await fetch('/api/teams/role/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId, targetUserId: memberId, newRole: 'MEMBER', requesterId: currentUserId })
            });
            if (!res.ok) throw new Error('Failed');
            window.location.reload();
        } catch (e) {
            alert("Error demoting member");
        }
        setActionMemberId(null);
    };

    const handleKick = (memberId: string, name: string) => {
        setConfirmAction({ type: 'KICK', targetId: memberId, name });
        setActionMemberId(null);
    };

    const handleTransfer = (memberId: string, name: string) => {
        setConfirmAction({ type: 'TRANSFER', targetId: memberId, name });
        setActionMemberId(null);
    };

    const handleLeave = () => {
        if (currentUserRole === 'OWNER') {
            // Check if there are other members
            if (team.members.length > 1) {
                alert("You must transfer ownership before leaving.");
                return;
            }
        }
        setConfirmAction({ type: 'LEAVE' });
    };

    const handleDisband = () => {
        setConfirmAction({ type: 'DISBAND' });
    };

    // ... (Keep handleAccept/Reject from previous phase) ...

    const confirm = async () => {
        if (!confirmAction || !currentUserId) return;

        try {
            if (confirmAction.type === 'KICK' && confirmAction.targetId) {
                const res = await fetch('/api/teams/member/kick', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ teamId, targetUserId: confirmAction.targetId, requesterId: currentUserId })
                });
                if (!res.ok) throw new Error('Failed to kick');
                window.location.reload();

            } else if (confirmAction.type === 'TRANSFER' && confirmAction.targetId) {
                const res = await fetch('/api/teams/role/transfer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ teamId, targetUserId: confirmAction.targetId, requesterId: currentUserId })
                });
                if (!res.ok) throw new Error('Failed to transfer');
                window.location.reload();

            } else if (confirmAction.type === 'LEAVE') {
                // Temporary: Use Kick on self or specific Leave endpoint?
                // Since Phase 5C-3 defined Kick logic "Cannot kick self", I should probably make a simple leave component or just use store for now if not strictly forbidden. 
                // But wait, "No LocalStorage logic remains for roles".
                // I'll call a hypothetical leave endpoint or just alert.
                // Actually, Kick endpoint explicitly checks `targetUserId === requesterId` -> Error.
                // I will implement a quick `/api/teams/leave` or just use the store logic for LEAVE only, noting it needs migration. 
                // OR, strictly follow instructions "Goal: Implement ... promote/demote/kick/transfer". Leave is not in list.
                // I will leave LEAVE as store call `leaveTeam` but add comment.
                const res = leaveTeam(teamId, currentUserId);
                if (!res.success) alert(res.error);
                else onClose();

            } else if (confirmAction.type === 'DISBAND') {
                disbandTeam(teamId, "Owner decision");
                onClose();
            }
        } catch (e: any) {
            alert(e.message || "Action failed");
        }

        setConfirmAction(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={`relative w-full max-w-2xl bg-neutral-900 border ${isDisbanded ? 'border-neutral-800' : 'border-white/10'} rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-neutral-900 z-10">
                            <div className="flex items-center gap-4">
                                <div className={`relative w-16 h-16 rounded-xl overflow-hidden bg-black border-2 ${isDisbanded ? 'border-neutral-800 grayscale opacity-50' : 'border-white/10'}`}>
                                    {team.logo ? (
                                        <Image src={team.logo} alt={team.name} fill className="object-cover" />
                                    ) : (
                                        <Shield className="w-full h-full p-3 text-neutral-600" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <span className={isDisbanded ? 'text-neutral-500 line-through' : ''}>{team.name}</span>
                                        {isDisbanded && <span className="text-xs bg-neutral-800 text-neutral-500 px-2 py-1 rounded border border-neutral-700">DISBANDED</span>}

                                        {!isMember && !userHasTeam && !isDisbanded && (
                                            <button
                                                onClick={() => isPending ? null : onJoinRequest?.(team.id)}
                                                disabled={isPending}
                                                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${isPending ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                                            >
                                                {isPending ? 'Request Pending' : <>Join Request <ArrowRight className="w-3 h-3" /></>}
                                            </button>
                                        )}
                                        {isMember && !isDisbanded && <button onClick={handleLeave} className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold border border-red-500/20 transition-all">Leave Team</button>}
                                    </h2>
                                    <div className="text-sm font-mono text-neutral-400">[{team.tag}]</div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <div className="space-y-8">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 rounded-lg bg-black/50 border border-white/5 text-center">
                                        <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                                        <div className="text-lg font-bold text-white">{team.stats.wins}</div>
                                        <div className="text-xs text-neutral-500 uppercase">Wins</div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-black/50 border border-white/5 text-center">
                                        <Award className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                                        <div className="text-lg font-bold text-white">{team.level}</div>
                                        <div className="text-xs text-neutral-500 uppercase">Level</div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-black/50 border border-white/5 text-center">
                                        {/* Stats Grid */}
                                    </div>
                                    {/* Stats Grid End */}
                                </div>
                                <div className="p-4 rounded-lg bg-black/50 border border-white/5 text-center">
                                    <Calendar className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                                    <div className="text-lg font-bold text-white">{new Date(team.createdAt).getFullYear()}</div>
                                    <div className="text-xs text-neutral-500 uppercase">Est.</div>
                                </div>
                            </div>

                            {/* INVITE CODE SECTION (Owner Only) */}
                            {!isDisbanded && currentUserRole === 'OWNER' && (
                                <div className="bg-neutral-800/30 rounded-lg p-5 border border-white/5 flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                                            <KeyRound size={14} /> Invite Code
                                        </h4>
                                        <p className="text-[10px] text-neutral-500">Share this code to let players join instantly.</p>
                                    </div>
                                    {inviteCode ? (
                                        <div className="flex items-center gap-2">
                                            <div className="px-3 py-1 bg-black rounded border border-blue-500/30 font-mono text-blue-400 font-bold tracking-widest text-lg">
                                                {inviteCode}
                                            </div>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(inviteCode)}
                                                className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded text-neutral-300"
                                                title="Copy"
                                            >
                                                <Check size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleGenerateInvite}
                                            className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded text-xs font-bold transition-all"
                                        >
                                            Generate Code
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* PENDING REQUESTS (Owner Only) */}
                            {!isDisbanded && currentUserRole === 'OWNER' && team.requests.some(r => r.status === 'PENDING') && (
                                <div className="bg-neutral-800/50 rounded-lg p-4 border border-white/5">
                                    <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Users size={14} /> Pending Requests
                                    </h4>
                                    <div className="space-y-2">
                                        {team.requests.filter(r => r.status === 'PENDING').map(req => {
                                            const profile = MOCK_PLAYERS.find(p => p.id === req.playerId);
                                            // Note: In strict DB mode, we would need 'include: { user: true }' in repository.
                                            // Falling back to ID if name not found.
                                            return (
                                                <div key={req.id} className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold">
                                                            {profile?.nickname?.[0] || '?'}
                                                        </div>
                                                        <div className="font-bold text-sm text-white">
                                                            {profile?.nickname || `User ${req.playerId.substring(0, 5)}...`}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAcceptRequest(req.id)}
                                                            className="px-3 py-1 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20 rounded text-xs font-bold transition-all"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectRequest(req.id)}
                                                            className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded text-xs font-bold transition-all"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Members List */}
                            <div>
                                <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
                                    Members ({team.members.length})
                                </h4>
                                <div className="space-y-2">
                                    {enrichedMembers.map(member => (
                                        <div key={member.playerId} className={`relative flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5 ${isDisbanded ? 'opacity-50' : 'hover:border-white/10'} transition-colors group`}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 font-bold border border-white/5 overflow-hidden">
                                                    {member.avatar ? <Image src={member.avatar} alt={member.nickname || 'User'} width={40} height={40} /> : member.nickname?.substring(0, 1) || '?'}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-white">{member.nickname || 'Unknown'}</span>
                                                        {member.role === 'OWNER' && <Crown size={14} className="text-yellow-500" />}
                                                        {member.role === 'CAPTAIN' && <Shield size={14} className="text-blue-500" />}
                                                    </div>
                                                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">{member.role}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {!isDisbanded && (currentUserRole === 'OWNER' || (currentUserRole === 'CAPTAIN' && member.role === 'MEMBER')) && member.playerId !== currentUserId && (
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setActionMemberId(actionMemberId === member.playerId ? null : member.playerId)}
                                                        className="p-2 text-neutral-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>

                                                    {actionMemberId === member.playerId && (
                                                        <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                                                            {currentUserRole === 'OWNER' && (
                                                                <>
                                                                    {member.role !== 'CAPTAIN' ? (
                                                                        <button onClick={() => handlePromoteCaptain(member.playerId)} className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                                                                            <Shield size={14} className="text-blue-500" /> Promote to Captain
                                                                        </button>
                                                                    ) : (
                                                                        <button onClick={() => handleDemoteCaptain(member.playerId)} className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                                                                            <UserMinus size={14} /> Demote to Member
                                                                        </button>
                                                                    )}
                                                                    <button onClick={() => handleTransfer(member.playerId, member.nickname || 'User')} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 border-t border-white/5">
                                                                        <Crown size={14} /> Transfer Ownership
                                                                    </button>
                                                                </>
                                                            )}
                                                            <button onClick={() => handleKick(member.playerId, member.nickname || 'User')} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2">
                                                                <X size={14} /> Kick Member
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* DANGER ZONE - DISBAND */}
                            {!isDisbanded && currentUserRole === 'OWNER' && (
                                <div className="pt-6 mt-6 border-t border-white/5">
                                    <h4 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-2">Danger Zone</h4>
                                    <div className="p-4 rounded-lg bg-red-950/10 border border-red-500/20 flex items-center justify-between">
                                        <div>
                                            <div className="text-red-400 font-bold mb-1">Disband Team</div>
                                            <div className="text-xs text-red-500/60 max-w-[250px]">
                                                This action is irreversible. The team will be archived and no longer able to join tournaments.
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleDisband}
                                            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
                                        >
                                            Disband
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                </div>
                    </motion.div>

                    {/* Confirmation Modal */ }
    {
        confirmAction && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-neutral-900 border border-white/10 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl"
                >
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-bold text-white">
                            {confirmAction.type === 'TRANSFER' ? 'Transfer Ownership?' :
                                confirmAction.type === 'KICK' ? 'Kick Member?' :
                                    confirmAction.type === 'DISBAND' ? 'Disband Team?' :
                                        'Leave Team?'}
                        </h3>
                        <p className="text-sm text-neutral-400">
                            {confirmAction.type === 'TRANSFER' && `Are you sure you want to transfer ownership to ${confirmAction.name}? You will become a member.`}
                            {confirmAction.type === 'KICK' && `Are you sure you want to remove ${confirmAction.name} from the team?`}
                            {confirmAction.type === 'LEAVE' && `Are you sure you want to leave this team?`}
                            {confirmAction.type === 'DISBAND' && `Are you sure you want to disband this team? Usage history will be preserved, but all members will be kicked and invitations revoked.`}
                        </p>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={() => setConfirmAction(null)} className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-sm hover:bg-neutral-700">Cancel</button>
                        <button onClick={confirm} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-500">Confirm</button>
                    </div>
                </motion.div>
            </div>
        )
    }
                </div >
            )
}
        </AnimatePresence >
    );
}
