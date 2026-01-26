import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { teamId, targetUserId, newRole, requesterId } = body

        if (!teamId || !targetUserId || !newRole || !requesterId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        if (!['CAPTAIN', 'MEMBER'].includes(newRole)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
        }

        // 1. Verify Requester is OWNER
        const requester = await prisma.teamMember.findUnique({
            where: { userId_teamId: { userId: requesterId, teamId } }
        })

        if (!requester || requester.role !== 'OWNER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // 2. Verify Target is in team
        const target = await prisma.teamMember.findUnique({
            where: { userId_teamId: { userId: targetUserId, teamId } }
        })

        if (!target) {
            return NextResponse.json({ error: 'Target user not in team' }, { status: 404 })
        }

        if (target.role === 'OWNER') {
            return NextResponse.json({ error: 'Cannot change Owner role directly' }, { status: 400 })
        }

        // 3. Update Role
        const updated = await prisma.teamMember.update({
            where: { userId_teamId: { userId: targetUserId, teamId } },
            data: { role: newRole }
        })

        return NextResponse.json(updated)

    } catch (error) {
        console.error('Error updating role:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
