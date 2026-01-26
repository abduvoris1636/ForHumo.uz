import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Team, TeamRole, TeamMember } from '../esport-types';
import { TeamsRepository } from '@/lib/repositories';

interface TeamState {
    teams: Team[];
    initialized: boolean;

    // Actions
    initialize: () => Promise<void>;
    getTeam: (teamId: string) => Team | undefined;
    updateMemberRole: (teamId: string, memberId: string, newRole: TeamRole) => void;
    removeMember: (teamId: string, memberId: string) => void;
    transferOwnership: (teamId: string, newOwnerId: string) => void;
    leaveTeam: (teamId: string, playerId: string) => { success: boolean; error?: string };
    disbandTeam: (teamId: string, reason?: string) => { success: boolean; error?: string };
    generateJoinCode: (teamId: string, userId: string) => { success: boolean; code?: string; error?: string };
}

export const useTeamStore = create<TeamState>()(
    persist(
        (set, get) => ({
            teams: [],
            initialized: false,

            initialize: async () => {
                const state = get();
                if (!state.initialized && state.teams.length === 0) {
                    const teams = await TeamsRepository.getAll();
                    set({ teams: teams, initialized: true });
                }
            },

            getTeam: (id) => get().teams.find(t => t.id === id),

            updateMemberRole: (teamId, memberId, newRole) => {
                set(state => ({
                    teams: state.teams.map(t => {
                        if (t.id !== teamId) return t;
                        if (t.status === 'DISBANDED') return t;

                        let updatedMembers: TeamMember[] = [...t.members];

                        if (newRole === 'CAPTAIN') {
                            updatedMembers = updatedMembers.map((m: TeamMember) =>
                                m.role === 'CAPTAIN' ? { ...m, role: 'MEMBER' as TeamRole } : m
                            );
                        }

                        updatedMembers = updatedMembers.map((m: TeamMember) =>
                            m.playerId === memberId ? { ...m, role: newRole } : m
                        );

                        let newCaptainId = t.captainId;
                        if (newRole === 'CAPTAIN') {
                            newCaptainId = memberId;
                        }

                        return { ...t, members: updatedMembers, captainId: newCaptainId };
                    })
                }));
            },

            removeMember: (teamId, memberId) => {
                set(state => ({
                    teams: state.teams.map(t => {
                        if (t.id !== teamId) return t;
                        if (t.status === 'DISBANDED') return t;
                        const newMembers = t.members.filter(m => m.playerId !== memberId);

                        let newCaptainId = t.captainId;
                        if (t.captainId === memberId) {
                            newCaptainId = t.ownerId;
                        }

                        return { ...t, members: newMembers, captainId: newCaptainId };
                    })
                }));
            },

            transferOwnership: (teamId, newOwnerId) => {
                set(state => ({
                    teams: state.teams.map(t => {
                        if (t.id !== teamId) return t;
                        if (t.status === 'DISBANDED') return t;

                        const currentOwnerId = t.ownerId;
                        if (currentOwnerId === newOwnerId) return t;

                        const newMembers = t.members.map(m => {
                            if (m.playerId === newOwnerId) return { ...m, role: 'OWNER' as const };
                            if (m.playerId === currentOwnerId) return { ...m, role: 'MEMBER' as const };
                            return m;
                        });

                        return {
                            ...t,
                            ownerId: newOwnerId,
                            captainId: newOwnerId,
                            members: newMembers
                        };
                    })
                }));
            },

            leaveTeam: (teamId, playerId) => {
                const team = get().teams.find(t => t.id === teamId);
                if (!team) return { success: false, error: 'Team not found' };
                if (team.status === 'DISBANDED') return { success: false, error: 'Team is disbanded' };

                if (team.ownerId === playerId) {
                    if (team.members.length > 1) {
                        return { success: false, error: 'Owner must transfer ownership before leaving, or disband the team.' };
                    }
                }

                set(state => ({
                    teams: state.teams.map(t => {
                        if (t.id !== teamId) return t;
                        const newMembers = t.members.filter(m => m.playerId !== playerId);
                        const newStatus = newMembers.length === 0 ? 'INACTIVE' : t.status;
                        return {
                            ...t,
                            members: newMembers,
                            status: newStatus
                        };
                    })
                }));
                return { success: true };
            },

            disbandTeam: (teamId: string, reason?: string) => {
                const team = get().teams.find(t => t.id === teamId);
                if (!team) return { success: false, error: 'Team not found' };

                set(state => ({
                    teams: state.teams.map(t => {
                        if (t.id !== teamId) return t;
                        return {
                            ...t,
                            status: 'DISBANDED',
                            disbandedAt: new Date().toISOString(),
                            disbandReason: reason || 'Disbanded by owner'
                        };
                    })
                }));
                return { success: true };
            },

            generateJoinCode: (teamId, userId) => {
                return { success: false, error: "Not implemented yet" };
            }
        }),
        {
            name: 'humo-team-storage',
        }
    )
);
