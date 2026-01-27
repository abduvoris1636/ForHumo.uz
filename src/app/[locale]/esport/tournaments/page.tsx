import { prisma } from '@/lib/prisma';
import { TournamentsContent } from '@/components/esport/tournaments/TournamentsContent';

// Force dynamic rendering since we are fetching data that changes
export const dynamic = 'force-dynamic';

export default async function TournamentsPage() {
    let tournamentsData: any[] = [];
    try {
        tournamentsData = await prisma.tournament.findMany({
            orderBy: { startDate: 'asc' },
            include: { teams: true }
        });
    } catch (error) {
        console.error("Failed to fetch tournaments:", error);
        // Fallback or empty array
        tournamentsData = [];
    }

    const tournaments = JSON.parse(JSON.stringify(tournamentsData));

    return (
        <div className="space-y-8 p-4 md:p-8 pt-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Tournaments</h1>
                <p className="text-zinc-400">Join upcoming competitive events.</p>
            </div>

            <TournamentsContent activeTournaments={tournaments} />
        </div>
    );
}
