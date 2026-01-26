import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { requestId, ownerId } = body

        if (!requestId || !ownerId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Fetch Request & Verify Owner
        const request = await prisma.joinRequest.findUnique({
            where: { id: requestId },
            include: { team: true }
        })

        if (!request) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 })
        }

        if (request.team.ownerId !== ownerId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        if (request.status !== 'PENDING') {
            return NextResponse.json({ error: 'Request is not pending' }, { status: 400 })
        }

        // 2. Transaction: Accept Request -> Create Member -> Reject other requests of this user
        await prisma.$transaction(async (tx) => {
            // A. Update Status to ACCEPTED
            await tx.joinRequest.update({
                where: { id: requestId },
                data: { status: 'ACCEPTED' }
            })

            // B. Create Team Member
            await tx.teamMember.create({
                data: {
                    userId: request.userId,
                    teamId: request.teamId,
                    role: 'MEMBER'
                }
            })

            // C. Reject all other PENDING requests from this user (since they joined a team)
            await tx.joinRequest.updateMany({
                where: {
                    userId: request.userId,
                    status: 'PENDING',
                    id: { not: requestId }
                },
                data: { status: 'REJECTED' }
            })
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error accepting request:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
