"use client";

import { motion } from "framer-motion";
import { User, ShieldCheck } from "lucide-react";
import { Player } from "./types";

interface PlayersListProps {
    players: Player[];
}

export function PlayersList({ players }: PlayersListProps) {
    if (players.length === 0) {
        return (
            <div className="bg-muted/30 border border-dashed border-border p-12 rounded-[40px] text-center">
                <User className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">Hali o'yinchilar ro'yxatdan o'tmadi</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {players.map((player, idx) => (
                <motion.div
                    key={player.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-card border border-border p-5 rounded-[32px] hover:shadow-xl transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-3 right-3">
                        <ShieldCheck className="text-primary opacity-20 group-hover:opacity-100 transition-opacity" size={20} />
                    </div>

                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 rounded-3xl bg-muted overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                            {player.avatar ? (
                                <img src={player.avatar} alt={player.mlbbNickname} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-muted-foreground">
                                    {player.name[0]}
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="font-bold text-lg leading-tight">{player.name} {player.surname}</h3>
                            <p className="text-primary font-black text-xs mt-1 uppercase tracking-wider">{player.mlbbNickname}</p>
                        </div>

                        <div className="w-full pt-4 border-t border-border flex justify-center gap-4">
                            <div className="text-center">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">ID</p>
                                <p className="text-xs font-mono font-bold mt-0.5">{player.id}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">Role</p>
                                <p className="text-xs font-bold mt-0.5">{player.role || "Noma'lum"}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
