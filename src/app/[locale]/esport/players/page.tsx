'use client';

import { useState } from 'react';
import { MOCK_PLAYERS } from '@/lib/esport-data';
import { SectionHeader } from '@/components/esport/shared/SectionHeader';
import { PlayerGridItem } from '@/components/esport/player/PlayerGridItem';
import { EsportCard } from '@/components/esport/shared/EsportCard';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PlayersPage() {
    const t = useTranslations('Esport');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPlayers = MOCK_PLAYERS.filter(p =>
        p.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => b.level - a.level); // Default sort by Level Desc

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-20">
            <div className="container mx-auto">
                <SectionHeader title={t('total_players')} subtitle={t('players_subtitle')}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-neutral-900 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 w-full md:w-64 transition-colors"
                        />
                    </div>
                </SectionHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredPlayers.map(player => (
                        <PlayerGridItem key={player.id} player={player} />
                    ))}
                </div>

                {filteredPlayers.length === 0 && (
                    <div className="text-center py-20 text-neutral-500">
                        No players found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
}
