"use client";

import { motion } from "framer-motion";
import { Users, Trophy, Star, Shield, Handshake } from "lucide-react";
import { Team } from "@/lib/esport-types";
import { cn } from "@/lib/utils";

interface TeamCardProps {
    team: Team;
    isMyTeam?: boolean;
    rank?: number;
    isPending?: boolean;
    hasRequests?: boolean;
    pendingCount?: number;
    userHasTeam?: boolean;
    onRequestJoin?: () => void;
    onViewRequests?: () => void;
    onClick?: () => void;
}

export function TeamCard({
    team,
    isMyTeam = false,
    rank,
    onClick,
    isPending,
    hasRequests,
    pendingCount,
    userHasTeam = false,
    onRequestJoin,
    onViewRequests
}: TeamCardProps) {
    // ... (variants unchanged)
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -5 }}
            onClick={onClick}
            className={cn(
                "group relative w-full aspect-video md:aspect-[4/3] rounded-[24px] overflow-hidden cursor-pointer transition-all duration-300",
                "bg-[#0f1219] border-2",
                isMyTeam
                    ? "border-green-500/50 hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]"
                    : "border-white/5 hover:border-white/20 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]"
            )}
        >
            {/* ... (backgrounds unchanged) */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            {isMyTeam && (
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 via-transparent to-transparent opacity-50" />
            )}

            <div className="relative h-full flex flex-col p-6">

                {/* Header: Rank/Status */}
                <div className="flex justify-between items-start mb-2">
                    {rank ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-lg font-bold italic text-white/50">
                            #{rank}
                        </div>
                    ) : <div></div>}

                    {isMyTeam ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                            <Star size={12} fill="currentColor" />
                            <span className="text-[10px] font-bold uppercase tracking-wide">My Team</span>
                        </div>
                    ) : (
                        isPending ? (
                            <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold uppercase tracking-wide">
                                Request Sent
                            </div>
                        ) : null
                    )}
                </div>

                {/* OWNER BADGE: Incoming Requests */}
                {isMyTeam && hasRequests && pendingCount ? (
                    <div
                        onClick={(e) => { e.stopPropagation(); onViewRequests?.(); }}
                        className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer shadow-lg animate-pulse"
                    >
                        <Users size={14} className="text-white" />
                        <span className="text-xs font-bold text-white">{pendingCount} Requests</span>
                    </div>
                ) : null}

                {/* Team Info */}
                <div className="flex-1 flex flex-col items-center justify-center -mt-2">
                    <div className="relative w-24 h-24 rounded-2xl p-0.5 mb-4 transition-transform duration-500 group-hover:scale-110 bg-gradient-to-br from-white/10 to-transparent">
                        <div className="w-full h-full rounded-xl overflow-hidden bg-[#1a1f2e]">
                            <img
                                src={team.logo || `https://api.dicebear.com/9.x/identicon/svg?seed=${team.name}`}
                                alt={team.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-white text-center leading-none tracking-tight mb-2">
                        {team.name}
                    </h3>
                    <div className="inline-block px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-neutral-400">
                        [{team.tag}]
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-white/5">
                    <div className="flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Level</span>
                        <div className="flex items-center gap-1 text-yellow-400">
                            <Trophy size={14} />
                            <span className="font-bold text-sm">{team.level}</span>
                        </div>
                    </div>

                    {/* CENTER ACTION: JOIN - Only if NOT my team AND user has NO team */}
                    {!isMyTeam && !userHasTeam && (
                        <div className="flex items-center justify-center">
                            {isPending ? (
                                <button disabled className="px-4 py-1.5 rounded-full bg-white/5 text-zinc-500 text-xs font-bold cursor-not-allowed">
                                    Pending
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onRequestJoin?.(); }}
                                    className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg transition-all active:scale-95"
                                >
                                    Join Team
                                </button>
                            )}
                        </div>
                    )}
                    {/* Placeholder if user HAS team (keeps layout) */}
                    {(!isMyTeam && userHasTeam) && <div />}

                    {isMyTeam && (
                        <div className="flex flex-col items-center justify-center text-center border-l border-white/5">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Members</span>
                            <div className="flex items-center gap-1 text-blue-400">
                                <Users size={14} />
                                <span className="font-bold text-sm">{team.members.length}</span>
                            </div>
                        </div>
                    )}

                    {!isMyTeam && (
                        <div className="flex flex-col items-center justify-center text-center border-l border-white/5">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Wins</span>
                            <div className="flex items-center gap-1 text-green-400">
                                <Shield size={14} />
                                <span className="font-bold text-sm">{team.stats.wins}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
