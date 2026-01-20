'use client';

import { MOCK_TOURNAMENTS } from '@/lib/esport-data';
import { SectionHeader } from '@/components/esport/shared/SectionHeader';
import { EsportCard } from '@/components/esport/shared/EsportCard';
import { StatusBadge } from '@/components/esport/shared/StatusBadge';
import { AnimatedButton } from '@/components/esport/shared/AnimatedButton';
import { useTranslations } from 'next-intl';
import { Trophy, Calendar, Users, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export default function TournamentsPage() {
    const t = useTranslations('Esport');

    const seasons = [
        { name: t('season_2025_2026'), tournaments: MOCK_TOURNAMENTS },
        { name: t('season_2026_2027'), tournaments: [] },
        { name: t('season_generic', { year: '2027-2028' }), tournaments: [] },
        { name: t('season_generic', { year: '2028-2029' }), tournaments: [] },
        { name: t('season_generic', { year: '2029-2030' }), tournaments: [] },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-20">
            <div className="container mx-auto">
                <SectionHeader title={t('tournaments_header')} subtitle={t('hero_desc')} />

                <div className="space-y-12">
                    {seasons.map((season, idx) => (
                        <div key={idx} className="relative">
                            <h3 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-2 inline-block pr-8">
                                {season.name}
                            </h3>

                            {season.tournaments.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {season.tournaments.map(tour => (
                                        <TournamentCard key={tour.id} tournament={tour} t={t} />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 rounded-lg bg-neutral-900/50 border border-white/5 text-center text-neutral-500 italic">
                                    {t('season_not_started')}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function TournamentCard({ tournament, t }: { tournament: any, t: any }) {
    const [error, setError] = useState<string | null>(null);

    const handleRegister = () => {
        // Mock check for team size
        // In real app, we check the user's team size
        const mockUserTeamSize = 2; // Simulating a user with a small team
        if (mockUserTeamSize < 5) {
            setError(t('min_players_alert'));
        } else {
            // Proceed to registration
            alert("Registered!");
        }
    };

    return (
        <EsportCard className="h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <StatusBadge status={tournament.status} />
                <div className="text-xs font-bold text-neutral-500 uppercase">{tournament.game}</div>
            </div>

            <h4 className="text-xl font-bold mb-2 flex-1">{tournament.name}</h4>

            <div className="space-y-3 mb-6 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{t('start_date')}: {new Date(tournament.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span>{t('prize_pool')}: {tournament.prizePool}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span>{tournament.registeredTeams.length}/{tournament.maxTeams} Teams</span>
                </div>
            </div>

            <div className="mt-auto">
                {tournament.status === 'FINISHED' ? (
                    <Link href="/esport/history/autumn-2025">
                        <AnimatedButton variant="outline" className="w-full">
                            {t('view_details')}
                        </AnimatedButton>
                    </Link>
                ) : tournament.status === 'LIVE' ? (
                    <div className="space-y-2">
                        {error && (
                            <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded flex gap-2 items-start">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}
                        <AnimatedButton onClick={handleRegister} className="w-full">
                            {t('mlbb_action')}
                        </AnimatedButton>
                    </div>
                ) : (
                    <AnimatedButton disabled variant="ghost" className="w-full opacity-50 cursor-not-allowed">
                        {t('not_started')}
                    </AnimatedButton>
                )}
            </div>
        </EsportCard>
    );
}
