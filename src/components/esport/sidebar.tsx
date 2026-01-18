"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Calendar, Trophy, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Season, TournamentType } from "./types";

interface SidebarProps {
    activeSeason: Season;
    onSeasonChange: (season: Season) => void;
    activeTournament: TournamentType;
    onTournamentChange: (tournament: TournamentType) => void;
}

export function EsportSidebar({
    activeSeason,
    onSeasonChange,
    activeTournament,
    onTournamentChange
}: SidebarProps) {
    const t = useTranslations("Esport");

    const seasons: Season[] = ["2025-2026", "2026-2027"];
    const tournaments: { id: TournamentType; name: string; status: 'finished' | 'active' | 'upcoming' }[] = [
        { id: 'autumn', name: t('autumn_tournament'), status: 'finished' },
        { id: 'winter', name: t('winter_tournament'), status: 'active' },
        { id: 'spring', name: t('spring_tournament'), status: 'upcoming' },
        { id: 'summer', name: t('summer_tournament'), status: 'upcoming' },
    ];

    return (
        <div className="w-full lg:w-64 space-y-8">
            {/* Seasons */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-2 text-muted-foreground">
                    <Calendar size={18} />
                    <h3 className="font-semibold uppercase tracking-wider text-xs">{t('seasons')}</h3>
                </div>
                <div className="space-y-1">
                    {seasons.map((season) => (
                        <button
                            key={season}
                            onClick={() => onSeasonChange(season)}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                                activeSeason === season
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "hover:bg-muted"
                            )}
                        >
                            <span className="font-medium">
                                {season === '2025-2026' ? t('season_2025_2026') : t('season_2026_2027')}
                            </span>
                            {season === '2026-2027' && activeSeason !== season && <Lock size={14} className="opacity-50" />}
                        </button>
                    ))}
                </div>
                {activeSeason === '2026-2027' && (
                    <p className="px-4 text-[10px] text-yellow-500 font-medium italic">
                        * {t('season_not_started')}
                    </p>
                )}
            </div>

            {/* Tournaments */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-2 text-muted-foreground">
                    <Trophy size={18} />
                    <h3 className="font-semibold uppercase tracking-wider text-xs">{t('tournaments')}</h3>
                </div>
                <div className="space-y-1">
                    {tournaments.map((tournament) => (
                        <button
                            key={tournament.id}
                            disabled={activeSeason === '2026-2027'}
                            onClick={() => onTournamentChange(tournament.id)}
                            className={cn(
                                "w-full flex flex-col items-start px-4 py-3 rounded-xl transition-all group disabled:opacity-50",
                                activeTournament === tournament.id
                                    ? "bg-primary/10 border-primary/20 border text-primary"
                                    : "hover:bg-muted border border-transparent"
                            )}
                        >
                            <span className="font-medium">{tournament.name}</span>
                            <span className={cn(
                                "text-[10px] uppercase font-bold mt-1",
                                tournament.status === 'active' ? "text-green-500" :
                                    tournament.status === 'finished' ? "text-muted-foreground" : "text-yellow-500"
                            )}>
                                {t(tournament.status === 'active' ? 'registration_open' :
                                    tournament.status === 'finished' ? 'finished' : 'not_started')}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
