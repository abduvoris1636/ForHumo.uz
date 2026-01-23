'use client';

import { useState } from 'react';
import { MOCK_PLAYERS } from '@/lib/esport-data';
import { PlayerCard } from '@/components/esport/PlayerCard';
import { Search, PlusCircle, UserCircle, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlayersPage() {
    const t = useTranslations('Esport');
    const [searchTerm, setSearchTerm] = useState('');

    // MOCK USER STATE -> Simulates a user logged in with ID 999999
    const CURRENT_USER_ID = '999999';
    const currentUserProfile = MOCK_PLAYERS.find(p => p.id === CURRENT_USER_ID);

    const filteredPlayers = MOCK_PLAYERS.filter(p =>
        p.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.includes(searchTerm)
    ).sort((a, b) => {
        // ALWAYS put the current user first
        if (a.id === CURRENT_USER_ID) return -1;
        if (b.id === CURRENT_USER_ID) return 1;
        // Then sort by Level
        return b.level - a.level;
    });

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-7xl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 mb-2">
                            {t('total_players')}
                        </h1>
                        <p className="text-neutral-400 font-medium max-w-lg leading-relaxed">
                            {t('players_subtitle')}
                        </p>
                    </div>

                    {/* Search & Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                            <input
                                type="text"
                                placeholder={t('search_placeholder')} // "Search by nickname or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        {!currentUserProfile && (
                            <Link href="/esport/register" className="group">
                                <button className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all">
                                    <PlusCircle size={20} />
                                    <span>{t('register')}</span>
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* ID Card Alert (If User has profile but inactive) */}
                {currentUserProfile && !currentUserProfile.isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-4"
                    >
                        <ShieldAlert className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-red-400 text-lg mb-1">Action Required: Complete Your ID Profile</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed max-w-3xl">
                                Your Humo eSport ID is currently inactive. Please check your game profiles and ensure you have linked at least one active game account (MLBB or PUBG Mobile) to participate in tournaments.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Players Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
                    <AnimatePresence mode='popLayout'>
                        {filteredPlayers.map((player, index) => (
                            <motion.div
                                key={player.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <PlayerCard
                                    player={player}
                                    isCurrentUser={player.id === CURRENT_USER_ID}
                                    rank={index + 1}
                                    showRank={!searchTerm} // Only show rank if not searching
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredPlayers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <UserCircle className="w-20 h-20 text-white/10 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2">No players found</h3>
                        <p className="text-neutral-500">
                            We couldn't find anyone matching "{searchTerm}". Try a different keyword.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
