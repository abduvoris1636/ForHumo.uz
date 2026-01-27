'use client';

import { useState, useEffect } from 'react';
import { Team, JoinRequest, TeamMember } from '@/lib/esport-types';
import { MOCK_TEAMS } from '@/lib/esport-data';
import { TeamCard } from '@/components/esport/TeamCard';
import { CreateTeamModal } from './CreateTeamModal';
import { TeamManagementModal } from './TeamManagementModal';
import { JoinByCodeModal } from './JoinByCodeModal';
import { TeamDetailsDialog } from './TeamDetailsDialog';
import { Search, PlusCircle, Users, KeyRound, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeamStore } from '@/lib/store/team-store';
import { useAuthStore } from '@/store/auth-store';

export function TeamsGrid() {
    const { teams, initialize: initTeams, getTeam, updateMemberRole } = useTeamStore();
    const { currentUser, initialize: initAuth } = useAuthStore();

    // Local UI State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isManagementOpen, setIsManagementOpen] = useState(false);
    const [isJoinCodeModalOpen, setIsJoinCodeModalOpen] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    // Initial Load
    useEffect(() => {
        initTeams();
        initAuth();
        setIsMounted(true);
    }, [initTeams, initAuth]);

    // Derived State
    const currentUserId = currentUser?.id;
    // Derive myTeam from store instead of local state
    const myTeam = currentUserId ? teams.find(t => t.members.some(m => m.playerId === currentUserId)) || null : null;

    // --- ACTIONS (Temporary Mocks or Store placeholders) ---
    // In a real app, these would wrap Store Actions

    const handleSendRequest = async (teamId: string) => {
        if (!currentUserId) { alert("Please login first"); return; }

        try {
            const res = await fetch('/api/teams/join-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId, userId: currentUserId })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to send request');
            }

            // Success
            alert("Join request sent!");
            window.location.reload(); // Refresh to update UI state from DB
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleCreateTeam = (newTeam: Team) => {
        // TODO: Implement addTeam in useTeamStore
        alert("Create Team simulated! (Logic pending migration to Store)");
        setIsCreateModalOpen(false);
    };

    const handleDeleteTeam = (teamId: string) => {
        // TODO: Implement deleteTeam in useTeamStore
        alert("Delete Team simulated! (Logic pending migration to Store)");
        setIsManagementOpen(false);
    };

    const handleUpdateTeam = (updatedTeam: Team) => {
        // TODO: Implement updateTeam in useTeamStore
        alert("Update Team simulated! (Logic pending migration to Store)");
    };

    const handleJoinByCode = async (code: string) => {
        if (!currentUserId) { alert("Please login first"); return; }

        try {
            const res = await fetch('/api/teams/invite/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, userId: currentUserId })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to join');
            }

            const data = await res.json();
            alert("Joined team successfully!");
            window.location.reload();
            setIsJoinCodeModalOpen(false);
        } catch (err: any) {
            throw new Error(err.message); // Pass to Modal to show error
        }
    };

    // --- RENDER ---

    const filteredTeams = teams.filter(t => {
        if (myTeam && t.id === myTeam.id) return false;
        const search = searchTerm.toLowerCase();
        return t.name.toLowerCase().includes(search) || t.tag.toLowerCase().includes(search);
    });

    const displayMyTeam = myTeam && (
        myTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        myTeam.tag.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isMounted) return <div className="min-h-[50vh] flex items-center justify-center text-zinc-500">Loading Teams...</div>;

    return (
        <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Search & Code Wrapper */}
                <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                    <div className="relative flex-1 md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search teams by name or tag..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-green-500/50 rounded-full pl-10 pr-4 py-2 outline-none transition-all text-sm"
                        />
                    </div>

                    {/* JOIN BY CODE BUTTON (Moved Next to Search) */}
                    {!myTeam && (
                        <button
                            onClick={() => setIsJoinCodeModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold transition-all border border-zinc-700 hover:border-zinc-500 whitespace-nowrap"
                        >
                            <KeyRound className="w-4 h-4 text-blue-400" />
                            <span className="hidden sm:inline">Join by Code</span>
                        </button>
                    )}
                </div>

                <div className="text-sm text-zinc-500 whitespace-nowrap">
                    Showing <span className="text-white font-bold">
                        {filteredTeams.length + (displayMyTeam ? 1 : 0)}
                    </span> teams
                    <span className="text-xs text-zinc-700 ml-2">(Total Loaded: {teams.length})</span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {/* 1. MY TEAM SLOT */}
                <AnimatePresence mode='popLayout'>
                    {myTeam ? (
                        displayMyTeam && (
                            <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-widest text-green-400">Your Team</span>
                                    {/* OWNER ACTION: MANAGE (Replaces Invite) */}
                                    <button
                                        onClick={() => setIsManagementOpen(true)}
                                        className="text-[10px] font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors bg-zinc-800/50 px-2 py-1 rounded"
                                    >
                                        <Settings className="w-3 h-3" /> Manage
                                    </button>
                                </div>
                                <TeamCard
                                    team={myTeam}
                                    isMyTeam={true}
                                    hasRequests={myTeam.requests.length > 0}
                                    pendingCount={myTeam.requests.filter(r => r.status === 'PENDING').length}
                                    onViewRequests={() => setIsManagementOpen(true)}
                                    onClick={() => setSelectedTeamId(myTeam.id)}
                                />
                            </motion.div>
                        )
                    ) : (
                        // CREATE TEAM
                        !searchTerm && (
                            <motion.div
                                layout
                                onClick={() => setIsCreateModalOpen(true)}
                                className="group relative w-full aspect-video md:aspect-[4/3] rounded-[24px] border-2 border-dashed border-zinc-800 hover:border-green-500/50 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 text-zinc-500 hover:text-green-400"
                            >
                                <div className="p-4 rounded-full bg-zinc-900 group-hover:bg-green-500/10 transition-colors">
                                    <PlusCircle className="w-8 h-8" />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-bold text-lg text-zinc-300 group-hover:text-white">Create a Team</h3>
                                    <p className="text-xs text-zinc-600 group-hover:text-zinc-500">Become a Captain</p>
                                </div>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>

                {/* 2. OTHER TEAMS */}
                {filteredTeams.map((team, idx) => {
                    const isPending = team.requests.some(r => r.playerId === currentUserId && r.status === 'PENDING');
                    const isOwner = team.ownerId === currentUserId;

                    return (
                        <motion.div key={team.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                Team
                            </div>
                            <TeamCard
                                team={team}
                                rank={idx + 1}
                                isPending={isPending}
                                userHasTeam={!!myTeam}
                                onRequestJoin={() => handleSendRequest(team.id)}
                                isMyTeam={isOwner}
                                hasRequests={isOwner && team.requests.length > 0}
                                pendingCount={isOwner ? team.requests.filter(r => r.status === 'PENDING').length : 0}
                                onViewRequests={() => setIsManagementOpen(true)}
                                onClick={() => setSelectedTeamId(team.id)}
                            />
                        </motion.div>
                    );
                })}
            </div>

            {/* Team Details Dialog (New Integration) */}
            <TeamDetailsDialog
                isOpen={!!selectedTeamId}
                onClose={() => setSelectedTeamId(null)}
                teamId={selectedTeamId}
                userHasTeam={!!myTeam}
                onJoinRequest={handleSendRequest}
            />

            {/* Modals */}
            <CreateTeamModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                currentUserId={currentUserId || ''}
                onSave={handleCreateTeam}
            />

            {myTeam && (
                <TeamManagementModal
                    isOpen={isManagementOpen}
                    onClose={() => setIsManagementOpen(false)}
                    team={myTeam}
                    onUpdateTeam={handleUpdateTeam}
                    onDeleteTeam={handleDeleteTeam}
                />
            )}

            <JoinByCodeModal
                isOpen={isJoinCodeModalOpen}
                onClose={() => setIsJoinCodeModalOpen(false)}
                onJoin={handleJoinByCode}
            />
        </div>
    );
}
