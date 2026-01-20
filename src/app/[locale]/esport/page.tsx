'use client';

import { MOCK_TOURNAMENTS, MOCK_PLAYERS, MOCK_TEAMS } from '@/lib/esport-data';
import { SectionHeader } from '@/components/esport/shared/SectionHeader';
import { EsportCard } from '@/components/esport/shared/EsportCard';
import { AnimatedButton } from '@/components/esport/shared/AnimatedButton';
import { StatusBadge } from '@/components/esport/shared/StatusBadge';
import { Users, Swords, Trophy, ArrowRight, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

export default function EsportHomePage() {
    const activeTournament = MOCK_TOURNAMENTS.find(t => t.status === 'LIVE') || MOCK_TOURNAMENTS[0];

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-400 mb-6 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Season 2025-2026 is Live
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-neutral-500">
                        HUMO ESPORT
                    </h1>

                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        The professional competitive platform for mobile esports.
                        Rank up, join teams, and compete in premier tournaments.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link href="/esport/players">
                            <AnimatedButton className="w-full md:w-auto h-12 text-lg">
                                Register for Tournament <ArrowRight className="w-5 h-5" />
                            </AnimatedButton>
                        </Link>
                        <Link href="/esport/teams">
                            <AnimatedButton variant="outline" className="w-full md:w-auto h-12 text-lg">
                                View Teams
                            </AnimatedButton>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Overview Stats */}
            <section className="container mx-auto px-4 -mt-20 relative z-20 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <EsportCard className="bg-neutral-900/80 backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{MOCK_PLAYERS.length.toLocaleString()}</div>
                                <div className="text-sm text-neutral-400">Total Players</div>
                            </div>
                        </div>
                    </EsportCard>

                    <EsportCard className="bg-neutral-900/80 backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
                                <Swords className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{MOCK_TEAMS.length.toLocaleString()}</div>
                                <div className="text-sm text-neutral-400">Registered Teams</div>
                            </div>
                        </div>
                    </EsportCard>

                    <EsportCard className="bg-neutral-900/80 backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">50M+</div>
                                <div className="text-sm text-neutral-400">Prize Pool (UZS)</div>
                            </div>
                        </div>
                    </EsportCard>
                </div>
            </section>

            {/* Active Tournament */}
            <section className="container mx-auto px-4 mb-24">
                <SectionHeader title="Active Tournament" subtitle="Happening now in the Arena" />

                <EsportCard className="group">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-1/3 aspect-video bg-neutral-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-purple-900/40" />
                            <Gamepad2 className="w-16 h-16 text-white/20" />
                            <div className="absolute bottom-4 left-4">
                                <StatusBadge status={activeTournament.status} />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-3xl font-bold text-white mb-2">{activeTournament.name}</h3>
                            <p className="text-neutral-400 mb-6">{activeTournament.season}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div>
                                    <div className="text-sm text-neutral-500 uppercase tracking-wider font-bold">Game</div>
                                    <div className="text-white font-medium">{activeTournament.game}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-neutral-500 uppercase tracking-wider font-bold">Prize Pool</div>
                                    <div className="text-white font-medium">{activeTournament.prizePool || 'TBA'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-neutral-500 uppercase tracking-wider font-bold">Teams</div>
                                    <div className="text-white font-medium">{activeTournament.registeredTeams.length}/{activeTournament.maxTeams}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-neutral-500 uppercase tracking-wider font-bold">Start Date</div>
                                    <div className="text-white font-medium">{new Date(activeTournament.startDate).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <AnimatedButton className="w-full md:w-auto">View Tournament Details</AnimatedButton>
                        </div>
                    </div>
                </EsportCard>
            </section>
        </div>
    );
}
