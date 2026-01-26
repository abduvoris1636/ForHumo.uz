'use client';

import { MOCK_TOURNAMENTS, MOCK_PLAYERS, MOCK_TEAMS } from '@/lib/esport-data';
import { SectionHeader } from '@/components/esport/shared/SectionHeader';
import { EsportCard } from '@/components/esport/shared/EsportCard';
import { AnimatedButton } from '@/components/esport/shared/AnimatedButton';
import { StatusBadge } from '@/components/esport/shared/StatusBadge';
import { Users, Swords, Trophy, ArrowRight, Gamepad2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';

export default function EsportHomePage() {
    const t = useTranslations('Esport');
    const locale = useLocale();

    // Get Winter Tournament (Active)
    const activeTournament = MOCK_TOURNAMENTS.find(t => t.id === 'tour_winter_2025') || MOCK_TOURNAMENTS[0];

    return (
        <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white pb-20 transition-colors duration-500">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    {/* Dark Mode Blobs */}
                    <div className="hidden dark:block absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse" />
                    <div className="hidden dark:block absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />

                    {/* Light Mode Blobs (Lighter, livelier) */}
                    <div className="dark:hidden absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/30 rounded-full blur-[100px] animate-pulse" />
                    <div className="dark:hidden absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-[100px] animate-pulse delay-1000" />

                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-600 dark:text-blue-400 mb-6 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        {t('hero_status')}
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-500 dark:from-white dark:via-white dark:to-neutral-500">
                        {t('hero_tag')}
                    </h1>

                    <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        {t('hero_desc')}
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link href="/esport/tournaments">
                            <AnimatedButton className="w-full md:w-auto h-12 text-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
                                {t('register_btn')} <ArrowRight className="w-5 h-5" />
                            </AnimatedButton>
                        </Link>
                        <Link href="/esport/teams">
                            <AnimatedButton variant="outline" className="w-full md:w-auto h-12 text-lg border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-white/20 dark:text-white dark:hover:bg-white/5">
                                {t('view_teams_btn')}
                            </AnimatedButton>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Overview Stats */}
            <section className="container mx-auto px-4 -mt-20 relative z-20 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/esport/players" className="block h-full">
                        <EsportCard className="h-full flex items-center bg-white/50 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg dark:shadow-none hover:bg-white/80 dark:hover:bg-neutral-800/80 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-500">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">{MOCK_PLAYERS.length.toLocaleString()}</div>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">{t('total_players')}</div>
                                </div>
                            </div>
                        </EsportCard>
                    </Link>

                    <Link href="/esport/teams" className="block h-full">
                        <EsportCard className="h-full flex items-center bg-white/50 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg dark:shadow-none hover:bg-white/80 dark:hover:bg-neutral-800/80 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-500">
                                    <Swords className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">{MOCK_TEAMS.length.toLocaleString()}</div>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">{t('registered_teams')}</div>
                                </div>
                            </div>
                        </EsportCard>
                    </Link>

                    <Link href="/esport/tournaments" className="block h-full">
                        <EsportCard className="h-full flex items-center bg-white/50 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg dark:shadow-none hover:bg-white/80 dark:hover:bg-neutral-800/80 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">4</div>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">{t('tournaments_header')}</div>
                                </div>
                            </div>
                        </EsportCard>
                    </Link>
                </div>
            </section>

            {/* Active Tournament */}
            <section className="container mx-auto px-4 mb-24">
                <SectionHeader
                    title={t('active_tournament_title')}
                    subtitle={t('season_2025_2026')}
                    className="text-neutral-900 dark:text-white"
                />

                <EsportCard className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-xl dark:shadow-none">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-1/3 aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40" />
                            <Gamepad2 className="w-16 h-16 text-neutral-300 dark:text-white/20" />
                            <div className="absolute bottom-4 left-4">
                                <StatusBadge status={activeTournament.status} />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">{activeTournament.name}</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 mb-6">{activeTournament.season}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div>
                                    <div className="text-sm text-neutral-500 uppercase tracking-wider font-bold">{t('game_label')}</div>
                                    <div className="text-neutral-900 dark:text-white font-medium">{activeTournament.game}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-neutral-500 uppercase tracking-wider font-bold">{t('prize_pool')}</div>
                                    <div className="text-yellow-600 dark:text-yellow-500 font-medium">{activeTournament.prizePool || t('tba')}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-neutral-500 uppercase tracking-wider font-bold">{t('teams_label')}</div>
                                    <div className="text-neutral-900 dark:text-white font-medium">{activeTournament.teams.length}/{activeTournament.maxTeams}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-neutral-500 uppercase tracking-wider font-bold">{t('start_date')}</div>
                                    <div className="text-neutral-900 dark:text-white font-medium">{new Date(activeTournament.startDate).toLocaleDateString(locale)}</div>
                                </div>
                            </div>

                            <Link href="/esport/tournaments">
                                <AnimatedButton className="w-full md:w-auto bg-blue-600 text-white hover:bg-blue-700 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
                                    {t('view_details')}
                                </AnimatedButton>
                            </Link>
                        </div>
                    </div>
                </EsportCard>
            </section>
        </div>
    );
}
