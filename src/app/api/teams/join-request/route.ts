import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { teamId, userId } = body

        if (!teamId || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Check if user is already a member of ANY team
        const membership = await prisma.teamMember.findFirst({
            where: { userId }
        })

        if (membership) {
            return NextResponse.json({ error: 'You are already in a team' }, { status: 400 })
        }

        // 2. Check Pending Request Limit (Max 5)
        const pendingCount = await prisma.joinRequest.count({
            where: {
                userId,
                status: 'PENDING'
            }
        })

        if (pendingCount >= 5) {
            return NextResponse.json({ error: 'You have reached the limit of 5 pending requests' }, { status: 400 })
        }

        // 3. Check for existing request to THIS team
        const existing = await prisma.joinRequest.findUnique({
            where: {
                userId_teamId: {
                    userId,
                    teamId
                }
            }
        })

        if (existing && existing.status === 'PENDING') {
            return NextResponse.json({ error: 'Request already sent' }, { status: 409 })
        }

        // 4. Create Request
        const request = await prisma.joinRequest.create({
            data: {
                userId,
                teamId,
                status: 'PENDING'
            }
        })

        return NextResponse.json(request)

    } catch (error) {
        console.error('Error sending join request:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
