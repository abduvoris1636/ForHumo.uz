export type Season = '2025-2026' | '2026-2027';

export type TournamentStatus = 'finished' | 'active' | 'upcoming';

export type TournamentType = 'autumn' | 'winter' | 'spring' | 'summer';

export interface Tournament {
    id: TournamentType;
    name: string;
    status: TournamentStatus;
}

export interface Player {
    id: string;
    name: string;
    surname: string;
    telegram: string;
    mlbbNickname: string;
    mlbbId: string;
}

export interface Team {
    id: string;
    name: string;
    shortName: string;
    logo?: string;
    ownerId: string;
    captainId: string;
    members: string[]; // Player IDs
}

export interface TournamentResult {
    teamId: string;
    teamName: string;
    rank: number;
    prize: string;
}

export interface PlayoffMatch {
    id: string;
    team1Id: string;
    team1Name: string;
    team1Score: number;
    team2Id: string;
    team2Name: string;
    team2Score: number;
    winnerId: string;
    stage: 'Semi-final' | '3rd Place' | 'Final';
}
