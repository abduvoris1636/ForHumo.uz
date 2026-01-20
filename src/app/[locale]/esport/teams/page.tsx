'use client';

import { MOCK_TEAMS } from '@/lib/esport-data';
import { SectionHeader } from '@/components/esport/shared/SectionHeader';
import { EsportCard } from '@/components/esport/shared/EsportCard';
import { Users, Shield, PlusCircle, Star } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TeamDetailsDialog } from '@/components/esport/teams/TeamDetailsDialog';
import { AnimatedButton } from '@/components/esport/shared/AnimatedButton';

export default function TeamsPage() {
    const t = useTranslations('Esport');
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

    // MOCK USER STATE
    const mockUser = {
        hasTeam: true,
        teamId: 'team_alpha'
    };

    // Sort teams: My Team first
    const sortedTeams = [...MOCK_TEAMS].sort((a, b) => {
        if (a.id === mockUser.teamId) return -1;
        if (b.id === mockUser.teamId) return 1;
        return 0; // Keep original order otherwise
    });

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-20">
            <div className="container mx-auto">
                <SectionHeader title={t('teams_list')} subtitle={t('teams_subtitle')} />

                {!mockUser.hasTeam && (
                    <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">{t('create_team')}</h3>
                            <p className="text-neutral-400">Join the league by creating your own team.</p>
                        </div>
                        <AnimatedButton>
                            <PlusCircle className="w-5 h-5 mr-2" /> {t('create_team')}
                        </AnimatedButton>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedTeams.map(team => {
                        const isMyTeam = team.id === mockUser.teamId;
                        return (
                            <div key={team.id} onClick={() => setSelectedTeamId(team.id)} className="cursor-pointer">
                                <EsportCard className={`group hover:border-blue-500/30 transition-all h-full ${isMyTeam ? 'ring-2 ring-blue-500/50 bg-blue-950/10' : ''}`}>
                                    {isMyTeam && (
                                        <div className="absolute top-4 right-4 text-xs font-bold bg-blue-500 text-white px-2 py-1 rounded-full flex items-center gap-1 z-10">
                                            <Star className="w-3 h-3 fill-white" /> YOUR TEAM
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 mb-4 relative">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-800 border-2 border-white/5">
                                            {team.logo ? (
                                                <Image
                                                    src={team.logo}
                                                    alt={team.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <Shield className="w-full h-full p-3 text-neutral-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{team.name}</h3>
                                            <div className="text-sm text-neutral-500 font-mono">[{team.tag}]</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 py-4 border-t border-white/5">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-white">{team.level}</div>
                                            <div className="text-xs text-neutral-500 uppercase">Level</div>
                                        </div>
                                        <div className="text-center border-l border-white/5">
                                            <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                                                <Users className="w-4 h-4" /> {team.members.length}
                                            </div>
                                            <div className="text-xs text-neutral-500 uppercase">Members</div>
                                        </div>
                                        <div className="text-center border-l border-white/5">
                                            <div className="text-lg font-bold text-green-500">{team.stats.wins}</div>
                                            <div className="text-xs text-neutral-500 uppercase">Wins</div>
                                        </div>
                                    </div>
                                </EsportCard>
                            </div>
                        );
                    })}
                </div>
            </div>

            <TeamDetailsDialog
                teamId={selectedTeamId}
                isOpen={!!selectedTeamId}
                onClose={() => setSelectedTeamId(null)}
            />
        </div>
    );
}
