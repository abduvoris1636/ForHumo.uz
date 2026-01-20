'use client';

import { useState } from 'react';
import { MOCK_PLAYERS } from '@/lib/esport-data';
import { SectionHeader } from '@/components/esport/shared/SectionHeader';
import { PlayerGridItem } from '@/components/esport/player/PlayerGridItem';
import { AnimatedButton } from '@/components/esport/shared/AnimatedButton';
import { Search, PlusCircle, UserCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function PlayersPage() {
    const t = useTranslations('Esport');
    const [searchTerm, setSearchTerm] = useState('');

    // MOCK USER STATE
    // In real app, check session/DB
    const mockUser = {
        hasProfile: true, // Set to false to see CTA
        playerId: 'player1' // Matches "Faker_Uz" in mock data
    };

    const filteredPlayers = MOCK_PLAYERS.filter(p =>
        p.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        // ALWAYS put the current user first if they match the filter
        if (a.id === mockUser.playerId) return -1;
        if (b.id === mockUser.playerId) return 1;
        // Then sort by Level
        return b.level - a.level;
    });

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

                {/* Create Profile CTA (If user has no profile) */}
                {!mockUser.hasProfile && !searchTerm && (
                    <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 rounded-full text-green-500">
                                <UserCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{t('id_card_title')}</h3>
                                <p className="text-neutral-400">{t('id_card_desc')}</p>
                            </div>
                        </div>
                        <Link href="/esport/register">
                            <AnimatedButton className="whitespace-nowrap">
                                <PlusCircle className="w-5 h-5 mr-2" /> {t('register')}
                            </AnimatedButton>
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredPlayers.map(player => {
                        const isMe = player.id === mockUser.playerId;
                        return (
                            <div key={player.id} className={isMe ? 'ring-2 ring-blue-500 rounded-xl relative' : ''}>
                                {isMe && (
                                    <div className="absolute -top-3 left-4 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-lg">
                                        YOU
                                    </div>
                                )}
                                <PlayerGridItem player={player} />
                            </div>
                        );
                    })}
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
