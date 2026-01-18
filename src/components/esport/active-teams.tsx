"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Users, Info } from "lucide-react";

export function ActiveTeams() {
    const t = useTranslations("Esport");

    // Mock teams for display
    const teams = [
        { id: '1', name: "Star Boys", short: "SB", members: 7, status: 'approved' },
        { id: '2', name: "Team Vamos", short: "VM", members: 5, status: 'approved' },
        { id: '3', name: "Kurayami", short: "KR", members: 5, status: 'pending' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Users className="text-primary" /> {t('teams_list')}
                </h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                    <Info size={14} /> Jamoada min 5 ta o'yinchi bo'lishi shart
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team, idx) => (
                    <motion.div
                        key={team.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-card border border-border p-6 rounded-3xl hover:shadow-2xl hover:shadow-primary/5 transition-all group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl group-hover:bg-primary group-hover:text-white transition-all">
                                {team.short}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{team.name}</h3>
                                <p className="text-xs text-muted-foreground">{team.members} ta o'yinchi</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${team.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                {team.status === 'approved' ? 'TASDIQLANGAN' : 'KUTILMOQDA'}
                            </span>
                            <button className="text-xs font-bold text-primary hover:underline">Batafsil</button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
