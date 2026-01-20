'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MOCK_TEAMS, MOCK_PLAYERS } from '@/lib/esport-data';
import Image from 'next/image';
import { Shield, Users, Trophy, Award, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TeamDetailsDialogProps {
    teamId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function TeamDetailsDialog({ teamId, isOpen, onClose }: TeamDetailsDialogProps) {
    const t = useTranslations('Esport');

    if (!teamId) return null;

    const team = MOCK_TEAMS.find(t => t.id === teamId);
    if (!team) return null;

    // Mock leader (owner) - usually strictly defined in DB
    const leader = MOCK_PLAYERS.find(p => p.teamId === team.id && p.role === 'CAPTAIN') || MOCK_PLAYERS.find(p => p.teamId === team.id);
    const members = MOCK_PLAYERS.filter(p => p.teamId === team.id);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-neutral-900 border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black border-2 border-white/10">
                            {team.logo ? (
                                <Image src={team.logo} alt={team.name} fill className="object-cover" />
                            ) : (
                                <Shield className="w-full h-full p-4 text-neutral-600" />
                            )}
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold">{team.name}</DialogTitle>
                            <div className="text-sm font-mono text-neutral-400">[{team.tag}]</div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-black/50 border border-white/5 text-center">
                            <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                            <div className="text-lg font-bold">{team.stats.wins}</div>
                            <div className="text-xs text-neutral-500 uppercase">Wins</div>
                        </div>
                        <div className="p-4 rounded-lg bg-black/50 border border-white/5 text-center">
                            <Award className="w-5 h-5 text-purple-500 mx-auto mb-2" />
                            <div className="text-lg font-bold">{team.level}</div>
                            <div className="text-xs text-neutral-500 uppercase">Level</div>
                        </div>
                        <div className="p-4 rounded-lg bg-black/50 border border-white/5 text-center">
                            <Calendar className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                            <div className="text-lg font-bold">{new Date(team.createdAt).getFullYear()}</div>
                            <div className="text-xs text-neutral-500 uppercase">Est.</div>
                        </div>
                    </div>

                    {/* Team Leader */}
                    {leader && (
                        <div>
                            <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Team Captain</h4>
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
                        <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">
                            {t('team_members_count')} ({members.length})
                        </h4>
                        <div className="space-y-2">
                            {members.map(member => (
                                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs font-bold">
                                            {member.nickname.substring(0, 1)}
                                        </div>
                                        <span className="font-medium">{member.nickname}</span>
                                    </div>
                                    <div className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded">
                                        Lvl {member.level}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
