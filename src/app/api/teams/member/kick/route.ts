import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { teamId, targetUserId, requesterId } = body

        if (!teamId || !targetUserId || !requesterId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        if (targetUserId === requesterId) {
            return NextResponse.json({ error: 'Cannot kick self. Use Leave.' }, { status: 400 })
        }

        // 1. Get Roles
        const requester = await prisma.teamMember.findUnique({
            where: { userId_teamId: { userId: requesterId, teamId } }
        })

        const target = await prisma.teamMember.findUnique({
            where: { userId_teamId: { userId: targetUserId, teamId } }
        })

        if (!requester || !target) {
            return NextResponse.json({ error: 'User not found in team' }, { status: 404 })
        }

        // 2. Check Permissions
        // OWNER can kick anyone
        // CAPTAIN can kick MEMBER
        // MEMBER cannot kick
        let canKick = false;

        if (requester.role === 'OWNER') {
            canKick = true;
        } else if (requester.role === 'CAPTAIN') {
            if (target.role === 'MEMBER') {
                canKick = true;
            } else {
                return NextResponse.json({ error: 'Captains cannot kick other Captains or Owners' }, { status: 403 })
            }
        } else {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        if (!canKick) {
            return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
        }

        // 3. Delete Member
        await prisma.teamMember.delete({
            where: { userId_teamId: { userId: targetUserId, teamId } }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error kicking member:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
