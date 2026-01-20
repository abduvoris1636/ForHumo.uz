import { Player } from '@/lib/esport-types';
import { EsportCard } from '../shared/EsportCard';
import { User, Trophy, Gamepad2, Hash } from 'lucide-react';
import Image from 'next/image';

interface PlayerIDCardProps {
    player: Player;
}

export function PlayerIDCard({ player }: PlayerIDCardProps) {
    return (
        <EsportCard className="w-full max-w-md mx-auto bg-gradient-to-b from-neutral-900 to-black border-white/10">
            <div className="flex flex-col items-center text-center">
                {/* Avatar Section */}
                <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 blur-lg opacity-50 animate-pulse" />
                    <div className="relative w-full h-full rounded-full border-2 border-white/20 overflow-hidden bg-neutral-800">
                        {player.avatar ? (
                            <Image
                                src={player.avatar}
                                alt={player.nickname}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <User className="w-full h-full p-6 text-neutral-400" />
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-neutral-900 border border-white/10 rounded-full px-2 py-0.5 text-xs font-bold text-white">
                        LVL {player.level}
                    </div>
                </div>

                {/* Identity Section */}
                <h3 className="text-2xl font-bold text-white mb-1">{player.nickname}</h3>
                <div className="flex items-center gap-2 text-neutral-400 text-sm mb-6 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    <Hash className="w-3 h-3" />
                    <span className="font-mono tracking-widest">{player.id}</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                    <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                        <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                        <div className="text-lg font-bold text-white">{player.gamesPlayed}</div>
                        <div className="text-xs text-neutral-500">Games Played</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                        <Gamepad2 className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                        <div className="text-lg font-bold text-white">{player.gameProfiles.length}</div>
                        <div className="text-xs text-neutral-500">Active Games</div>
                    </div>
                </div>

                {/* Game Profiles */}
                <div className="w-full text-left">
                    <h4 className="text-xs uppercase text-neutral-500 font-bold mb-3 tracking-wider">Game Profiles</h4>
                    <div className="space-y-2">
                        {player.gameProfiles.map((profile, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-neutral-800/50 p-2.5 rounded-lg border border-white/5">
                                <span className="text-sm font-medium text-white">{profile.game}</span>
                                <span className="text-sm text-neutral-400">{profile.inGameNickname}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </EsportCard>
    );
}
