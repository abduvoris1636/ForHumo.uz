import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await req.json()
        const { teamId, requesterId } = body
        const { id: tournamentId } = await params

        if (!teamId || !requesterId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Verify Requester Permissions (Owner or Captain)
        const membership = await prisma.teamMember.findUnique({
            where: { userId_teamId: { userId: requesterId, teamId } }
        })

        if (!membership || !['OWNER', 'CAPTAIN'].includes(membership.role)) {
            return NextResponse.json({ error: 'Unauthorized: Only Owner or Captain can register team' }, { status: 403 })
        }

        // 2. Tournament Checks
        const tournament = await prisma.tournament.findUnique({
            where: { id: tournamentId },
            include: { teams: true }
        })

        if (!tournament) {
            return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
        }

        if (tournament.status !== 'UPCOMING') {
            return NextResponse.json({ error: 'Registration is closed (Tournament not upcoming)' }, { status: 400 })
        }

        if (tournament.teams.length >= tournament.maxTeams) {
            return NextResponse.json({ error: 'Tournament is full' }, { status: 400 })
        }

        // 3. Unique Registration Check
        const existing = await prisma.tournamentTeam.findUnique({
            where: {
                tournamentId_teamId: {
                    tournamentId,
                    teamId
                }
            }
        })

        if (existing) {
            return NextResponse.json({ error: 'Team already registered' }, { status: 409 })
        }

        // 4. Register
        const registration = await prisma.tournamentTeam.create({
            data: {
                tournamentId,
                teamId
            }
        })

        return NextResponse.json(registration)

    } catch (error) {
        console.error('Error registering team:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
