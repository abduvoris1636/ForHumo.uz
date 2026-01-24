export type GameType = 'MLBB' | 'PUBG_MOBILE';

export interface Player {
    id: string; // 6-digit immutable ID
    nickname: string; // Unique global nickname, case-insensitive logic
    avatar?: string;
    firstName: string; // Required for profile
    lastName: string; // Required for profile
    telegram: string; // Required for profile
    level: number;
    gamesPlayed: number;
    teamId?: string;
    isActive: boolean; // True if profile is complete and valid
    gameProfiles: {
        game: GameType;
        inGameNickname: string;
        gameId?: string; // Private, never shown publicly
    }[];
    joinedAt: string;
    role?: 'CAPTAIN' | 'MEMBER' | 'SUB';
}

export type TeamRole = 'OWNER' | 'CAPTAIN' | 'MEMBER';
export type RequestStatus = 'PENDING' | 'REJECTED' | 'EXPIRED';

export interface TeamMember {
    playerId: string;
    role: TeamRole;
    joinedAt: string;
}

export interface JoinRequest {
    playerId: string;
    requestedAt: string;
    status: RequestStatus;
}

export interface TeamInvite {
    playerId: string;
    invitedBy: string; // Captain/Owner ID
    sentAt: string;
    expiresAt: string;
}

export interface Team {
    id: string;
    name: string;
    tag: string; // 2-4 uppercase letters
    logo?: string;

    // Core Logic (Refactored)
    ownerId: string; // Redundant but good for quick lookups
    captainId: string; // Redundant but good for quick lookups

    members: TeamMember[]; // Detailed list

    // Joining Logic
    requests: JoinRequest[]; // Detailed requests
    invites: TeamInvite[]; // Outgoing invites
    joinCode?: {
        code: string;
        createdAt: string;
        expiresAt: string;
    };

    level: number;
    createdAt: string;
    stats: {
        wins: number;
        losses: number;
        tournamentsPlayed: number;
    };

    // Legacy support (optional, can remove if we fully migrate)
    pendingRequests?: never;
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
