'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { TournamentsRepository } from '@/lib/repositories';
import { Tournament, TournamentMatch } from '@/lib/esport-types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Trophy, ArrowLeft, Youtube, AlertTriangle, CheckCircle2, Medal } from 'lucide-react';
import Image from 'next/image';

export default function Autumn2025Page() {
    const t = useTranslations('Esport');
    const [tournament, setTournament] = useState<Tournament | null>(null);

    useEffect(() => {
        const load = async () => {
            // Hardcoded ID for this specific page
            const data = await TournamentsRepository.getById('t_autumn_2025');
            if (data) setTournament(data);
        };
        load();
    }, []);

    if (!tournament) return <div className="min-h-screen flex items-center justify-center text-zinc-500">Loading Tournament Data...</div>;

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black min-h-[400px] flex flex-col justify-end p-8 md:p-12">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-black/50 to-transparent" />

                <div className="relative z-10 space-y-6">
                    <Link href="/esport/tournaments" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest mb-4">
                        <ArrowLeft size={16} /> Back to Tournaments
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-bold uppercase mb-4">
                                <CheckCircle2 size={12} /> Completed
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 max-w-2xl">
                                {tournament.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-zinc-300 font-mono text-sm md:text-base">
                                <div className="flex items-center gap-2">
                                    <Calendar className="text-purple-500" size={18} />
                                    {new Date(tournament.startDate).toLocaleDateString()} - {tournament.endDate ? new Date(tournament.endDate).toLocaleDateString() : 'Ongoing'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="text-yellow-500" size={18} />
                                    Prize Pool: <span className="text-white font-bold">{tournament.prizePool.toLocaleString()} UZS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Timeline & Matches */}
                <div className="lg:col-span-2 space-y-8">
                    <h2 className="text-2xl font-black text-white uppercase flex items-center gap-3">
                        <Youtube className="text-red-600" /> Match Archive
                    </h2>

                    <div className="space-y-4">
                        {tournament.matches.map((match) => (
                            <MatchCard key={match.id} match={match} />
                        ))}
                    </div>
                </div>

                {/* Right Column: Standings & Info */}
                <div className="space-y-8">
                    <div className="bg-neutral-900 rounded-2xl border border-white/5 p-6 space-y-6">
                        <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                            <Trophy className="text-yellow-500" size={20} /> Final Standings
                        </h2>

                        <div className="space-y-2">
                            {tournament.standings.map((standing) => {
                                const team = tournament.teams.find(t => t.teamId === standing.teamId);
                                return (
                                    <div key={standing.teamId} className={`flex items-center justify-between p-3 rounded-xl border ${standing.position === 1 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-black/30 border-white/5'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${standing.position === 1 ? 'bg-yellow-500 text-black' :
                                                    standing.position === 2 ? 'bg-zinc-400 text-black' :
                                                        standing.position === 3 ? 'bg-amber-700 text-white' : 'bg-zinc-800 text-zinc-500'
                                                }`}>
                                                {standing.position}
                                            </div>
                                            <div className="font-bold text-white">{team?.name || 'Unknown Team'}</div>
                                        </div>
                                        <div className="text-sm font-mono text-zinc-400">
                                            {standing.prize.toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-neutral-900 rounded-2xl border border-white/5 p-6">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase mb-4">Participating Teams</h3>
                        <div className="flex flex-wrap gap-2">
                            {tournament.teams.map(team => (
                                <div key={team.teamId} className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/5 text-xs font-bold text-zinc-300 flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-zinc-800 overflow-hidden">
                                        {team.logo && <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />}
                                    </div>
                                    {team.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MatchCard({ match }: { match: TournamentMatch }) {
    const isTechnical = match.status === 'TECHNICAL';

    return (
        <div className="relative bg-neutral-900 rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors group">
            {/* Status Strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isTechnical ? 'bg-red-500' :
                    match.status === 'PLAYED' ? 'bg-green-500' : 'bg-zinc-800'
                }`} />

            <div className="p-6 pl-8 flex flex-col md:flex-row items-center gap-6">

                {/* Meta */}
                <div className="flex flex-col items-center md:items-start min-w-[100px] text-center md:text-left">
                    <span className="text-xs font-bold text-zinc-500 uppercase">{match.stage} • M{match.matchNumber}</span>
                    <span className="text-lg font-mono text-white">{match.time}</span>
                    <span className="text-xs text-zinc-600">{new Date(match.date).toLocaleDateString()}</span>
                </div>

                {/* Teams */}
                <div className="flex-1 flex items-center gap-4 md:gap-8 w-full justify-between md:justify-center bg-black/20 md:bg-transparent p-4 md:p-0 rounded-xl">
                    <TeamDisplay team={match.teamA} score={match.scoreA} isWinner={match.winnerTeamId === match.teamA.id} />
                    <div className="text-zinc-600 font-black text-xl">VS</div>
                    <TeamDisplay team={match.teamB} score={match.scoreB} isWinner={match.winnerTeamId === match.teamB.id} isRight />
                </div>

                {/* Actions */}
                <div className="min-w-[140px] flex flex-col gap-2 items-center md:items-end w-full md:w-auto mt-4 md:mt-0">
                    {match.youtubeUrl && (
                        <a href={match.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto px-4 py-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/20 flex items-center justify-center gap-2 text-xs font-bold transition-all group-hover:bg-red-600 group-hover:text-white">
                            <Youtube size={14} /> Watch Replay
                        </a>
                    )}
                    {isTechnical && (
                        <div className="px-3 py-1 rounded bg-red-950/30 border border-red-500/20 text-red-500 text-[10px] uppercase font-bold flex items-center gap-1.5">
                            <AlertTriangle size={10} /> Technical Defeat
                        </div>
                    )}
                </div>
            </div>

            {/* Admin Note if Technical */}
            {match.adminNote && (
                <div className="px-6 py-3 bg-red-950/10 border-t border-red-500/10 flex items-start gap-2">
                    <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-400 font-medium">
                        <span className="font-bold uppercase opacity-70 mr-1">Admin Decision:</span>
                        {match.adminNote}
                    </p>
                </div>
            )}
        </div>
    );
}

function TeamDisplay({ team, score, isWinner, isRight = false }: { team: { name: string; logo?: string }; score: number | null; isWinner?: boolean; isRight?: boolean }) {
    return (
        <div className={`flex items-center gap-3 ${isRight ? 'flex-row-reverse text-right' : 'flex-row text-left'} flex-1`}>
            {/* Logo */}
            <div className={`w-10 h-10 rounded-lg bg-neutral-800 border ${isWinner ? 'border-green-500 shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)]' : 'border-white/5'}`}>
                {team.logo && <img src={team.logo} alt={team.name} className="w-full h-full object-cover rounded-lg opacity-90" />}
            </div>

            <div className="flex flex-col">
                <span className={`text-sm font-bold ${isWinner ? 'text-white' : 'text-zinc-500'} leading-tight`}>{team.name}</span>
                {isWinner && <span className="text-[10px] text-green-500 font-bold uppercase tracking-wide">Winner</span>}
            </div>

            {/* Score */}
            <div className={`text-2xl font-black ${isWinner ? 'text-white' : 'text-zinc-600'} ${isRight ? 'mr-auto' : 'ml-auto'}`}>
                {score ?? '-'}
            </div>
        </div>
    );
}
