import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { teamId, userId, action, currentUserId } = await req.json();

        if (!teamId || !userId || !action || !currentUserId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify Team and Ownership
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: { members: true }
        });

        if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 });

        // Check if current user is owner or has permission
        // Simplified: only owner can accept for now
        if (team.ownerId !== currentUserId) {
            return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
        }

        if (action === 'ACCEPT') {
            // Transaction: Create Member, Delete Request (or update status)
            // Also check limit (e.g. 5 members max)
            if (team.members.length >= 6) { // 5 + 1 Sub? Let's say 6 for now
                return NextResponse.json({ error: 'Team is full' }, { status: 400 });
            }

            await prisma.$transaction([
                prisma.teamMember.create({
                    data: {
                        teamId,
                        userId,
                        role: 'MEMBER'
                    }
                }),
                prisma.joinRequest.deleteMany({
                    where: {
                        teamId,
                        userId
                    }
                }),
                // Update User's teamId (if your schema stores it on User too, but better purely relational)
            ]);

            return NextResponse.json({ success: true, message: 'Player accepted' });

        } else if (action === 'REJECT') {
            await prisma.joinRequest.deleteMany({
                where: {
                    teamId,
                    userId
                }
            });
            return NextResponse.json({ success: true, message: 'Request rejected' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Error handling request:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
