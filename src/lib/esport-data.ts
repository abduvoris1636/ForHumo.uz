import { Player, Team, Tournament, Match } from './esport-types';

export const MOCK_PLAYERS: Player[] = [
    {
        id: '100001',
        nickname: 'ShadowSlayer',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ShadowSlayer',
        level: 15,
        gamesPlayed: 124,
        teamId: 'team_01',
        gameProfiles: [
            { game: 'MLBB', inGameNickname: 'ShadowML' }
        ],
        joinedAt: '2025-01-01'
    },
    {
        id: '100002',
        nickname: 'ViperStrike',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ViperStrike',
        level: 12,
        gamesPlayed: 98,
        teamId: 'team_01',
        gameProfiles: [
            { game: 'PUBG_MOBILE', inGameNickname: 'ViperPUBG' }
        ],
        joinedAt: '2025-01-02'
    },
    {
        id: '100003',
        nickname: 'ProGamer99',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ProGamer99',
        level: 5,
        gamesPlayed: 20,
        gameProfiles: [
            { game: 'MLBB', inGameNickname: 'PG99' }
        ],
        joinedAt: '2025-01-05'
    },
    {
        id: '100004',
        nickname: 'MysticMage',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=MysticMage',
        level: 25,
        gamesPlayed: 300,
        teamId: 'team_02',
        gameProfiles: [
            { game: 'MLBB', inGameNickname: 'Mystic' }
        ],
        joinedAt: '2024-12-15'
    }
];

export const MOCK_TEAMS: Team[] = [
    {
        id: 'team_01',
        name: 'Shadows Gaming',
        tag: 'SHDW',
        logo: 'https://api.dicebear.com/9.x/identicon/svg?seed=Shadows&backgroundColor=000000',
        ownerId: '100001',
        captainId: '100001',
        level: 18,
        members: ['100001', '100002'],
        createdAt: '2025-01-10',
        stats: { wins: 15, losses: 5, tournamentsPlayed: 2 }
    },
    {
        id: 'team_02',
        name: 'Mystic Legion',
        tag: 'MYST',
        logo: 'https://api.dicebear.com/9.x/identicon/svg?seed=Mystic&backgroundColor=000000',
        ownerId: '100004',
        captainId: '100004',
        level: 25,
        members: ['100004'],
        createdAt: '2024-12-20',
        stats: { wins: 40, losses: 12, tournamentsPlayed: 5 }
    }
];

export const MOCK_TOURNAMENTS: Tournament[] = [
    {
        id: 'tour_001',
        name: 'Winter Championship 2025',
        season: '2025-2026 Season',
        status: 'LIVE',
        startDate: '2026-01-15',
        game: 'MLBB',
        prizePool: '5,000,000 UZS',
        maxTeams: 16,
        registeredTeams: ['team_01', 'team_02']
    },
    {
        id: 'tour_002',
        name: 'Spring Cup 2026',
        season: '2025-2026 Season',
        status: 'UPCOMING',
        startDate: '2026-03-01',
        game: 'PUBG_MOBILE',
        prizePool: '10,000,000 UZS',
        maxTeams: 32,
        registeredTeams: []
    }
];

export const MOCK_MATCHES: Match[] = [
    {
        id: 'm_01',
        tournamentId: 'tour_001',
        teamAId: 'team_01',
        teamBId: 'team_02',
        scoreA: 1,
        scoreB: 2,
        status: 'FINISHED',
        startTime: '2026-01-18T18:00:00'
    },
    {
        id: 'm_02',
        tournamentId: 'tour_001',
        teamAId: 'team_02',
        teamBId: 'team_01',
        scoreA: 0,
        scoreB: 0,
        status: 'LIVE',
        startTime: '2026-01-20T12:00:00',
        streamUrl: 'https://youtube.com/live/example'
    }
];
