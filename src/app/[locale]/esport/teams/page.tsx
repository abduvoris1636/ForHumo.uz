'use client';

import { MOCK_TEAMS } from '@/lib/esport-data';
import { SectionHeader } from '@/components/esport/shared/SectionHeader';
import { EsportCard } from '@/components/esport/shared/EsportCard';
import { Users, Shield } from 'lucide-react';
import Image from 'next/image';

import { useTranslations } from 'next-intl';

export default function TeamsPage() {
    const t = useTranslations('Esport');

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-20">
            <div className="container mx-auto">
                <SectionHeader title={t('teams_list')} subtitle={t('teams_subtitle')} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_TEAMS.map(team => (
                        <EsportCard key={team.id} className="group hover:border-blue-500/30 transition-all">
                            <div className="flex items-center gap-4 mb-4">
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
                    ))}
                </div>
            </div>
        </div>
    );
}
