import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Database...');

    // 1. Create Users
    const user1 = await prisma.user.upsert({
        where: { nickname: 'ShadowSlayer' },
        update: {},
        create: {
            nickname: 'ShadowSlayer',
        },
    });

    const user2 = await prisma.user.upsert({
        where: { nickname: 'NoobMaster' },
        update: {},
        create: {
            nickname: 'NoobMaster',
        },
    });

    // 2. Create Team
    const team = await prisma.team.upsert({
        where: { tag: 'NGNE' },
        update: {},
        create: {
            name: 'Neon Genesis',
            tag: 'NGNE',
            ownerId: user1.id
        }
    });

    // 3. Add Members
    await prisma.teamMember.create({
        data: {
            userId: user1.id,
            teamId: team.id,
            role: 'OWNER'
        }
    }).catch(() => console.log('Member 1 already exists'));

    await prisma.teamMember.create({
        data: {
            userId: user2.id,
            teamId: team.id,
            role: 'MEMBER'
        }
    }).catch(() => console.log('Member 2 already exists'));

    console.log('Seeding Completed!');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });
