import { Player, Team, Tournament, Match } from './esport-types';

// High-Security IDs: 8 chars, mixed case, numbers, symbols
export const MOCK_PLAYERS: Player[] = [
    {
        id: 'U7#m9$Kp', // Current User (Owner) - High Security
        nickname: 'Phoenix_99',
        firstName: 'Aziz',
        lastName: 'Rakhimov',
        telegram: '@aziz_phoenix',
        level: 42,
        gamesPlayed: 156,
        isActive: true, // Profile Complete
        gameProfiles: [
            { game: 'PUBG_MOBILE', inGameNickname: 'Phx_Aziz', gameId: '5123456789' },
            { game: 'MLBB', inGameNickname: 'Phx_Aziz_ML', gameId: '12345678' }
        ],
        joinedAt: '2024-11-15'
    },
    {
        id: 'X2$rL8*v',
        nickname: 'ShadowSlayer',
        firstName: 'Bekzod',
        lastName: 'Aliyev',
        telegram: '@shadow_slayer',
        level: 38,
        gamesPlayed: 120,
        teamId: 'team_01',
        isActive: true,
        gameProfiles: [
            { game: 'PUBG_MOBILE', inGameNickname: 'Shadow_UZ', gameId: '5987654321' }
        ],
        joinedAt: '2025-01-10'
    },
    {
        id: 'Q9@kM4!z',
        nickname: 'MysticMage',
        firstName: 'Diyor',
        lastName: 'Tursunov',
        telegram: '@diyor_mage',
        level: 25,
        gamesPlayed: 80,
        teamId: 'team_01',
        isActive: true,
        gameProfiles: [
            { game: 'MLBB', inGameNickname: 'Mystic_M', gameId: '87654321' }
        ],
        joinedAt: '2025-01-11'
    },
    {
        id: 'W5&tP7#y',
        nickname: 'NoobMaster',
        firstName: 'Sanjar',
        lastName: 'Karimov',
        telegram: '@sanjar_k',
        level: 5,
        gamesPlayed: 10,
        teamId: undefined, // Free agent
        isActive: true,
        gameProfiles: [
            { game: 'PUBG_MOBILE', inGameNickname: 'Sanjar_K', gameId: '555555555' }
        ],
        joinedAt: '2025-01-20'
    },
    {
        id: 'H3*bN6$m', // Team 2 Owner
        nickname: 'LegionCommander',
        firstName: 'Otabek',
        lastName: 'Juraev',
        telegram: '@legion_cmd',
        level: 45,
        gamesPlayed: 200,
        teamId: 'team_02',
        isActive: true,
        gameProfiles: [
            { game: 'MLBB', inGameNickname: 'LC_Otabek', gameId: '999888777' }
        ],
        joinedAt: '2024-12-01'
    }
];

// Mock Users for Auth Simulation
export const MOCK_USERS: import('./esport-types').MockUser[] = [
    {
        id: 'U7#m9$Kp', // Phoenix_99
        nickname: 'Phoenix_99',
        role: 'PLAYER',
        teamId: 'team_03', // Assuming team owner? Logic will check Store.
        avatar: undefined
    },
    {
        id: 'X2$rL8*v', // ShadowSlayer (Owner of Shadows Gaming)
        nickname: 'ShadowSlayer',
        role: 'PLAYER',
        teamId: 'team_01',
        avatar: undefined
    },
    {
        id: 'Q9@kM4!z', // MysticMage (Member of Shadows Gaming)
        nickname: 'MysticMage',
        role: 'PLAYER',
        teamId: 'team_01',
        avatar: undefined
    },
    {
        id: 'W5&tP7#y', // NoobMaster (Free Agent)
        nickname: 'NoobMaster',
        role: 'PLAYER',
        teamId: undefined,
        avatar: undefined
    },
    {
        id: 'H3*bN6$m', // LegionCommander (Owner of Team 2)
        nickname: 'LegionCommander',
        role: 'PLAYER',
        teamId: 'team_02',
        avatar: undefined
    },
    {
        id: 'ADMIN_001', // Admin User
        nickname: 'HumoAdmin',
        role: 'ADMIN',
        isAdmin: true,
        avatar: undefined
    }
];

