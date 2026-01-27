import { prisma } from '@/lib/prisma';
import { TournamentCard } from '@/components/esport/tournaments/TournamentCard';

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tournaments.map((t: any) => (
                    <TournamentCard key={t.id} tournament={t} />
                ))}
            </div>

            {tournaments.length === 0 && (
                <div className="text-center py-20 text-zinc-500">
                    No tournaments available at the moment.
                </div>
            )}
        </div>
    );
}
