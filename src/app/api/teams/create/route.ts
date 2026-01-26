import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, tag, ownerId } = body

        if (!name || !tag || !ownerId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Check if tag exists
        const existing = await prisma.team.findUnique({
            where: { tag },
        })

        if (existing) {
            return NextResponse.json({ error: 'Team tag already exists' }, { status: 409 })
        }

        // Create Team and assign Owner role
        const team = await prisma.team.create({
            data: {
                name,
                tag,
                ownerId,
                members: {
                    create: {
                        userId: ownerId,
                        role: 'OWNER',
                    },
                },
            },
            include: {
                members: true,
            },
        })

        return NextResponse.json(team)
    } catch (error) {
        console.error('Error creating team:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
