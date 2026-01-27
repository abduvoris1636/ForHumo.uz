import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
    const logs: string[] = [];
    logs.push("API GET Request Started");

    try {
        // 1. Env Check
        logs.push(`Node: ${process.version}`);
        logs.push(`DATABASE_URL: ${process.env.DATABASE_URL ? 'Present' : 'MISSING'}`);

        // 2. Prisma Init
        logs.push("Instantiating Prisma...");
        const prisma = new PrismaClient();

        try {
            // 3. Connection
            logs.push("Connecting...");
            const count = await prisma.team.count();
            logs.push(`Success! Team Count: ${count}`);

            const teams = await prisma.team.findMany({
                take: 5,
                select: { id: true, name: true, tag: true }
            });
            logs.push(`Sample Teams: ${JSON.stringify(teams)}`);

        } catch (dbErr: any) {
            logs.push(`DB Error: ${dbErr.message}`);
        } finally {
            await prisma.$disconnect();
        }

        return NextResponse.json({ logs });
    } catch (err: any) {
        logs.push(`Fatal API Error: ${err.message}`);
        return NextResponse.json({ logs }, { status: 500 });
    }
}
