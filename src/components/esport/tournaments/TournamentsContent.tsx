'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TournamentCard } from './TournamentCard';
import { GameType } from '@/lib/esport-types';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface TournamentsContentProps {
    activeTournaments: any[];
}

export function TournamentsContent({ activeTournaments }: TournamentsContentProps) {
    const [activeTab, setActiveTab] = useState<GameType>('MLBB');
    const t = useTranslations('Esport');

    // Static Data for History/Future
    const HISTORY_DATA = {
        MLBB: [
            {
                id: 'autumn-2025',
                name: 'Autumn Tournament',
                season: 'Season 2025-2026',
                game: 'MLBB',
                status: 'COMPLETED',
                startDate: new Date('2025-11-10').toISOString(),
                maxTeams: 16,
                prizePool: "100,000,000 UZS",
                teams: Array(16).fill({}), // Mock for count
                description: "Champion: Star Boys"
            },
            {
                id: 'winter-2026',
                name: 'Winter Tournament',
                season: 'Season 2025-2026',
                game: 'MLBB',
                status: 'REGISTRATION', // Default, will be overridden if in DB
                startDate: new Date('2026-02-01').toISOString(),
                maxTeams: 32,
                prizePool: "50,000,000 UZS",
                teams: []
            },
            {
                id: 'spring-2026',
                name: 'Spring Tournament',
                season: 'Season 2025-2026',
                game: 'MLBB',
                status: 'UPCOMING',
                startDate: new Date('2026-05-01').toISOString(),
                maxTeams: 32,
                prizePool: "TBD",
                teams: []
            },
            {
                id: 'summer-2026',
                name: 'Summer Tournament',
                season: 'Season 2025-2026',
                game: 'MLBB',
                status: 'UPCOMING',
                startDate: new Date('2026-08-01').toISOString(),
                maxTeams: 32,
                prizePool: "TBD",
                teams: []
            }
        ],
        PUBG_MOBILE: [
            {
                id: 'autumn-2025-pubg',
                name: 'Autumn Tournament',
                season: 'Season 2025-2026',
                game: 'PUBG Mobile',
                status: 'CANCELLED',
                startDate: new Date('2025-11-10').toISOString(),
                maxTeams: 16,
                prizePool: "50,000,000 UZS",
                teams: [],
                description: "Did not take place"
            },
            {
                id: 'winter-2026-pubg',
                name: 'Winter Tournament',
                season: 'Season 2025-2026',
                game: 'PUBG Mobile',
                status: 'REGISTRATION',
                startDate: new Date('2026-02-01').toISOString(),
                maxTeams: 25,
                prizePool: "50,000,000 UZS",
                teams: []
            },
            {
                id: 'spring-2026-pubg',
                name: 'Spring Tournament',
                season: 'Season 2025-2026',
                game: 'PUBG Mobile',
                status: 'UPCOMING',
                startDate: new Date('2026-05-01').toISOString(),
                maxTeams: 25,
                prizePool: "TBD",
                teams: []
            },
            {
                id: 'summer-2026-pubg',
                name: 'Summer Tournament',
                season: 'Season 2025-2026',
                game: 'PUBG Mobile',
                status: 'UPCOMING',
                startDate: new Date('2026-08-01').toISOString(),
                maxTeams: 25,
                prizePool: "TBD",
                teams: []
            }
        ]
    };

    // Merge Logic: Use DB data if it matches, otherwise use Static
    const getDisplayedTournaments = (game: GameType) => {
        const staticList = HISTORY_DATA[game];

        return staticList.map(staticT => {
            // Try to find a real DB tournament that matches loosely by name/season or explicitly by ID if we sync them
            // For now, let's assume DB only has 'Winter' or nothing.
            // A precise match strategy: If DB has a tournament with status 'REGISTRATION' or 'LIVE' and matching game, assume it's the current 'Winter'.

            const realMatch = activeTournaments.find(act =>
                act.game === (game === 'MLBB' ? 'MLBB' : 'PUBG_MOBILE') &&
                (act.name.includes(staticT.name) || act.status === 'REGISTRATION')
            );

            // If we found a real match in DB and the static one is the "Current" one (Winter), use real data
            if (realMatch && staticT.name.includes('Winter')) {
                return { ...staticT, ...realMatch };
            }

            return staticT;
        });
    };

    const displayedTournaments = getDisplayedTournaments(activeTab);

    return (
        <div className="space-y-8">
            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-1">
                <button
                    onClick={() => setActiveTab('MLBB')}
                    className={cn(
                        "px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all relative",
                        activeTab === 'MLBB' ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                    )}
                >
                    Mobile Legends
                    {activeTab === 'MLBB' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('PUBG_MOBILE')}
                    className={cn(
                        "px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all relative",
                        activeTab === 'PUBG_MOBILE' ? "text-white" : "text-neutral-500 hover:text-neutral-300"
                    )}
                >
                    PUBG Mobile
                    {activeTab === 'PUBG_MOBILE' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500" />
                    )}
                </button>
            </div>

            {/* Content Grid */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                {displayedTournaments.map((t) => (
                    <div key={t.id} className="relative group">
                        {t.id === 'autumn-2025' ? (
                            <Link href="/esport/history/autumn-2025" className="block h-full">
                                <TournamentCard tournament={t} />
                            </Link>
                        ) : (
                            <TournamentCard tournament={t} />
                        )}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
