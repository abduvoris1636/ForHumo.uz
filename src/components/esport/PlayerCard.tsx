"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, User, Gamepad2, Trophy, Clock, Eye, EyeOff, Copy, Check, Edit, Trash2 } from "lucide-react";
import { Player } from "@/lib/esport-types";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
    player: Player;
    isCurrentUser?: boolean;
    isAdmin?: boolean;
    rank?: number;
    showRank?: boolean;
    onEdit?: (player: Player) => void;
    onDelete?: (playerId: string) => void;
}

export function PlayerCard({ player, isCurrentUser = false, isAdmin = false, rank, showRank = false, onEdit, onDelete }: PlayerCardProps) {
    const isActive = player.isActive;
    const canSeeId = isCurrentUser || isAdmin;
    const [showId, setShowId] = useState(false);
    const [copied, setCopied] = useState(false);

    // Status config
    const statusColor = isActive ? "text-green-500" : "text-red-500";
    const borderColor = isActive ? "border-green-500/50" : "border-red-500/50";
    const statusText = isActive ? "Active ID" : "Not Active";
    const StatusIcon = isActive ? ShieldCheck : ShieldAlert;

    // Animation variants
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
            className={cn(
                "group relative w-full aspect-[3/4] rounded-[24px] overflow-hidden cursor-pointer transition-all duration-300",
                "bg-[#0f1219] border-2", // Dark card background for eSport feel
                isActive ? "hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]" : "hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]",
                borderColor,
                isCurrentUser && "ring-4 ring-offset-2 ring-offset-[#020617] ring-primary"
            )}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            {/* Active/Inactive Animated Border Glow (Optional subtle effect) */}
            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}

            {/* Card Content */}
            <div className="relative h-full flex flex-col p-5">

                {/* Header: ID + Status */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                        {canSeeId && (
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-lg font-bold text-white tracking-widest">{showId ? player.id : '********'}</span>
                                <button onClick={e => { e.stopPropagation(); setShowId(!showId); }} className="p-1 rounded hover:bg-white/10">
                                    {showId ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                <button onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(player.id); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="p-1 rounded hover:bg-white/10">
                                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/5", statusColor)}>
                        <StatusIcon size={14} className={isActive ? "animate-pulse" : ""} />
                        <span className="text-[10px] font-bold uppercase tracking-wide">{statusText}</span>
                    </div>
                </div>

                {/* Avatar Section */}
                <div className="flex-1 flex flex-col items-center justify-center -mt-2">
                    <div className={cn(
                        "relative w-24 h-24 rounded-2xl p-1 mb-4 transition-transform duration-500 group-hover:scale-110",
                        isActive ? "bg-gradient-to-br from-green-400 to-emerald-600" : "bg-gradient-to-br from-red-500 to-rose-600"
                    )}>
                        <div className="w-full h-full rounded-xl overflow-hidden bg-[#1a1f2e]">
                            <img
                                src={player.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${player.nickname}`}
                                alt={player.nickname}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {isCurrentUser && (
                            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#0f1219]">
                                YOU
                            </div>
                        )}
                    </div>

                    <h3 className="text-xl font-black text-white text-center leading-none tracking-tight mb-1">
                        {player.nickname}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground text-center">
                        {player.firstName} {player.lastName}
                    </p>

                    {/* Team Badge if exists */}
                    {player.teamId ? (
                        <div className="mt-3 px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-300">Team Member</span>
                        </div>
                    ) : (
                        <div className="mt-3 px-3 py-1 rounded-lg border border-dashed border-white/10 text-xs text-muted-foreground">
                            No Team
                        </div>
                    )}
                    {/* Game Badges */}
                    {player.gameProfiles && player.gameProfiles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {player.gameProfiles.map((gp, idx) => (
                                <span key={idx} className="px-2 py-1 rounded bg-white/10 border border-white/10 text-xs text-muted-foreground font-bold uppercase">
                                    {(isCurrentUser || isAdmin) ? `${gp.game}: ${gp.inGameNickname}` : gp.game}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats Footer */}
                <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-white/5">
                    <div className="bg-white/5 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Level</span>
                        <div className="flex items-center gap-1 text-yellow-400">
                            <Trophy size={14} />
                            <span className="font-bold text-sm">{player.level}</span>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold mb-0.5">Games</span>
                        <div className="flex items-center gap-1 text-blue-400">
                            <Gamepad2 size={14} />
                            <span className="font-bold text-sm">{player.gamesPlayed}</span>
                        </div>
                    </div>
                </div>

                {/* Show Rank if Requested */}
                {showRank && rank && (
                    <div className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center font-black text-xl italic text-white/10 select-none">
                        #{rank}
                    </div>
                )}
                {/* Edit / Delete Buttons */}
                {(isCurrentUser || isAdmin) && (
                    <div className="absolute top-2 right-2 flex gap-2">
                        <button onClick={e => { e.stopPropagation(); onEdit?.(player); }} className="p-1 rounded bg-white/10 hover:bg-white/20">
                            <Edit size={16} className="text-primary-foreground" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); onDelete?.(player.id); }} className="p-1 rounded bg-red-500/10 hover:bg-red-500/20">
                            <Trash2 size={16} className="text-red-500" />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
