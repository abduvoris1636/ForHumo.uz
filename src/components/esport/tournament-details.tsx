"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Trophy, Coins, CalendarDays, Timer, CheckCircle2 } from "lucide-react";
import { Team } from "./types";

export function TournamentDetails({ id, team, onParticipate }: { id: string; team: Team | null, onParticipate: () => void }) {
    const t = useTranslations("Esport");

    const prizeAllocation = [
        { rank: t('first_place'), amount: "250,000 so'm", color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { rank: t('second_place'), amount: "150,000 so'm", color: "text-slate-400", bg: "bg-slate-400/10" },
        { rank: t('third_place'), amount: "100,000 so'm", color: "text-amber-600", bg: "bg-amber-600/10" },
    ];

    const canParticipate = team && team.members.length >= 5;

    return (
        <div className="space-y-12">
            <div className="relative h-64 rounded-[40px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-90" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="relative h-full flex flex-col items-center justify-center text-white p-8 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-4"
                    >
                        {t('winter_tournament')}
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">500,000 SO'M</h1>
                    <div className="flex items-center gap-6 text-sm font-medium opacity-80 mb-6">
                        <div className="flex items-center gap-2"><CalendarDays size={18} /> Fevral 2026</div>
                        <div className="flex items-center gap-2"><Timer size={18} /> Ro'yxatdan o'tish ochiq</div>
                    </div>

                    {canParticipate && !team.isParticipating && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onParticipate}
                            className="bg-white text-primary px-8 py-3 rounded-2xl font-black shadow-2xl hover:bg-opacity-90 transition-all flex items-center gap-2"
                        >
                            TURNIRDA QATNASHISH
                        </motion.button>
                    )}

                    {team?.isParticipating && (
                        <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 px-6 py-2 rounded-2xl flex items-center gap-2 text-green-300 font-bold">
                            <CheckCircle2 size={18} /> TURNIRDA QATNASHYAPSIZ
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {prizeAllocation.map((prize, idx) => (
                    <motion.div
                        key={prize.rank}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`${prize.bg} border-2 border-border p-8 rounded-3xl text-center space-y-4`}
                    >
                        <div className={`${prize.color} w-12 h-12 mx-auto`}>
                            <Trophy size={48} />
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">{prize.rank}</p>
                            <h3 className={`text-2xl font-black ${prize.color}`}>{prize.amount}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-card border border-border p-8 rounded-[40px] space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Coins size={20} />
                    </div>
                    <h2 className="text-2xl font-bold">{t('prize_pool')} taqsimoti</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                    Winter Tournament 2026 mavsumining eng katta turnirlaridan biri hisoblanadi. Turnirda ishtirok etish shartlari: jamoada kamida 5 ta o'yinchi bo'lishi va barcha a'zolar Humo eSport ID Card'iga ega bo'lishi shart. Ro'yxatdan o'tish vaqti tugaguncha istalgancha jamoa qabul qilinadi.
                </p>
            </div>
        </div>
    );
}
