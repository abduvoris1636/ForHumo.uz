'use server';

import db from '@/lib/db';
import { Player } from '@/lib/esport-types';
import { MOCK_PLAYERS } from '@/lib/esport-data';

// Helper to map Prisma User to our Player type
const mapPrismaToPlayer = (p: any): Player => ({
    id: p.id,
    nickname: p.nickname,
    avatar: p.avatar || undefined,
    firstName: p.firstName,
    lastName: p.lastName,
    telegram: p.telegram,
    level: p.level,
    gamesPlayed: p.gamesPlayed,
    isActive: p.isActive,
    joinedAt: p.joinedAt.toISOString(),
    gameProfiles: [
        p.mlbbInfo ? { game: 'MLBB', ...p.mlbbInfo } : null,
        p.pubgInfo ? { game: 'PUBG_MOBILE', ...p.pubgInfo } : null,
    ].filter(Boolean) as any[],
});

export const PlayersRepository = {
    getAll: async (): Promise<Player[]> => {
        try {
            const profiles = await db.playerProfile.findMany();
            if (profiles.length === 0) return []; // Fallback for demo
            return profiles.map(mapPrismaToPlayer);
        } catch (e) {
            console.error("DB Error (Players):", e);
            return []; // Fallback
        }
    },

    getById: async (id: string): Promise<Player | undefined> => {
        try {
            const profile = await db.playerProfile.findUnique({ where: { id } });
            if (!profile) return undefined; // Fallback
            return mapPrismaToPlayer(profile);
        } catch (e) {
            return undefined;
        }
    }
};
