'use client';

import { Player, Team } from '@/lib/esport-types';
import { motion } from 'framer-motion';
import { Edit, Gamepad2, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import Image from 'next/image';

interface PlayerCardProps {
    player: Player;
    team?: Team;
    isOwner?: boolean;
    onEdit?: () => void;
}

export function PlayerCard({ player, team, isOwner = false, onEdit }: PlayerCardProps) {
    // Active Logic: Must be active boolean AND have at least one game
    const hasGames = player.gameProfiles && player.gameProfiles.length > 0;
    const isActive = player.isActive && hasGames;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative group overflow-hidden rounded-2xl border-2 bg-zinc-900/50 backdrop-blur-sm p-6 transition-all duration-300
                ${isActive
                    ? 'border-green-500/50 shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)] hover:border-green-400'
                    : 'border-red-500/50 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)] hover:border-red-400'
                }
            `}
        >
            {/* Status Indicator */}
            <div className={`absolute top-4 right-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider
                ${isActive ? 'text-green-400' : 'text-red-400'}
            `}>
                {isActive ? (
                    <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Active ID</span>
                    </>
                ) : (
                    <>
                        <ShieldAlert className="w-4 h-4" />
                        <span>Inactive</span>
                    </>
                )}
            </div>

            {/* TEAM BADGE (Top Left) */}
            {team && (
                <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-blue-900/20 border border-blue-500/30 rounded-full pl-1 pr-3 py-1 shadow-lg backdrop-blur-md hover:bg-blue-600/30 transition-colors cursor-help group/team">
                        <div className="w-5 h-5 rounded-full overflow-hidden bg-zinc-900 border border-blue-400/50 shrink-0">
                            <img
                                src={team.logo || `https://api.dicebear.com/9.x/identicon/svg?seed=${team.name}`}
                                alt={team.tag}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-[10px] font-bold text-blue-300 tracking-wider">
                            [{team.tag}]
                        </span>

                        {/* Tooltip for full Team Name */}
                        <div className="absolute left-0 -bottom-8 opacity-0 group-hover/team:opacity-100 transition-opacity bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded border border-zinc-700 whitespace-nowrap pointer-events-none">
                            {team.name}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center text-center mt-6">
                {/* Avatar */}
                <div className="relative mb-4">
                    <div className={`w-24 h-24 rounded-full border-4 overflow-hidden 
                        ${isActive ? 'border-green-500' : 'border-red-500'}
                    `}>
                        <Image
                            src={player.avatar || `https://ui-avatars.com/api/?name=${player.nickname}&background=random`}
                            alt={player.nickname}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    {/* Level Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-zinc-800 border border-zinc-700 rounded-full px-2 py-0.5 text-xs font-bold text-white shadow-lg">
                        Lvl {player.level}
                    </div>
                </div>


                {/* Identity */}
                <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
                    {player.nickname}
                    {isOwner && (
                        <button
                            onClick={onEdit}
                            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/50 hover:text-white"
                        >
                            <Edit className="w-3.5 h-3.5" />
                        </button>
                    )}
                </h3>
                <p className="text-sm text-zinc-400 mb-4 font-medium">
                    {player.firstName} {player.lastName}
                </p>

                {/* ID Display */}
                <div className="w-full bg-black/20 rounded-lg p-3 mb-4 border border-white/5 relative group/id">
                    <div className="flex justify-between items-center text-xs text-zinc-500 mb-1">
                        <span className="font-bold text-zinc-400">Humo eSport ID</span>
                        <span className="font-mono text-zinc-300 font-bold text-sm tracking-widest">
                            {isOwner ? player.id : '••••••••'}
                        </span>
                    </div>

                    {/* Security Warning only for Owner */}
                    {isOwner && (
                        <div className="mt-2 pt-2 border-t border-white/5 text-[10px] leading-tight text-red-400 opacity-60 group-hover/id:opacity-100 transition-opacity">
                            <span className="font-bold">SECURITY WARNING:</span> Humo eSport organization will never ask for your ID. Do not share it with anyone.
                        </div>
                    )}

                    {player.telegram && (
                        <div className="mt-2 flex justify-between items-center text-xs text-zinc-500 pt-1">
                            <span>Telegram</span>
                            <a
                                href={`https://t.me/${player.telegram.replace('@', '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                            >
                                {player.telegram}
                            </a>
                        </div>
                    )}
                </div>

                {/* Team Info (Placeholder if we had teams) */}
                {/* 
                <div className="w-full flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 mb-4">
                    ...Team Info
                </div> 
                */}

                {/* Games */}
                <div className="w-full space-y-2">
                    <div className="text-xs uppercase tracking-widest text-zinc-600 font-bold mb-2">Game Profiles</div>

                    {hasGames ? (
                        player.gameProfiles.map((gp, idx) => (
                            <div key={idx} className="bg-zinc-800/40 rounded px-3 py-2 flex items-center justify-between border border-white/5">
                                <div className="flex items-center gap-2">
                                    <Gamepad2 className="w-4 h-4 text-purple-400" />
                                    <div className="text-left">
                                        <div className="text-xs font-bold text-zinc-300">{gp.game}</div>
                                        <div className="text-[10px] text-zinc-500">{gp.inGameNickname}</div>
                                    </div>
                                </div>
                                {/* Privacy Check: Only show Game ID if Owner */}
                                {isOwner && gp.gameId && (
                                    <div className="text-[10px] font-mono bg-black/30 px-1.5 py-0.5 rounded text-zinc-400">
                                        {gp.gameId}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-red-500 italic py-2">
                            No games linked yet.
                        </div>
                    )}
                </div>

                {isActive ? null : (
                    <div className="mt-4 text-[10px] text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full">
                        Complete profile to activate ID
                    </div>
                )}
            </div>
        </motion.div>
    );
}
