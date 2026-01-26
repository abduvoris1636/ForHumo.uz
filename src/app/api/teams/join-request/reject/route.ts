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

        // 2. Reject
        const updated = await prisma.joinRequest.update({
            where: { id: requestId },
            data: { status: 'REJECTED' }
        })

        return NextResponse.json(updated)

    } catch (error) {
        console.error('Error rejecting request:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
