export type GameType = 'MLBB' | 'PUBG_MOBILE';

export interface Player {
    id: string; // 6-digit immutable ID
    nickname: string; // Unique global nickname
    avatar?: string;
    firstName?: string; // Private
    lastName?: string; // Private
    telegram?: string; // Private
    level: number;
    gamesPlayed: number;
    teamId?: string;
    gameProfiles: {
        game: GameType;
        inGameNickname: string;
        gameId?: string; // Private, never shown
    }[];
    joinedAt: string;
}

export interface Team {
    id: string;
    name: string;
    tag: string; // 2-4 uppercase letters
    logo?: string;
    ownerId: string;
    captainId: string;
    level: number;
    members: string[]; // List of Player IDs
    createdAt: string;
    stats: {
        wins: number;
        losses: number;
        tournamentsPlayed: number;
    };
}

export interface Tournament {
    id: string;
    name: string;
    season: string; // e.g., "2025-2026 Season"
    status: 'UPCOMING' | 'LIVE' | 'FINISHED';
    startDate: string;
    endDate?: string;
    game: GameType;
    prizePool?: string;
    maxTeams: number;
    registeredTeams: string[]; // List of Team IDs
}

export interface Match {
    id: string;
    tournamentId: string;
    teamAId: string;
    teamBId: string;
    scoreA: number;
    scoreB: number;
    status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
    startTime: string;
    streamUrl?: string; // YouTube link
}

// RBAC Types
export type Role = 'ORGANIZER' | 'MODERATOR' | 'SYSTEM_AI';

export type Action =
    | 'FINALIZE_TOURNAMENT'
    | 'MARK_PAID'
    | 'TRANSFER_TEAM'
    | 'CREATE_MATCH'
    | 'EDIT_MATCH'
    | 'FLAG_INCIDENT'
    | 'VALIDATE_DATA';

export interface AuditLogEntry {
    id: string;
    actor: string; // e.g. "Admin User", "System AI"
    role: Role;
    action: Action;
    target: string; // e.g. "Match #123"
    timestamp: string;
    details?: string;
    status: 'SUCCESS' | 'FAILED' | 'FLAGGED';
}

export interface ValidationResult {
    isValid: boolean;
    flags: string[];
    confidence: number; // 0-1
}
