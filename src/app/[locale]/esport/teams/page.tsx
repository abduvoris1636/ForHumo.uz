'use client';

import { useState } from 'react';
import { MOCK_TEAMS, MOCK_PLAYERS } from '@/lib/esport-data';
import { TeamCard } from '@/components/esport/TeamCard';
import { Search, PlusCircle, Users, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AnimatePresence, motion } from 'framer-motion';
// import { TeamDetailsDialog } from '@/components/esport/teams/TeamDetailsDialog'; // Commented out until updated or verified

export default function TeamsPage() {
    const t = useTranslations('Esport');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

    // MOCK USER STATE -> Simulates a user logged in with ID 999999
    const CURRENT_USER_ID = '999999';
    // Find if user is in any team
    const myTeam = MOCK_TEAMS.find(team => team.members.includes(CURRENT_USER_ID));

    const filteredTeams = MOCK_TEAMS.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.tag.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        // user's team first
        if (myTeam && a.id === myTeam.id) return -1;
        if (myTeam && b.id === myTeam.id) return 1;
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
                            {t('teams_list')}
                        </h1>
                        <p className="text-neutral-400 font-medium max-w-lg leading-relaxed">
                            {t('teams_subtitle')}
                        </p>
                    </div>

                    {/* Search & Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                            <input
                                type="text"
                                placeholder="Search Teams..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        {!myTeam ? (
                            <div className="flex gap-2">
                                <button className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                                    <LogIn size={20} />
                                    <span>Join Team</span>
                                </button>
                                <button className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                                    <PlusCircle size={20} />
                                    <span>Create</span>
                                </button>
                            </div>
                        ) : (
                            <div className="px-6 py-3.5 rounded-2xl bg-green-500/20 text-green-400 border border-green-500/30 font-bold flex items-center justify-center gap-2">
                                <Users size={20} />
                                <span>My Group: {myTeam.name}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Teams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredTeams.map((team, index) => (
                            <motion.div
                                key={team.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <TeamCard
                                    team={team}
                                    isMyTeam={myTeam?.id === team.id}
                                    rank={index + 1}
                                    onClick={() => setSelectedTeamId(team.id)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredTeams.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <Users className="w-20 h-20 text-white/10 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2">No teams found</h3>
                        <p className="text-neutral-500">
                            Try searching for a different name or tag.
                        </p>
                    </div>
                )}
            </div>

            {/* Team Details Dialog will be re-enabled later */}
            {/* <TeamDetailsDialog
                teamId={selectedTeamId}
                isOpen={!!selectedTeamId}
                onClose={() => setSelectedTeamId(null)}
            /> */}
        </div>
    );
}
