import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const confirm = searchParams.get('confirm');

    if (confirm !== 'YES') {
        return NextResponse.json({
            error: "Safety Lock Active. To delete ALL teams, visit this URL with '?confirm=YES' at the end."
        }, { status: 400 });
    }

    try {
        const prisma = new PrismaClient();

        try {
            // Delete in order of dependencies (though cascade might handle it, better explicit)
            await prisma.teamRequest.deleteMany({});
            await prisma.teamMember.deleteMany({});
            const deleted = await prisma.team.deleteMany({});

            return NextResponse.json({
                success: true,
                message: `Deleted ${deleted.count} teams. Database is clean.`,
                nextStep: "Go back to /esport/teams and create your fresh team!"
            });

        } finally {
            await prisma.$disconnect();
        }

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
