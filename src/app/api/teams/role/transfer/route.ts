import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { teamId, targetUserId, requesterId } = body

        if (!teamId || !targetUserId || !requesterId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Verify Requester is OWNER
        const requester = await prisma.teamMember.findUnique({
            where: { userId_teamId: { userId: requesterId, teamId } }
        })

        if (!requester || requester.role !== 'OWNER') {
            return NextResponse.json({ error: 'Unauthorized. Only Owner can transfer ownership.' }, { status: 403 })
        }

        // 2. Verify Target
        const target = await prisma.teamMember.findUnique({
            where: { userId_teamId: { userId: targetUserId, teamId } }
        })

        if (!target) {
            return NextResponse.json({ error: 'Target user not in team' }, { status: 404 })
        }

        // 3. Transactional Transfer
        await prisma.$transaction(async (tx) => {
            // A. Update Old Owner -> CAPTAIN (or MEMBER, usually CAPTAIN is polite)
            await tx.teamMember.update({
                where: { userId_teamId: { userId: requesterId, teamId } },
                data: { role: 'CAPTAIN' }
            })

            // B. Update New Owner -> OWNER
            await tx.teamMember.update({
                where: { userId_teamId: { userId: targetUserId, teamId } },
                data: { role: 'OWNER' }
            })

            // C. Update Team Reference
            await tx.team.update({
                where: { id: teamId },
                data: { ownerId: targetUserId }
            })
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error transferring ownership:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
