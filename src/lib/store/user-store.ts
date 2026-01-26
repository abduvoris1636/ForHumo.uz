import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MockUser } from '../esport-types';
import { MOCK_USERS } from '../esport-data';

interface UserState {
    user: MockUser | null;
    users: MockUser[];
    isAuthenticated: boolean;

    // Actions
    login: (userId: string) => void;
    logout: () => void;
    initialize: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            users: MOCK_USERS,
            isAuthenticated: false,

            initialize: () => {
                const state = get();
                if (!state.user && state.users.length > 0) {
                    // Optionally set default user here if you want auto-login logic inside store
                    // But strictly speaking, initialize just ensures state is ready.
                    // The component handles auto-login policy.
                    set({ users: MOCK_USERS }); // Ensure users list is fresh from constant
                }
            },

            login: (userId: string) => {
                const targetUser = MOCK_USERS.find(u => u.id === userId);
                if (targetUser) {
                    set({ user: targetUser, isAuthenticated: true });
                }
            },

            logout: () => {
                set({ user: null, isAuthenticated: false });
            }
        }),
        {
            name: 'humo-user-auth',
        }
    )
);
