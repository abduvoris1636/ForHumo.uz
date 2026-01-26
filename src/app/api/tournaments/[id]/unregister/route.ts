import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()
        const { teamId, requesterId } = body
        const tournamentId = params.id

        if (!teamId || !requesterId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Verify Requester Permissions (Owner Only)
        const membership = await prisma.teamMember.findUnique({
            where: { userId_teamId: { userId: requesterId, teamId } }
        })

        if (!membership || membership.role !== 'OWNER') {
            return NextResponse.json({ error: 'Unauthorized: Only Owner can unregister' }, { status: 403 })
        }

        // 2. Check Tournament Rules (Before Start Date)
        const tournament = await prisma.tournament.findUnique({
            where: { id: tournamentId }
        })

        if (!tournament) {
            return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
        }

        if (new Date() >= tournament.startDate) {
            return NextResponse.json({ error: 'Cannot unregister after tournament start' }, { status: 400 })
        }

        // 3. Unregister
        await prisma.tournamentTeam.delete({
            where: {
                tournamentId_teamId: {
                    tournamentId,
                    teamId
                }
            }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error unregistering team:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
