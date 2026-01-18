"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EsportSidebar } from "./sidebar";
import { IdCardSection } from "./id-card-section";
import { TeamSection } from "./team-section";
import { TournamentDetails } from "./tournament-details";
import { TournamentHistory } from "./tournament-history";
import { ActiveTeams } from "./active-teams";
import { Season, TournamentType, Player, Team } from "./types";

export function EsportContent() {
    const [activeSeason, setActiveSeason] = useState<Season>("2025-2026");
    const [activeTournament, setActiveTournament] = useState<TournamentType>("winter");

    // Local Mock State
    const [player, setPlayer] = useState<Player | null>(null);
    const [team, setTeam] = useState<Team | null>(null);

    const handleRegisterPlayer = (data: any) => {
        const newPlayer: Player = {
            id: Math.floor(1000 + Math.random() * 9000).toString(),
            name: data.name,
            surname: data.surname,
            telegram: data.telegram,
            mlbbNickname: data.mlbbNickname,
            mlbbId: data.mlbbId
        };
        setPlayer(newPlayer);
    };

    const handleCreateTeam = (data: any) => {
        if (!player) return;
        const newTeam: Team = {
            id: Math.floor(100 + Math.random() * 900).toString(),
            name: data.name,
            shortName: data.shortName,
            ownerId: player.id,
            captainId: player.id,
            members: [player.id]
        };
        setTeam(newTeam);
    };

    return (
        <div className="min-h-screen bg-background text-foreground pt-20">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-8 py-8">

                {/* 1. Sidebar (Left) */}
                <aside className="lg:sticky lg:top-28 h-fit lg:w-64">
                    <EsportSidebar
                        activeSeason={activeSeason}
                        onSeasonChange={setActiveSeason}
                        activeTournament={activeTournament}
                        onTournamentChange={setActiveTournament}
                    />
                </aside>

                {/* 2. Main Content (Center) */}
                <main className="flex-1 space-y-12 pb-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTournament + activeSeason}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="min-h-[60vh]"
                        >
                            {activeSeason === '2026-2027' ? (
                                <div className="h-full flex items-center justify-center p-12 text-center rounded-[40px] bg-muted/30 border border-dashed border-border">
                                    <div className="max-w-md">
                                        <h2 className="text-2xl font-bold mb-4">2026-2027 Mavsumi</h2>
                                        <p className="text-muted-foreground italic">
                                            Bu mavsum hali boshlanmadi. Autumn Tournament 2026 uchun kutishda davom eting!
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {activeTournament === 'winter' && <TournamentDetails id="winter" />}
                                    {activeTournament === 'autumn' && <TournamentHistory />}
                                    {(activeTournament === 'spring' || activeTournament === 'summer') && (
                                        <div className="h-[400px] flex items-center justify-center text-center bg-card border border-border rounded-[40px] p-8">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2">Tez kunda!</h3>
                                                <p className="text-muted-foreground">
                                                    {activeTournament.charAt(0).toUpperCase() + activeTournament.slice(1)} Tournament
                                                    navbatdagi bosqichlarda e'lon qilinadi.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {activeTournament === 'winter' && (
                                        <div className="mt-12">
                                            <ActiveTeams />
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* 3. Control Panel (Right) */}
                <aside className="lg:sticky lg:top-28 h-fit lg:w-80 space-y-6">
                    <IdCardSection
                        player={player}
                        onRegister={handleRegisterPlayer}
                    />
                    <TeamSection
                        player={player}
                        team={team}
                        onCreateTeam={handleCreateTeam}
                        onInvite={() => { }}
                    />
                </aside>

            </div>
        </div>
    );
}
