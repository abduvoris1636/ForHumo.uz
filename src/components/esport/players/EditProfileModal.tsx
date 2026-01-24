'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Player, GameType } from '@/lib/esport-types';
import { MOCK_PLAYERS } from '@/lib/esport-data';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: Player;
    onSave: (updatedPlayer: Player) => void;
}

export function EditProfileModal({ isOpen, onClose, currentUser, onSave }: EditProfileModalProps) {
    const [formData, setFormData] = useState<Player>(currentUser);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(currentUser);
            setErrors({});
        }
    }, [isOpen, currentUser]);

    const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddGame = () => {
        setFormData(prev => ({
            ...prev,
            gameProfiles: [
                ...prev.gameProfiles,
                { game: 'MLBB', inGameNickname: '', gameId: '' }
            ]
        }));
    };

    const handleRemoveGame = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gameProfiles: prev.gameProfiles.filter((_, i) => i !== index)
        }));
    };

    const handleGameChange = (index: number, field: string, value: string) => {
        const newProfiles = [...formData.gameProfiles];
        newProfiles[index] = { ...newProfiles[index], [field]: value };
        setFormData(prev => ({ ...prev, gameProfiles: newProfiles }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.telegram) newErrors.telegram = 'Telegram is required';

        // Nickname Uniqueness
        if (!formData.nickname) {
            newErrors.nickname = 'Nickname is required';
        } else {
            const isTaken = MOCK_PLAYERS.some(p =>
                p.id !== formData.id && // Ignore self
                p.nickname.toLowerCase() === formData.nickname.toLowerCase()
            );
            if (isTaken) newErrors.nickname = 'Nickname is already taken';
        }

        // Game Profiles Validation
        formData.gameProfiles.forEach((gp, idx) => {
            if (!gp.inGameNickname) newErrors[`game_${idx}_nick`] = 'Nickname required';
            if (!gp.gameId) newErrors[`game_${idx}_id`] = 'ID required';
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            // Determine active status
            const hasGames = formData.gameProfiles.length > 0;
            const completeProfile = formData.firstName && formData.lastName && formData.telegram && formData.nickname;
            const isActive = Boolean(completeProfile && hasGames);

            onSave({
                ...formData,
                isActive
            });
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-zinc-900 border border-zinc-800 text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-2xl font-bold">Edit ID Card</DialogTitle>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-zinc-500">First Name</label>
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleBasicChange}
                                className="w-full bg-black/50 border border-zinc-700 rounded p-2 focus:border-green-500 outline-none transition-colors"
                            />
                            {errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-zinc-500">Last Name</label>
                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleBasicChange}
                                className="w-full bg-black/50 border border-zinc-700 rounded p-2 focus:border-green-500 outline-none transition-colors"
                            />
                            {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-zinc-500">Nickname (Unique)</label>
                            <input
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleBasicChange}
                                className={`w-full bg-black/50 border rounded p-2 outline-none transition-colors ${errors.nickname ? 'border-red-500' : 'border-zinc-700 focus:border-green-500'}`}
                            />
                            {errors.nickname && <span className="text-xs text-red-500">{errors.nickname}</span>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold text-zinc-500">Telegram</label>
                            <input
                                name="telegram"
                                value={formData.telegram}
                                onChange={handleBasicChange}
                                className="w-full bg-black/50 border border-zinc-700 rounded p-2 focus:border-green-500 outline-none transition-colors"
                            />
                            {errors.telegram && <span className="text-xs text-red-500">{errors.telegram}</span>}
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-xs uppercase font-bold text-zinc-500">Avatar URL</label>
                            <input
                                name="avatar"
                                value={formData.avatar}
                                onChange={handleBasicChange}
                                placeholder="https://..."
                                className="w-full bg-black/50 border border-zinc-700 rounded p-2 focus:border-green-500 outline-none transition-colors"
                            />
                            <div className="text-[10px] text-zinc-600">Tip: Use Dicebear or Imgur for images</div>
                        </div>
                    </div>

                    {/* Games Section */}
                    <div className="border-t border-zinc-800 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-bold text-zinc-300">Game Profiles</label>
                            <button
                                onClick={handleAddGame}
                                className="flex items-center gap-1 text-xs font-bold text-green-400 hover:text-green-300 transition-colors"
                            >
                                <Plus className="w-4 h-4" /> ADD GAME
                            </button>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence>
                                {formData.gameProfiles.map((gp, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-zinc-800/30 p-3 rounded flex flex-col md:flex-row gap-3 items-start md:items-end border border-white/5"
                                    >
                                        <div className="w-full md:w-1/4 space-y-1">
                                            <label className="text-[10px] text-zinc-500 uppercase">Game</label>
                                            <select
                                                value={gp.game}
                                                onChange={(e) => handleGameChange(idx, 'game', e.target.value)}
                                                className="w-full bg-black/50 border border-zinc-700 rounded p-2 text-sm outline-none"
                                            >
                                                <option value="MLBB">MLBB</option>
                                                <option value="PUBG_MOBILE">PUBG Mobile</option>
                                            </select>
                                        </div>
                                        <div className="w-full md:w-1/3 space-y-1">
                                            <label className="text-[10px] text-zinc-500 uppercase">Game Nickname</label>
                                            <input
                                                value={gp.inGameNickname}
                                                onChange={(e) => handleGameChange(idx, 'inGameNickname', e.target.value)}
                                                className="w-full bg-black/50 border border-zinc-700 rounded p-2 text-sm outline-none"
                                            />
                                            {errors[`game_${idx}_nick`] && <span className="text-[10px] text-red-500">Required</span>}

                                        </div>
                                        <div className="w-full md:w-1/3 space-y-1">
                                            <label className="text-[10px] text-zinc-500 uppercase">Game ID (Hidden)</label>
                                            <input
                                                value={gp.gameId || ''}
                                                onChange={(e) => handleGameChange(idx, 'gameId', e.target.value)}
                                                type="text"
                                                className="w-full bg-black/50 border border-zinc-700 rounded p-2 text-sm outline-none font-mono"
                                            />
                                            {errors[`game_${idx}_id`] && <span className="text-[10px] text-red-500">Required</span>}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveGame(idx)}
                                            className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors self-end md:mb-0.5"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {formData.gameProfiles.length === 0 && (
                                <div className="text-center py-4 text-zinc-500 text-sm italic">
                                    No games added. Add at least one to activate your ID.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 rounded font-bold bg-green-500 text-black hover:bg-green-400 transition-colors shadow-[0_0_15px_-3px_rgba(34,197,94,0.4)]"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
