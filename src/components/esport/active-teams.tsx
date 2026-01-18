"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Info, ChevronDown, ChevronUp, Trophy } from "lucide-react";
import { useState } from "react";
import { Team, Player } from "./types";

interface ActiveTeamsProps {
    teams: Team[];
    players: Player[];
}

export function ActiveTeams({ teams, players }: ActiveTeamsProps) {
    const t = useTranslations("Esport");
    const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

    if (teams.length === 0) {
        return (
            <div className="bg-muted/30 border border-dashed border-border p-12 rounded-[40px] text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">Hali jamoalar ro'yxatdan o'tmadi</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team, idx) => {
                    const isExpanded = expandedTeamId === team.id;
                    const teamMembers = players.filter(p => team.members.includes(p.id));

                    return (
                        <motion.div
                            key={team.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`bg-card border border-border rounded-[40px] overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-primary/50 shadow-2xl' : 'hover:shadow-xl'}`}
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-3xl bg-muted overflow-hidden border border-border flex items-center justify-center font-black text-2xl text-primary">
                                        {team.logo ? (
                                            <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                                        ) : (
                                            team.shortName
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-xl leading-tight">{team.name}</h3>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">{team.members.length} ta o'yinchi</p>
                                    </div>
                                    {team.isParticipating && (
                                        <Trophy className="text-primary" size={24} />
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${team.isParticipating ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                        {team.isParticipating ? 'QATNASHYAPTI' : 'RO\'YXATDA'}
                                    </span>
                                    <button
                                        onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}
                                        className="text-xs font-black flex items-center gap-1 text-primary hover:opacity-80 transition-opacity"
                                    >
                                        {isExpanded ? 'YOPISH' : 'BATAFSIL'}
                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-muted/30 border-t border-border"
                                    >
                                        <div className="p-6 space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Jamoa tarkibi</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {teamMembers.map((member) => (
                                                    <div key={member.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-2xl">
                                                        <div className="w-10 h-10 rounded-xl bg-muted overflow-hidden border border-border flex items-center justify-center font-bold text-xs">
                                                            {member.avatar ? (
                                                                <img src={member.avatar} alt={member.mlbbNickname} className="w-full h-full object-cover" />
                                                            ) : (
                                                                member.name[0]
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-bold text-sm leading-none">{member.name} {member.surname}</p>
                                                            <p className="text-primary font-black text-[10px] uppercase mt-1 tracking-wider">{member.mlbbNickname}</p>
                                                        </div>
                                                        {team.captainId === member.id && (
                                                            <span className="text-[8px] font-black bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase">Captain</span>
                                                        )}
                                                    </div>
                                                ))}
                                                {teamMembers.length === 0 && (
                                                    <p className="text-xs text-muted-foreground italic text-center py-4">Tarkib hali shakllanmagan</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
