import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, tag, ownerId } = body

        if (!name || !tag || !ownerId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Ensure User exists (Sync Mock User to DB)
        try {
            await prisma.user.upsert({
                where: { id: ownerId },
                update: {}, // No updates if exists
                create: {
                    id: ownerId,
                    nickname: `User_${Math.floor(Date.now() / 1000)}_${ownerId.slice(0, 4)}`, // Timestamp + Suffix for uniqueness
                    // Add other required fields if any, schema shows nickname is @unique and required
                }
            })
        } catch (upsertError) {
            console.error("Failed to upsert user:", upsertError);
            // Continue? If upsert failed, likely foreign key constraint will fail next, but let's let it fail there or handle here.
            // If nickname collision (very rare with timestamp), it needs retry. 
            // For now, logging helps.
        }

        // 1. Check if user is already in ANY team
        const existingMembership = await prisma.teamMember.findFirst({
            where: { userId: ownerId }
        });

        if (existingMembership) {
            return NextResponse.json({ error: 'User is already a member of a team' }, { status: 403 });
        }

        // 2. Check if tag exists
        const existingTag = await prisma.team.findUnique({
            where: { tag },
        })

        if (existingTag) {
            return NextResponse.json({ error: 'Team tag already exists' }, { status: 409 })
        }

        // 3. Check if name exists (Case Insensitive)
        const existingName = await prisma.team.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive', // PostgreSQL specific
                }
            }
        });

        if (existingName) {
            return NextResponse.json({ error: 'Team name already exists' }, { status: 409 })
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

        // Revalidate the teams page to refresh cache
        revalidatePath('/[locale]/esport/teams');
        revalidatePath('/esport/teams');

        return NextResponse.json(team)
    } catch (error: any) {
        console.error('Error creating team:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
