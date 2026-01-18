"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Trophy, History, Users, Sword } from "lucide-react";

export function TournamentHistory() {
    const t = useTranslations("Esport");

    const participants = [
        { name: "Star Boys", rank: 1, prize: "100,000 so'm", logo: "SB" },
        { name: "Team Vamos", rank: 2, prize: "55,000 so'm", logo: "TV" },
        { name: "Kurayami", rank: 3, prize: "30,000 so'm", logo: "KR" },
        { name: "Assasin's", rank: 4, prize: "15,000 so'm", logo: "AS" },
        { name: "Phantom", rank: 5, prize: "0 so'm", logo: "PH" },
    ];

    const playoffMatches = [
        { id: '1', team1: "Kurayami", score1: 1, team2: "Team Vamos", score2: 2, winner: "Team Vamos", stage: "Semi-final" },
        { id: '2', team1: "Star Boys", score1: 2, team2: "Assasin's", score2: 0, winner: "Star Boys", stage: "Semi-final" },
        { id: '3', team1: "Kurayami", score1: 2, team2: "Assasin's", score2: 1, winner: "Kurayami", stage: "3rd Place" },
        { id: '4', team1: "Star Boys", score1: 3, team2: "Team Vamos", score2: 2, winner: "Star Boys", stage: "Final" },
    ];

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <History className="text-primary" /> Autumn Tournament
                    </h2>
                    <p className="text-muted-foreground mt-2">10/11/2025 • 5 ta jamoa ishtirokida</p>
                </div>
                <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <Trophy className="text-primary" size={20} />
                    <span className="font-bold text-primary">G'olib: Star Boys</span>
                </div>
            </div>

            {/* Final Standings */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {participants.map((team, idx) => (
                    <motion.div
                        key={team.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-card border border-border p-4 rounded-3xl text-center space-y-3 relative overflow-hidden"
                    >
                        {team.rank <= 3 && (
                            <div className="absolute top-2 right-2">
                                <Trophy size={16} className={team.rank === 1 ? "text-yellow-500" : team.rank === 2 ? "text-slate-400" : "text-amber-600"} />
                            </div>
                        )}
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-muted flex items-center justify-center font-black text-muted-foreground">
                            {team.logo}
                        </div>
                        <div>
                            <p className="font-bold truncate">{team.name}</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase">{team.rank}-O'RIN</p>
                        </div>
                        <p className="font-black text-primary text-xs">{team.prize}</p>
                    </motion.div>
                ))}
            </div>

            {/* Playoff Brackets */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Sword className="text-primary" size={20} /> {t('playoffs')}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {playoffMatches.map((match) => (
                        <div key={match.id} className="bg-card border border-border rounded-3xl overflow-hidden">
                            <div className="bg-muted/50 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                                {match.stage}
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-xs">
                                            {match.team1.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className={match.winner === match.team1 ? "font-bold text-primary" : "text-muted-foreground"}>
                                            {match.team1}
                                        </span>
                                    </div>
                                    <span className="font-black text-xl">{match.score1}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-xs">
                                            {match.team2.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className={match.winner === match.team2 ? "font-bold text-primary" : "text-muted-foreground"}>
                                            {match.team2}
                                        </span>
                                    </div>
                                    <span className="font-black text-xl">{match.score2}</span>
                                </div>
                            </div>
                            <div className="px-4 py-2 bg-primary/5 border-t border-primary/10 text-center">
                                <p className="text-[10px] uppercase font-bold text-primary tracking-widest">{t('winner')}: {match.winner}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
