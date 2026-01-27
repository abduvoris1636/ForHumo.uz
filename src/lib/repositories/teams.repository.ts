'use server';

import db from '@/lib/db';
import { Team } from '@/lib/esport-types';
import { MOCK_TEAMS } from '@/lib/esport-data';

const mapPrismaToTeam = (t: any): Team => ({
    id: t.id,
    name: t.name,
    tag: t.tag,
    logo: t.logo || undefined,
    level: t.level,
    createdAt: t.createdAt.toISOString(),
    ownerId: t.ownerId,
    captainId: t.captainId,
    status: t.status,
    disbandedAt: t.disbandedAt?.toISOString(),
    disbandReason: t.disbandReason || undefined,
    stats: {
        wins: t.wins,
        losses: t.losses,
        tournamentsPlayed: t.tournamentsPlayed
    },
    members: (t.members || []).map((m: any) => ({
        playerId: m.playerId,
        role: m.role,
        joinedAt: m.joinedAt.toISOString()
    })),
    requests: (t.requests || []).map((r: any) => ({
        playerId: r.playerId,
        status: r.status,
        requestedAt: r.requestedAt.toISOString()
    })),
    invites: [], // Simplified for now
});

export const TeamsRepository = {
    getAll: async (): Promise<Team[]> => {
        try {
            const teams = await db.team.findMany({
                include: { members: true, requests: true }
            });
            console.log(`[TeamsRepository] Fetching all teams. Found: ${teams.length}`);
            if (teams.length === 0) return [];
            return teams.map(mapPrismaToTeam);
        } catch (e) {
            console.error("DB Error (Teams):", e);
            return [];
        }
    },

    getById: async (id: string): Promise<Team | undefined> => {
        try {
            const team = await db.team.findUnique({
                where: { id },
                include: { members: true, requests: true }
            });
            if (!team) return undefined;
            return mapPrismaToTeam(team);
        } catch (e) {
            return undefined;
        }
    }
};
