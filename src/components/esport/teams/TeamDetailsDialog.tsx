'use client';

import { MOCK_TEAMS, MOCK_PLAYERS } from '@/lib/esport-data';
import Image from 'next/image';
import { Shield, Users, Trophy, Award, Calendar, X, Check, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamDetailsDialogProps {
    teamId: string | null;
    isOpen: boolean;
    onClose: () => void;
    currentUserId?: string;
    onJoinRequest?: (teamId: string) => void;
    userHasTeam?: boolean;
}

export function TeamDetailsDialog({ teamId, isOpen, onClose, currentUserId, onJoinRequest, userHasTeam }: TeamDetailsDialogProps) {
    const t = useTranslations('Esport');

    if (!isOpen) return null;

    const team = MOCK_TEAMS.find(t => t.id === teamId);
    if (!team && teamId) return null;

    // Mock leader (owner) - usually strictly defined in DB
    const leader = team ? (MOCK_PLAYERS.find(p => p.teamId === team.id && p.role === 'CAPTAIN') || MOCK_PLAYERS.find(p => p.teamId === team.id)) : null;
    const members = team ? MOCK_PLAYERS.filter(p => p.teamId === team.id) : [];

    // Check Status
    const isPending = team?.requests.some(r => r.playerId === currentUserId && r.status === 'PENDING');
    const isMember = team?.members.some(m => m.playerId === currentUserId);
    const isOwner = team?.ownerId === currentUserId;

    return (
        <AnimatePresence>
            {isOpen && team && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-neutral-900 z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black border-2 border-white/10">
                                    {team.logo ? (
                                        <Image src={team.logo} alt={team.name} fill className="object-cover" />
                                    ) : (
                                        <Shield className="w-full h-full p-3 text-neutral-600" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        {team.name}
                                        {!isOwner && !userHasTeam && !isMember && (
                                            isPending ? (
                                                <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20">
                                                    Request Pending
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => onJoinRequest?.(team.id)}
                                                    className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 transition-all"
                                                >
                                                    Join Request <ArrowRight className="w-3 h-3" />
                                                </button>
                                            )
                                        )}
                                        {isOwner && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">Your Team</span>}
                                    </h2>
                                    <div className="text-sm font-mono text-neutral-400">[{team.tag}]</div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
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
                                        <Calendar className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                                        <div className="text-lg font-bold text-white">{new Date(team.createdAt).getFullYear()}</div>
                                        <div className="text-xs text-neutral-500 uppercase">Est.</div>
                                    </div>
                                </div>

                                {/* Team Leader */}
                                {leader && (
                                    <div>
                                        <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Team Captain</h4>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold">
                                                {leader.nickname.substring(0, 1)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-yellow-500">{leader.nickname}</div>
                                                <div className="text-xs text-yellow-500/70">Captain</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Members List */}
                                <div>
                                    <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
                                        {t('team_members_count')} ({members.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {members.map(member => (
                                            <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs font-bold">
                                                        {member.nickname.substring(0, 1)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-white">{member.nickname}</span>
                                                        <span className="text-[10px] text-neutral-500">{member.role}</span>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded border border-white/5">
                                                    Lvl {member.level}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
