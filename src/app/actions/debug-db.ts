'use server';

import { PrismaClient } from '@prisma/client';

export async function debugDatabase() {
    const logs: string[] = [];
    try {
        logs.push("Starting DB Debug (Safemode)...");

        // 1. Check Env
        const url = process.env.DATABASE_URL;
        logs.push(`DATABASE_URL Type: ${typeof url}`);
        logs.push(`DATABASE_URL Length: ${url ? url.length : 0}`);

        if (!url) {
            logs.push("CRITICAL: DATABASE_URL is missing!");
            return { success: false, logs };
        }

        // 2. Instantiate Local Prisma
        logs.push("Instantiating Client...");
        const prisma = new PrismaClient();

        try {
            // 3. Connect/Query with Timeout
            logs.push("Connecting...");

            const result = await Promise.race([
                prisma.team.count(),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout (5s)")), 5000))
            ]);

            logs.push(`Connection Success! Team Count: ${result}`);

            // 4. Raw Query check
            const teams = await prisma.team.findMany({
                take: 5,
                select: { id: true, name: true, tag: true }
            });
            logs.push(`Sample Teams: ${teams.length}`);

        } catch (innerErr: any) {
            logs.push(`DB OP ERROR: ${innerErr.message}`);
        } finally {
            await prisma.$disconnect();
        }

        return { success: true, logs };
    } catch (error: any) {
        logs.push(`FATAL ACTION ERROR: ${error.message}`);
        return { success: false, logs };
    }
}
