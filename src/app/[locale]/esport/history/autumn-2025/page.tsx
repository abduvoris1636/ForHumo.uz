'use client';

import { AUTUMN_2025_DATA } from '@/lib/archives/autumn-2025';
import { SectionHeader } from '@/components/esport/shared/SectionHeader';
import { EsportCard } from '@/components/esport/shared/EsportCard';
import { StatusBadge } from '@/components/esport/shared/StatusBadge';
import { Trophy, Calendar, Users, Youtube, AlertTriangle, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Autumn2025Page() {
    const { meta, teams, matches, standings } = AUTUMN_2025_DATA;
    const t = useTranslations('Esport');
    const tStatus = useTranslations('Status');

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-20 font-sans">
            <div className="container mx-auto max-w-5xl">

                {/* Navigation Breadcrumb */}
                <div className="mb-6 text-sm text-neutral-500">
                    <Link href="/esport" className="hover:text-white transition-colors">Esport</Link>
                    <span className="mx-2">/</span>
                    <span className="text-white">{t('history')}</span>
                    <span className="mx-2">/</span>
                    <span className="text-blue-400">Autumn 2025</span>
                </div>

                {/* Hero Section */}
                <div className="relative rounded-2xl overflow-hidden mb-12 border border-white/10 bg-neutral-900">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-purple-900/20" />
                    <div className="relative p-8 md:p-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider mb-4">
                                    <CheckCircle2 className="w-3 h-3" /> {t('finished')}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black mb-2 text-white">{meta.name}</h1>
                                <p className="text-xl text-neutral-400">{meta.season}</p>
                            </div>
                            <div className="text-right hidden md:block">
                                <div className="text-3xl font-bold text-yellow-500">{meta.prizePool}</div>
                                <div className="text-sm text-neutral-500 uppercase tracking-wider">{t('prize_pool')}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/5">
                            <div>
                                <div className="text-xs text-neutral-500 uppercase font-bold mb-1">{t('game_label')}</div>
                                <div className="font-medium">{meta.game}</div>
                            </div>
                            <div>
                                <div className="text-xs text-neutral-500 uppercase font-bold mb-1">{t('organizer_label')}</div>
                                <div className="font-medium">{meta.organizer}</div>
                            </div>
                            <div>
                                <div className="text-xs text-neutral-500 uppercase font-bold mb-1">{t('dates_label')}</div>
                                <div className="font-medium">{new Date(meta.startDate).toLocaleDateString()} — {new Date(meta.endDate).toLocaleDateString()}</div>
                            </div>
                            <div className="md:hidden">
                                <div className="text-xs text-neutral-500 uppercase font-bold mb-1">{t('prize_pool')}</div>
                                <div className="font-medium text-yellow-500">{meta.prizePool}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Participating Teams */}
                <section className="mb-16">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" /> {t('participating_teams')}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {teams.map((team, idx) => (
                            <div key={idx} className={cn(
                                "p-4 rounded-lg border bg-neutral-900/50 flex flex-col items-center text-center gap-2 transition-colors",
                                team.status === 'Withdrawn' ? "border-red-900/30 opacity-70" : "border-white/5 hover:border-white/20"
                            )}>
                                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400">
                                    {team.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="font-bold text-sm">{team.name}</div>
                                {team.status === 'Withdrawn' && (
                                    <span className="text-[10px] uppercase font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded">{t('withdrawn')}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Match History */}
                <section className="mb-16">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-500" /> {t('match_history')}
                    </h2>

                    <div className="space-y-4">
                        {matches.map((match) => (
                            <EsportCard key={match.id} className={cn(
                                "p-0 overflow-visible",
                                match.status === 'INCIDENT' ? "border-red-500/30 bg-red-950/10" : ""
                            )}>
                                <div className="flex flex-col md:flex-row items-stretch">
                                    {/* Date/Time Column */}
                                    <div className="p-4 md:w-32 bg-white/5 flex flex-col justify-center items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-white/5">
                                        <div className="text-sm font-bold text-white">{match.date}</div>
                                        {match.time && <div className="text-xs text-neutral-400">{match.time}</div>}
                                        <div className="mt-2 text-[10px] uppercase tracking-wider font-bold text-neutral-600 bg-black/30 px-2 py-0.5 rounded">
                                            {/* Localization logic for stages */}
                                            {match.stage === 'Group' ? t('stage_group') :
                                                match.stage === 'Semifinals' ? t('stage_semifinals') :
                                                    match.stage === 'Third Place' ? t('stage_third_place') :
                                                        match.stage === 'Grand Final' ? t('stage_grand_final') : match.stage}
                                        </div>
                                    </div>

                                    {/* Match Details */}
                                    <div className="flex-1 p-4 md:p-6 flex flex-col justify-center">
                                        <div className="flex items-center justify-between gap-4 md:gap-8 mb-4 md:mb-0">
                                            <div className={cn("flex-1 text-right font-bold text-lg", match.winner === match.teamA ? "text-green-400" : "text-white")}>
                                                {match.teamA}
                                            </div>

                                            <div className="shrink-0 flex flex-col items-center">
                                                <div className="text-xl font-black bg-white/10 px-3 py-1 rounded tracking-widest min-w-[3rem] text-center">
                                                    {match.score || "VS"}
                                                </div>
                                                {match.seriesScore && <div className="text-[10px] text-neutral-500 mt-1">{match.seriesScore}</div>}
                                            </div>

                                            <div className={cn("flex-1 text-left font-bold text-lg", match.winner === match.teamB ? "text-green-400" : "text-white")}>
                                                {match.teamB}
                                            </div>
                                        </div>

                                        {/* Incident Report */}
                                        {match.status === 'INCIDENT' && (
                                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                <div className="flex items-center gap-2 text-red-500 font-bold mb-1 text-sm">
                                                    <AlertTriangle className="w-4 h-4" /> {t('incident_report')}
                                                </div>
                                                <p className="text-xs text-red-200/80 mb-2">{t('reason_incident')}</p>
                                                <div className="text-xs font-bold text-red-400 uppercase">{t('verdict')}: {match.verdict}</div>
                                                <div className="mt-2 text-[10px] text-neutral-500 border-t border-red-500/10 pt-2">
                                                    {t('organizer_responsibility')}
                                                </div>
                                            </div>
                                        )}

                                        {/* Technical Report */}
                                        {match.status === 'TECHNICAL' && (
                                            <div className="mt-4 p-3 bg-neutral-800 rounded-lg">
                                                <div className="flex items-center gap-2 text-neutral-400 font-bold mb-1 text-sm">
                                                    <ShieldAlert className="w-4 h-4" /> {t('technical_result')}
                                                </div>
                                                <p className="text-xs text-neutral-500">{t('reason_assasin_withdraw')}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    {match.youtube && (
                                        <div className="p-4 flex items-center justify-center border-t md:border-t-0 md:border-l border-white/5 bg-white/[0.02]">
                                            <a
                                                href={match.youtube}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded transition-colors group"
                                            >
                                                <Youtube className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                {t('watch_btn')}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </EsportCard>
                        ))}
                    </div>
                </section>

                {/* Final Standings */}
                <section className="mb-16">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" /> {t('winner')}
                    </h2>

                    <div className="rounded-xl border border-white/10 bg-neutral-900/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 uppercase text-neutral-500 font-bold text-xs">
                                    <tr>
                                        <th className="p-4 w-24">{t('table_place')}</th>
                                        <th className="p-4">{t('table_team')}</th>
                                        <th className="p-4">{t('table_prize')}</th>
                                        <th className="p-4 text-right">{t('table_proof')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {standings.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-bold">
                                                <span className="mr-2">{row.medal}</span> {row.place}
                                            </td>
                                            <td className="p-4 font-medium text-white">
                                                {row.team}
                                                {row.note && <span className="ml-2 text-xs text-red-400 uppercase bg-red-500/10 px-1.5 py-0.5 rounded">{t('withdrawn')}</span>}
                                            </td>
                                            <td className="p-4 text-neutral-300 font-mono">
                                                {row.prize}
                                            </td>
                                            <td className="p-4 text-right">
                                                {row.proof ? (
                                                    <a
                                                        href={row.proof}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors text-xs font-medium"
                                                    >
                                                        Payment Proof <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-neutral-600 text-xs">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Official Statement */}
                <section className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-neutral-900 to-black border border-white/10 text-center">
                    <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-6" />
                    <p className="text-neutral-400 italic leading-relaxed max-w-2xl mx-auto mb-6">
                        {t('official_statement_quote')}
                    </p>
                    <div className="text-xs font-bold uppercase tracking-widest text-neutral-600">
                        {t('official_archive_footer')}
                    </div>
                </section>

            </div>
        </div>
    );
}
