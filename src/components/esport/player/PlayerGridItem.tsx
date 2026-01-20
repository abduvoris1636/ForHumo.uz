import { Player } from '@/lib/esport-types';
import { EsportCard } from '../shared/EsportCard';
import { User, Trophy } from 'lucide-react';
import Image from 'next/image';

interface PlayerGridItemProps {
    player: Player;
}

export function PlayerGridItem({ player }: PlayerGridItemProps) {
    return (
        <EsportCard className="p-4 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-800 border border-white/10 shrink-0">
                    {player.avatar ? (
                        <Image
                            src={player.avatar}
                            alt={player.nickname}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <User className="w-full h-full p-2 text-neutral-400" />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold truncate">{player.nickname}</h4>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                        <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">LVL {player.level}</span>
                        <span className="flex items-center gap-1 truncate">
                            <Trophy className="w-3 h-3" /> {player.gamesPlayed} Matches
                        </span>
                    </div>
                </div>
            </div>
        </EsportCard>
    );
}
