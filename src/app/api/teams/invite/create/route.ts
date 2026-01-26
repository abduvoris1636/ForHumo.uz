import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { teamId, ownerId, maxUses } = body

        if (!teamId || !ownerId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Verify Team Ownership
        const team = await prisma.team.findUnique({
            where: { id: teamId }
        })

        if (!team || team.ownerId !== ownerId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // 2. Generate Unique Code (uppercase alphanumeric)
        // Using randomBytes tailored to be readable? Or just a simple string.
        // Let's use 8 chars hex for simplicity, uppercased.
        const code = randomBytes(4).toString('hex').toUpperCase();

        // 3. Create Invite
        const invite = await prisma.teamInvite.create({
            data: {
                code,
                teamId,
                createdBy: ownerId,
                maxUses: maxUses || 10,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Default 24h expiry
            }
        })

        return NextResponse.json(invite)

    } catch (error) {
        console.error('Error creating invite:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
