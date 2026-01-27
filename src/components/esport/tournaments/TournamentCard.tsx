'use client';

import { Calendar, Users, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge } from '@/components/esport/shared/StatusBadge';
import { useAuthStore } from '@/store/auth-store';
import { useTeamStore } from '@/lib/store/team-store';

interface TournamentCardProps {
    tournament: any;
    onClick?: () => void;
}

export function TournamentCard({ tournament, onClick }: TournamentCardProps) {
    const { currentUser } = useAuthStore();
    const { teams } = useTeamStore(); // Request to get my teams

    // Check if user's team is registered
    const myTeam = currentUser ? teams.find(t => t.members.some(m => m.playerId === currentUser.id)) : null;
    const isRegistered = myTeam && tournament.teams?.some((t: any) => t.teamId === myTeam.id);
    const isOwner = myTeam && myTeam.ownerId === currentUser?.id;
    const isCaptain = myTeam && myTeam.members.find(m => m.playerId === currentUser?.id)?.role === 'CAPTAIN';
    const canRegister = (isOwner || isCaptain) && !isRegistered && tournament.status === 'UPCOMING';

    const handleRegister = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!myTeam || !currentUser) return;

        try {
            const res = await fetch(`/api/tournaments/${tournament.id}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId: myTeam.id, requesterId: currentUser.id })
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }
            alert("Registered successfully!");
            window.location.reload();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <motion.div
            layout
            onClick={onClick}
            className="group relative bg-zinc-900/50 hover:bg-zinc-800/50 border border-white/5 hover:border-green-500/30 rounded-xl overflow-hidden cursor-pointer transition-all"
        >
            <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                    <StatusBadge status={tournament.status} />
                    <div className="flex items-center gap-1 text-xs text-zinc-500 font-mono bg-black/30 px-2 py-1 rounded">
                        <Users className="w-3 h-3" />
                        {tournament.teams?.length || 0}/{tournament.maxTeams}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors line-clamp-1">{tournament.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{tournament.game}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {new Date(tournament.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-yellow-500/50" />
                        Prize Pool TBD
                    </div>
                </div>

                {isRegistered && (
                    <div className="w-full py-2 bg-green-500/10 border border-green-500/20 text-green-500 text-center text-xs font-bold rounded uppercase tracking-wider">
                        Registered
                    </div>
                )}

                {!isRegistered && canRegister && (
                    <button
                        onClick={handleRegister}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-center text-xs font-bold rounded uppercase tracking-wider transition-colors z-10 relative"
                    >
                        Register Team
                    </button>
                )}
            </div>
        </motion.div>
    );
}
