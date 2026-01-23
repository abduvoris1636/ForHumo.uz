"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MOCK_PLAYERS } from "@/lib/esport-data";
import { Player, GameType } from "@/lib/esport-types";
import { ShieldCheck, ShieldAlert, Gamepad2, User, Camera, Trash2, AlertTriangle, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    player: Player | undefined; // Undefined if creating new
    onSave: (player: Player) => void;
    onDelete: (playerId: string) => void;
}

const AVATAR_SEEDS = ["Felix", "Aneka", "Shadow", "Viper", "Slayer", "Humo", "Legend", "King", "Queen", "Joker"];

export function ProfileModal({ isOpen, onClose, player, onSave, onDelete }: ProfileModalProps) {
    const isEditing = !!player;

    const [firstName, setFirstName] = useState(player?.firstName || "");
    const [lastName, setLastName] = useState(player?.lastName || "");
    const [nickname, setNickname] = useState(player?.nickname || "");
    const [telegram, setTelegram] = useState(player?.telegram || "");
    const [avatarSeed, setAvatarSeed] = useState(player?.avatar ? player.avatar.split('seed=')[1] : "Felix");

    // Games State
    const [mlbbId, setMlbbId] = useState(player?.gameProfiles.find(p => p.game === 'MLBB')?.gameId || "");
    const [mlbbNick, setMlbbNick] = useState(player?.gameProfiles.find(p => p.game === 'MLBB')?.inGameNickname || "");
    const [pubgId, setPubgId] = useState(player?.gameProfiles.find(p => p.game === 'PUBG_MOBILE')?.gameId || "");
    const [pubgNick, setPubgNick] = useState(player?.gameProfiles.find(p => p.game === 'PUBG_MOBILE')?.inGameNickname || "");

    const [error, setError] = useState<string | null>(null);

    // Validation
    const validate = () => {
        setError(null);

        // Required Fields
        if (!firstName.trim() || !lastName.trim() || !nickname.trim() || !telegram.trim()) {
            setError("All personal fields are required.");
            return false;
        }

        // Nickname Uniqueness (Case Insensitive)
        const nicknameExists = MOCK_PLAYERS.some(p =>
            p.id !== player?.id && p.nickname.toLowerCase() === nickname.toLowerCase()
        );
        if (nicknameExists) {
            setError(`Nickname "${nickname}" is already taken.`);
            return false;
        }

        // Games - At least one required
        const hasMlbb = mlbbId.trim() && mlbbNick.trim();
        const hasPubg = pubgId.trim() && pubgNick.trim();

        if (!hasMlbb && !hasPubg) {
            setError("You must link at least one game (MLBB or PUBG Mobile).");
            return false;
        }

        // Game ID Uniqueness check (Mock)
        if (hasMlbb) {
            const mlbbExists = MOCK_PLAYERS.some(p => p.id !== player?.id && p.gameProfiles.some(gp => gp.game === 'MLBB' && gp.gameId === mlbbId));
            if (mlbbExists) { setError("This MLBB ID is already registered."); return false; }
        }
        if (hasPubg) {
            const pubgExists = MOCK_PLAYERS.some(p => p.id !== player?.id && p.gameProfiles.some(gp => gp.game === 'PUBG_MOBILE' && gp.gameId === pubgId));
            if (pubgExists) { setError("This PUBG ID is already registered."); return false; }
        }

        return true;
    };

    const handleSave = () => {
        if (!validate()) return;

        const newGameProfiles = [];
        if (mlbbId.trim() && mlbbNick.trim()) {
            newGameProfiles.push({ game: 'MLBB' as GameType, inGameNickname: mlbbNick, gameId: mlbbId });
        }
        if (pubgId.trim() && pubgNick.trim()) {
            newGameProfiles.push({ game: 'PUBG_MOBILE' as GameType, inGameNickname: pubgNick, gameId: pubgId });
        }

        const newPlayer: Player = {
            id: player?.id || Math.floor(100000 + Math.random() * 900000).toString(), // Generate 6 digit ID if new
            nickname,
            firstName,
            lastName,
            telegram,
            avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${avatarSeed}`,
            level: player?.level || 1, // New starts at 1
            gamesPlayed: player?.gamesPlayed || 0, // New starts at 0
            isActive: true, // If saved successfully, it's active
            gameProfiles: newGameProfiles,
            joinedAt: player?.joinedAt || new Date().toISOString(),
            teamId: player?.teamId
        };

        onSave(newPlayer);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#0f1219] border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-0">
                <div className="p-6">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            {isEditing ? (
                                <>
                                    <ShieldCheck className="text-green-500" /> Edit ID Profile
                                </>
                            ) : (
                                <>
                                    <ShieldAlert className="text-blue-500" /> Create Humo ID
                                </>
                            )}
                        </DialogTitle>
                        <p className="text-neutral-400">
                            Your Game ID and personal details. <span className="text-yellow-500">Game IDs are private and only used for verification.</span>
                        </p>
                    </DialogHeader>

                    {/* Avatar Selection */}
                    <div className="mb-8">
                        <label className="text-xs font-bold text-neutral-500 uppercase mb-3 block">Choose Avatar</label>
                        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10">
                            {AVATAR_SEEDS.map((seed) => (
                                <button
                                    key={seed}
                                    onClick={() => setAvatarSeed(seed)}
                                    className={cn(
                                        "relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all",
                                        avatarSeed === seed ? "border-primary ring-2 ring-primary/30 scale-110" : "border-transparent opacity-60 hover:opacity-100"
                                    )}
                                >
                                    <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`} alt={seed} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 font-bold text-lg"><User size={18} className="text-blue-400" /> Personal Info</h3>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-neutral-500">First Name</label>
                                    <input
                                        value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                        placeholder="Aziz"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase text-neutral-500">Last Name</label>
                                    <input
                                        value={lastName} onChange={(e) => setLastName(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                        placeholder="Rahimov"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase text-neutral-500">Nickname (Unique)</label>
                                <input
                                    value={nickname} onChange={(e) => setNickname(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                    placeholder="ShadowSlayer"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase text-neutral-500">Telegram Username</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">@</span>
                                    <input
                                        value={telegram} onChange={(e) => setTelegram(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-sm focus:border-primary focus:outline-none"
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Game IDs */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 font-bold text-lg"><Gamepad2 size={18} className="text-purple-400" /> Game Profiles</h3>

                            {/* MLBB */}
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900/10 to-purple-900/10 border border-white/5 space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> MLBB (Mobile Legends)
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        value={mlbbNick} onChange={(e) => setMlbbNick(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                                        placeholder="In-Game Nick"
                                    />
                                    <input
                                        value={mlbbId} onChange={(e) => setMlbbId(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-xs font-mono focus:border-blue-500 focus:outline-none"
                                        placeholder="Game ID (12345)"
                                    />
                                </div>
                            </div>

                            {/* PUBG */}
                            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-900/10 to-yellow-900/10 border border-white/5 space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div> PUBG Mobile
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        value={pubgNick} onChange={(e) => setPubgNick(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
                                        placeholder="In-Game Nick"
                                    />
                                    <input
                                        value={pubgId} onChange={(e) => setPubgId(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-xs font-mono focus:border-orange-500 focus:outline-none"
                                        placeholder="Game ID (51234)"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm font-medium animate-pulse">
                            <AlertTriangle size={16} /> {error}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        {isEditing ? (
                            <button
                                onClick={() => onDelete(player.id)}
                                className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-sm font-bold hover:bg-red-500/20 transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={16} /> Delete Card
                            </button>
                        ) : <div></div>}

                        <div className="flex gap-4">
                            <button onClick={onClose} className="px-6 py-2 rounded-xl text-neutral-400 font-bold hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-8 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <CheckCircle size={18} /> Save Profile
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
