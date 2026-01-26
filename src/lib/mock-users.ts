import { CurrentUser } from './esport-types';

export const MOCK_USERS: CurrentUser[] = [
    {
        id: 'user_phantom',
        fullName: 'Aziz Rakhimov',
        nickname: 'Phoenix_99',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Phoenix',
        telegram: '@aziz_phx',
        games: {
            mlbb: { nickname: 'Phx_Aziz', playerId: '5123456789' },
            pubg: { nickname: 'Phx_Aziz_PUBG', playerId: '555111222' }
        }
    },
    {
        id: 'user_shadow',
        fullName: 'Bekzod Aliyev',
        nickname: 'ShadowSlayer',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Shadow',
        telegram: '@shadow_ali',
        games: {
            pubg: { nickname: 'Shadow_UZ', playerId: '5987654321' }
        }
    },
    {
        id: 'user_dragon',
        fullName: 'Diyor Tursunov',
        nickname: 'MysticMage',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Mystic',
        telegram: '@diyor_mage',
        role: 'PLAYER',
        games: {
            mlbb: { nickname: 'Mystic_M', playerId: '87654321' }
        }
    },
    {
        id: 'user_viper',
        fullName: 'Sanjar Karimov',
        nickname: 'ViperStrike',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Viper',
        telegram: '@sanjar_k',
        games: {
            pubg: { nickname: 'Viper_K', playerId: '999000111' }
        }
    },
    {
        id: 'user_admin',
        fullName: 'System Admin',
        nickname: 'HumoAdmin',
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Admin',
        isAdmin: true,
        role: 'ADMIN',
        games: {}
    }
];
