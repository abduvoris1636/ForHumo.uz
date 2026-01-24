'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/lib/esport-types';
import { MOCK_PLAYERS, MOCK_TEAMS } from '@/lib/esport-data';
import { PlayerCard } from './PlayerCard';
import { EditProfileModal } from './EditProfileModal';
import { TeamDetailsDialog } from '../teams/TeamDetailsDialog';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const CURRENT_USER_ID = 'U7#m9$Kp';
const STORAGE_KEY = 'humo_esport_user_v2'; // Bumped version to force ID update
const REQUEST_HISTORY_KEY = 'humo_esport_request_history_v1';

export function PlayersGrid() {
    const [currentUser, setCurrentUser] = useState<Player | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null); // For Team Dialog
    const [isMounted, setIsMounted] = useState(false);

    // Initial Load
    useEffect(() => {
        setIsMounted(true);
        // Try to load from LocalStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setCurrentUser(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse user data', e);
                // Fallback to mock
                const defaultUser = MOCK_PLAYERS.find(p => p.id === CURRENT_USER_ID);
                if (defaultUser) setCurrentUser(defaultUser);
            }
        } else {
            // Fallback to mock
            const defaultUser = MOCK_PLAYERS.find(p => p.id === CURRENT_USER_ID);
            if (defaultUser) setCurrentUser(defaultUser);
        }
    }, []);

    const handleSaveProfile = (updatedPlayer: Player) => {
        setCurrentUser(updatedPlayer);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlayer));
        setIsEditModalOpen(false);
    };

    // Filter and Sort other players
    const otherPlayers = MOCK_PLAYERS.filter(p => p.id !== CURRENT_USER_ID);

    // Sort Logic: Active first, then Level desc
    const sortedPlayers = [...otherPlayers].sort((a, b) => {
        // 1. Active Status
        const aActive = a.isActive && (a.gameProfiles.length > 0);
        const bActive = b.isActive && (b.gameProfiles.length > 0);

        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;

        // 2. Level Descending
        return b.level - a.level;
    });

    const filteredPlayers = sortedPlayers.filter(p =>
        p.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isMounted || !currentUser) {
        return <div className="min-h-[50vh] flex items-center justify-center text-zinc-500">Loading IDs...</div>;
    }

    // Helper: Find Team
    const getTeam = (teamId?: string) => {
        if (!teamId) return undefined;
        return MOCK_TEAMS.find(t => t.id === teamId);
    };

    // Handle Join Request (Mock Logic - Visual Only for Players Page as we don't sync with TeamsGrid state fully here yet)
    // NOTE: In a real app, this should mutate the same global state/store as TeamsGrid.
    const handleJoinRequest = (teamId: string) => {
        // 1. Check Rate Limit
        const storedHistory = localStorage.getItem(REQUEST_HISTORY_KEY);
        let history: number[] = storedHistory ? JSON.parse(storedHistory) : [];
        const now = Date.now();
        history = history.filter(ts => now - ts < 24 * 60 * 60 * 1000); // Clean old

        if (history.length >= 5) {
            alert('Rate Limit Reached: You can only send 5 join requests every 24 hours.');
            return;
        }

        // 2. Add to history
        history.push(now);
        localStorage.setItem(REQUEST_HISTORY_KEY, JSON.stringify(history));

        alert(`Request sent to team! (Mock Action)\n\nIn a full implementation, this would update the team's request list.`);
        setSelectedTeamId(null);
    };

    return (
        <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search players by nickname..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-green-500/50 rounded-full pl-10 pr-4 py-2 outline-none transition-all text-sm"
                    />
                </div>
                <div className="text-sm text-zinc-500">
                    Showing <span className="text-white font-bold">{filteredPlayers.length + 1}</span> players
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {/* 1. CURRENT USER (Always First) */}
                <motion.div layout>
                    <div className="mb-2 text-xs font-bold uppercase tracking-widest text-green-400">Your ID Card</div>
                    <PlayerCard
                        player={currentUser}
                        team={getTeam(currentUser.teamId)}
                        isOwner={true}
                        onEdit={() => setIsEditModalOpen(true)}
                        onTeamClick={setSelectedTeamId}
                    />
                </motion.div>

                {/* 2. OTHER PLAYERS */}
                {filteredPlayers.map((player) => (
                    <motion.div key={player.id} layout>
                        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            Player
                        </div>
                        <PlayerCard
                            player={player}
                            team={getTeam(player.teamId)}
                            onTeamClick={setSelectedTeamId}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Team Details & Join Dialog */}
            <TeamDetailsDialog
                isOpen={!!selectedTeamId}
                onClose={() => setSelectedTeamId(null)}
                teamId={selectedTeamId}
                currentUserId={CURRENT_USER_ID}
                userHasTeam={!!currentUser.teamId}
                onJoinRequest={handleJoinRequest}
            />

            {/* Edit Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentUser={currentUser}
                onSave={handleSaveProfile}
            />
        </div>
    );
}
