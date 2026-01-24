import { Player, Team, Tournament, Match } from './esport-types';

export const MOCK_PLAYERS: Player[] = [
    {
        id: '100001',
        nickname: 'ShadowSlayer',
        firstName: 'Aziz',
        lastName: 'Rahimov',
        telegram: 'shadow_real',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ShadowSlayer',
        level: 15,
        gamesPlayed: 124,
        teamId: 'team_01',
        isActive: true,
        gameProfiles: [
            { game: 'MLBB', inGameNickname: 'ShadowML', gameId: '12345678' }
        ],
        joinedAt: '2025-01-01',
        role: 'CAPTAIN'
    },
    {
        id: '100002',
        nickname: 'ViperStrike',
        firstName: 'Bobur',
        lastName: 'Aliyev',
        telegram: 'viper_uz',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ViperStrike',
        level: 12,
        gamesPlayed: 98,
        teamId: 'team_01',
        isActive: true,
        gameProfiles: [
            { game: 'PUBG_MOBILE', inGameNickname: 'ViperPUBG', gameId: '87654321' }
        ],
        joinedAt: '2025-01-02',
        role: 'MEMBER'
    },
    {
        id: '100003',
        nickname: 'ProGamer99',
        firstName: 'Javohir',
        lastName: 'Eshonqulov',
        telegram: 'pro_javoh',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ProGamer99',
        level: 5,
        gamesPlayed: 20,
        isActive: true, // No team, but active
        gameProfiles: [
            { game: 'MLBB', inGameNickname: 'PG99', gameId: '11223344' }
        ],
        joinedAt: '2025-01-05',
    },
    {
        id: '100004',
        nickname: 'MysticMage',
        firstName: 'Sarvar',
        lastName: 'Qodirov',
        telegram: 'mystic_mage',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=MysticMage',
        level: 25,
        gamesPlayed: 300,
        teamId: 'team_02',
        isActive: true,
        gameProfiles: [
            { game: 'MLBB', inGameNickname: 'Mystic', gameId: '99887766' }
        ],
        joinedAt: '2024-12-15',
        role: 'CAPTAIN'
    },
    {
        id: '999999', // Simulate CURRENT USER
        nickname: 'HumoGladiator',
        firstName: 'Abduvoris',
        lastName: 'X',
        telegram: 'abduvoris_x',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=HumoGladiator',
        level: 1,
        gamesPlayed: 0,
        isActive: false, // Inactive validation test
        gameProfiles: [],
        joinedAt: '2026-01-20',
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
        members: [
            { playerId: '100001', role: 'OWNER', joinedAt: '2025-01-10' },
            { playerId: '100002', role: 'MEMBER', joinedAt: '2025-01-11' }
        ],
        requests: [
            { playerId: '100003', requestedAt: '2025-01-15', status: 'PENDING' }
        ],
        invites: [],
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
        members: [
            { playerId: '100004', role: 'OWNER', joinedAt: '2024-12-20' }
        ],
        requests: [],
        invites: [],
        createdAt: '2024-12-20',
        stats: { wins: 40, losses: 12, tournamentsPlayed: 5 }
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
