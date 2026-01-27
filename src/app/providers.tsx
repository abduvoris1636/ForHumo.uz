"use client";

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from "next-auth/react";
import { AuthSync } from "@/components/auth/auth-sync";

export function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <AuthSync />
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
            </ThemeProvider>
        </SessionProvider>
    );
}
