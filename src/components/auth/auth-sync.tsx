'use client';

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { CurrentUser } from "@/lib/esport-types";

export function AuthSync() {
    const { data: session, status } = useSession();
    const { login, logout, currentUser } = useAuthStore();

    useEffect(() => {
        if (status === 'loading') return;

        if (session?.user) {
            // Map NextAuth user to our CurrentUser type
            // Note: NextAuth user might only have name, email, image.
            // We need to ensure we have a valid ID.
            const sessionUser = session.user as any;
            const user: CurrentUser = {
                id: sessionUser.id || sessionUser.email || 'unknown',
                nickname: sessionUser.name || 'User',
                fullName: sessionUser.name || 'User',
                avatar: sessionUser.image || '',
                games: {}, // Default empty, ideally fetched from DB in a real scenario
                role: 'PLAYER'
            };

            // Only update if changed to avoid loops
            if (!currentUser || currentUser.id !== user.id) {
                login(user);
            }
        } else {
            if (currentUser) {
                logout();
            }
        }
    }, [session, status, login, logout, currentUser]);

    return null;
}
