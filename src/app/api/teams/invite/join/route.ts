import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { code, userId } = body

        if (!code || !userId) {
            return NextResponse.json({ error: 'Missing code or user' }, { status: 400 })
        }

        // 1. Find Invite
        const invite = await prisma.teamInvite.findUnique({
            where: { code },
            include: { team: true }
        })

        if (!invite) {
            return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 })
        }

        // 2. Check Validity
        if (invite.usedCount >= invite.maxUses) {
            return NextResponse.json({ error: 'Invite code usage limit reached' }, { status: 400 })
        }

        if (invite.expiresAt && new Date() > invite.expiresAt) {
            return NextResponse.json({ error: 'Invite code has expired' }, { status: 400 })
        }

        // 3. Check if user already in team
        const membership = await prisma.teamMember.findUnique({
            where: {
                userId_teamId: {
                    userId,
                    teamId: invite.teamId
                }
            }
        })

        if (membership) {
            return NextResponse.json({ error: 'You are already a member of this team' }, { status: 400 })
        }

        // 4. Join Transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create Member
            const member = await tx.teamMember.create({
                data: {
                    userId,
                    teamId: invite.teamId,
                    role: 'MEMBER'
                }
            })

            // Increment Invite Count
            await tx.teamInvite.update({
                where: { id: invite.id },
                data: {
                    usedCount: { increment: 1 }
                }
            })

            // Optional: Reject pending requests to this team from this user
            await tx.joinRequest.updateMany({
                where: { userId, teamId: invite.teamId, status: 'PENDING' },
                data: { status: 'REJECTED' }
            });

            return member;
        })

        return NextResponse.json({ success: true, teamId: invite.teamId })

    } catch (error) {
        console.error('Error joining via invite:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
