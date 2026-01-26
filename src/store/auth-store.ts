import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CurrentUser } from '@/lib/esport-types';
import { MOCK_USERS } from '@/lib/mock-users';

interface AuthState {
    currentUser: CurrentUser | null;
    isAuthenticated: boolean;

    // Actions
    login: (userId: string) => void;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            currentUser: null,
            isAuthenticated: false,

            initialize: () => {
                // Could auto-login default user here if needed
                // For now, let's behave like a real app: no user by default unless persisted
                const state = get();
                // Ensure if we have a persisted user, it's consistent with MOCK_USERS (in case data changed)
                if (state.currentUser) {
                    const freshUser = MOCK_USERS.find(u => u.id === state.currentUser?.id);
                    if (freshUser) {
                        set({ currentUser: freshUser });
                    }
                }
            },

            login: (userId: string) => {
                const user = MOCK_USERS.find(u => u.id === userId);
                if (user) {
                    set({ currentUser: user, isAuthenticated: true });
                }
            },

            logout: () => {
                set({ currentUser: null, isAuthenticated: false });
            }
        }),
        {
            name: 'humo_auth_user_v1',
        }
    )
);
