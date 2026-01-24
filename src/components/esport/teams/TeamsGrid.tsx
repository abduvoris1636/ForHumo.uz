'use client';

import { useState, useEffect } from 'react';
import { Team, JoinRequest, TeamMember } from '@/lib/esport-types';
import { MOCK_TEAMS } from '@/lib/esport-data';
import { TeamCard } from '@/components/esport/TeamCard';
import { CreateTeamModal } from './CreateTeamModal';
import { TeamManagementModal } from './TeamManagementModal';
import { JoinByCodeModal } from './JoinByCodeModal';
import { Search, PlusCircle, Users, KeyRound, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MY_TEAM_STORAGE_KEY = 'humo_esport_my_team_v2';
const TEAMS_STATE_STORAGE_KEY = 'humo_esport_teams_state_v2';
const CURRENT_USER_ID = 'U7#m9$Kp'; // Updated mock ID (Aziz - Secure)

export function TeamsGrid() {
    const [myTeam, setMyTeam] = useState<Team | null>(null);
    const [teamsState, setTeamsState] = useState<Team[]>(MOCK_TEAMS);

    // Modals State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isManagementOpen, setIsManagementOpen] = useState(false); // New Unified Owner Modal
    const [isJoinCodeModalOpen, setIsJoinCodeModalOpen] = useState(false); // For Player

    const [searchTerm, setSearchTerm] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    // Initial Load & Merge
    useEffect(() => {
        setIsMounted(true);
        // Load My Team
        const storedMyTeam = localStorage.getItem(MY_TEAM_STORAGE_KEY);
        if (storedMyTeam) {
            try { setMyTeam(JSON.parse(storedMyTeam)); } catch (e) { console.error(e); }
        }

        // Load Global Teams State
        const storedTeamsState = localStorage.getItem(TEAMS_STATE_STORAGE_KEY);
        if (storedTeamsState) {
            try {
                const localState = JSON.parse(storedTeamsState) as Team[];
                const mergedTeams = MOCK_TEAMS.map(mockTeam => {
                    const override = localState.find(t => t.id === mockTeam.id);
                    return override ? override : mockTeam;
                });
                setTeamsState(mergedTeams);
            } catch (e) { console.error(e); }
        }
    }, []);

    // Helper to persist teams state
    const updateTeamsState = (updatedTeams: Team[]) => {
        setTeamsState(updatedTeams);
        localStorage.setItem(TEAMS_STATE_STORAGE_KEY, JSON.stringify(updatedTeams));
    };

    const handleCreateTeam = (newTeam: Team) => {
        setMyTeam(newTeam);
        localStorage.setItem(MY_TEAM_STORAGE_KEY, JSON.stringify(newTeam));
    };

    const handleUpdateMyTeam = (updatedTeam: Team) => {
        setMyTeam(updatedTeam);
        localStorage.setItem(MY_TEAM_STORAGE_KEY, JSON.stringify(updatedTeam));

        // Also sync to global state
        const updatedTeams = teamsState.map(t => t.id === updatedTeam.id ? updatedTeam : t);
        updateTeamsState(updatedTeams);
    };

    const handleDeleteTeam = (teamId: string) => {
        // 1. Clear Local User State
        setMyTeam(null);
        localStorage.removeItem(MY_TEAM_STORAGE_KEY);

        // 2. Remove from Global State
        const updatedTeams = teamsState.filter(t => t.id !== teamId);
        updateTeamsState(updatedTeams);
    };

    // --- PHASE 2B: JOIN REQUEST LOGIC (Player Side) ---

    // --- PHASE 5: STRICT RATE LIMIT (24H) ---
    const REQUEST_HISTORY_KEY = 'humo_esport_request_history_v1';

    const getRequestCountLast24h = () => {
        try {
            const history = JSON.parse(localStorage.getItem(REQUEST_HISTORY_KEY) || '[]');
            const now = Date.now();
            // Filter timestamps within last 24h
            const valid = history.filter((ts: number) => now - ts < 24 * 60 * 60 * 1000);
            return valid;
        } catch {
            return [];
        }
    };

    const addRequestTimestamp = () => {
        const history = getRequestCountLast24h();
        history.push(Date.now());
        localStorage.setItem(REQUEST_HISTORY_KEY, JSON.stringify(history));
    };

    const hasPendingRequestForTeam = (teamId: string, playerId: string) => {
        const team = teamsState.find(t => t.id === teamId);
        return team?.requests.some(r => r.playerId === playerId && r.status === 'PENDING');
    };

    const handleSendRequest = (teamId: string) => {
        if (myTeam) return;

        // 1. Strict 24h Limit Check
        const recentRequests = getRequestCountLast24h();
        if (recentRequests.length >= 5) {
            alert(`Rate Limit Reached: You can only send 5 join requests every 24 hours. Please try again later.`);
            return;
        }

        // 2. Duplicate Check
        if (hasPendingRequestForTeam(teamId, CURRENT_USER_ID)) return;

        // 3. Procced
        const updatedTeams = teamsState.map(t => {
            if (t.id === teamId) {
                const newRequest: JoinRequest = {
                    playerId: CURRENT_USER_ID,
                    requestedAt: new Date().toISOString(),
                    status: 'PENDING'
                };
                return { ...t, requests: [...t.requests, newRequest] };
            }
            return t;
        });

        updateTeamsState(updatedTeams);
        addRequestTimestamp(); // Log this action
    };

    // --- PHASE 2C: JOIN BY CODE (Player Side) ---
    // ... (rest unchanged) ...
    const handleJoinByCode = async (code: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));

        const targetTeam = teamsState.find(t => t.joinCode?.code === code);

        if (!targetTeam || !targetTeam.joinCode) {
            throw new Error('Invalid code');
        }

        if (new Date(targetTeam.joinCode.expiresAt) < new Date()) {
            throw new Error('Code expired');
        }

        if (myTeam) {
            throw new Error('You are already in a team');
        }

        // Success: Join Logic
        const updatedTeams = teamsState.map(t => {
            if (t.id === targetTeam.id) {
                const newMember: TeamMember = {
                    playerId: CURRENT_USER_ID,
                    role: 'MEMBER',
                    joinedAt: new Date().toISOString()
                };
                // Consume Code (Invalidate)
                return {
                    ...t,
                    members: [...t.members, newMember],
                    joinCode: undefined
                };
            }
            // Clear other requests
            if (t.requests.some(r => r.playerId === CURRENT_USER_ID)) {
                return { ...t, requests: t.requests.filter(r => r.playerId !== CURRENT_USER_ID) };
            }
            return t;
        });

        updateTeamsState(updatedTeams);

        // Update My State
        const joinedTeam = updatedTeams.find(t => t.id === targetTeam.id);
        if (joinedTeam) handleCreateTeam(joinedTeam);
    };


    // --- RENDER ---

    const filteredTeams = teamsState.filter(t => {
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
                    const isPending = team.requests.some(r => r.playerId === CURRENT_USER_ID && r.status === 'PENDING');
                    const isOwner = team.ownerId === CURRENT_USER_ID;

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
                            />
                        </motion.div>
                    );
                })}
            </div>

            {/* Modals */}
            <CreateTeamModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                currentUserId={CURRENT_USER_ID}
                onSave={handleCreateTeam}
            />

            {/* UNIFIED MANAGEMENT MODAL */}
            {myTeam && (
                <TeamManagementModal
                    isOpen={isManagementOpen}
                    onClose={() => setIsManagementOpen(false)}
                    team={myTeam}
                    onUpdateTeam={handleUpdateMyTeam}
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
