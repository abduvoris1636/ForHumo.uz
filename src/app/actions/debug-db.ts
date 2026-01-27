'use server';

import db from '@/lib/db';

export async function debugDatabase() {
    const logs: string[] = [];
    try {
        logs.push("Starting DB Debug...");

        // 1. Check Env
        logs.push(`DATABASE_URL Present: ${process.env.DATABASE_URL ? 'Yes ' + process.env.DATABASE_URL.substring(0, 10) + '...' : 'NO'}`);

        // 2. Count Users
        const userCount = await db.user.count();
        logs.push(`User Count: ${userCount}`);

        // 3. Count Teams
        const teamCount = await db.team.count();
        logs.push(`Team Count: ${teamCount}`);

        // 4. Fetch Raw Teams
        const teams = await db.team.findMany({ select: { id: true, name: true, tag: true } });
        logs.push(`Raw Teams Fetch: ${JSON.stringify(teams)}`);

        return { success: true, logs };
    } catch (error: any) {
        logs.push(`ERROR: ${error.message}`);
        logs.push(`STACK: ${error.stack}`);
        return { success: false, logs };
    }
}
