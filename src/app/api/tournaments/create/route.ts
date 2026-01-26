import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, slug, game, maxTeams, startDate, requesterId } = body

        if (!name || !slug || !game || !maxTeams || !startDate || !requesterId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Verify Admin Role
        const user = await prisma.user.findUnique({
            where: { id: requesterId }
        })

        if (!user || user.role !== 'ADMIN') {
            // For development phase, we might want to allow this if no Admins exist yet,
            // but strictly following the prompt: "Only ADMIN role allowed".
            // I will stick to the rule. User needs to seed an Admin.
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
        }

        // 2. Create Tournament
        const tournament = await prisma.tournament.create({
            data: {
                name,
                slug,
                game,
                maxTeams: parseInt(maxTeams),
                startDate: new Date(startDate),
                status: 'UPCOMING'
            }
        })

        return NextResponse.json(tournament)

    } catch (error) {
        console.error('Error creating tournament:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