export const MOCK_TEAMS: Team[] = [
    {
        id: 'team_01',
        name: 'Shadows Gaming',
        tag: 'SHDW',
        logo: 'https://api.dicebear.com/9.x/identicon/svg?seed=Shadows&backgroundColor=000000',
        ownerId: 'X2$rL8*v', // ShadowSlayer
        captainId: 'X2$rL8*v',
        level: 18,
        members: [
            { playerId: 'X2$rL8*v', role: 'OWNER', joinedAt: '2025-01-10' },
            { playerId: 'Q9@kM4!z', role: 'MEMBER', joinedAt: '2025-01-11' }
        ],
        requests: [
            { playerId: 'W5&tP7#y', requestedAt: '2025-01-15', status: 'PENDING' }
        ],
        invites: [],
        createdAt: '2025-01-10',
        stats: { wins: 15, losses: 5, tournamentsPlayed: 2 },
        status: 'ACTIVE'
    },
    {
        id: 'team_02',
        name: 'Mystic Legion',
        tag: 'MYST',
        logo: 'https://api.dicebear.com/9.x/identicon/svg?seed=Mystic&backgroundColor=000000',
        ownerId: 'R5#hT1xY', // LegionCommander
        captainId: 'R5#hT1xY',
        level: 25,
        members: [
            { playerId: 'R5#hT1xY', role: 'OWNER', joinedAt: '2024-12-20' }
        ],
        requests: [],
        invites: [],
        createdAt: '2024-12-20',
        stats: { wins: 40, losses: 12, tournamentsPlayed: 5 },
        status: 'ACTIVE'
    }
];

export const MOCK_TOURNAMENTS: Tournament[] = [
    {
        id: 'tour_autumn_2025',
        name: 'Autumn Tournament',
        season: '2025-2026',
        status: 'FINISHED',
        startDate: '2025-11-10',
        endDate: '2025-11-14',
        game: 'MLBB',
        prizePool: '200,000 UZS',
        maxTeams: 16,
        registeredTeams: ['team_01', 'team_02', 'team_03', 'team_04', 'team_05']
    },
    {
        id: 'tour_winter_2025',
        name: 'Winter Tournament',
        season: '2025-2026',
        status: 'LIVE',
        startDate: '2026-02-10',
        game: 'MLBB',
        prizePool: '500,000 UZS',
        maxTeams: 16,
        registeredTeams: [] // Currently empty
    },
    {
        id: 'tour_spring_2026',
        name: 'Spring Tournament',
        season: '2025-2026',
        status: 'UPCOMING',
        startDate: '2026-04-01',
        game: 'MLBB',
        prizePool: '500,000 UZS',
        maxTeams: 16,
        registeredTeams: []
    },
    {
        id: 'tour_summer_2026',
        name: 'Summer Tournament',
        season: '2025-2026',
        status: 'UPCOMING',
        startDate: '2026-07-01',
        game: 'MLBB',
        prizePool: '500,000 UZS',
        maxTeams: 16,
        registeredTeams: []
    },
    // PUBG Tournaments
    {
        id: 'tour_autumn_2025_pubg',
        name: 'Autumn Tournament',
        season: '2025-2026',
        status: 'CANCELLED',
        startDate: '2025-11-15',
        endDate: '2025-11-19',
        game: 'PUBG_MOBILE',
        prizePool: '200,000 UZS',
        maxTeams: 16,
        registeredTeams: []
    },
    {
        id: 'tour_winter_2025_pubg',
        name: 'Winter Tournament',
        season: '2025-2026',
        status: 'UPCOMING',
        startDate: '2026-02-15',
        game: 'PUBG_MOBILE',
        prizePool: '500,000 UZS',
        maxTeams: 16,
        registeredTeams: []
    },
    {
        id: 'tour_spring_2026_pubg',
        name: 'Spring Tournament',
        season: '2025-2026',
        status: 'UPCOMING',
        startDate: '2026-04-05',
        game: 'PUBG_MOBILE',
        prizePool: '500,000 UZS',
        maxTeams: 16,
        registeredTeams: []
    },
    {
        id: 'tour_summer_2026_pubg',
        name: 'Summer Tournament',
        season: '2025-2026',
        status: 'UPCOMING',
        startDate: '2026-07-05',
        game: 'PUBG_MOBILE',
        prizePool: '500,000 UZS',
        maxTeams: 16,
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
