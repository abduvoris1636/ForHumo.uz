'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Team } from '@/lib/esport-types';
import { MOCK_TEAMS } from '@/lib/esport-data';
import { compressImage } from '@/lib/image-utils';
import { X, Upload, Shield } from 'lucide-react';

interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUserId: string;
    onSave: (newTeam: Team) => void;
}

export function CreateTeamModal({ isOpen, onClose, currentUserId, onSave }: CreateTeamModalProps) {
    const [name, setName] = useState('');
    const [tag, setTag] = useState('');
    const [logo, setLogo] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const base64 = await compressImage(file);
            setLogo(base64);
            setErrors(prev => ({ ...prev, logo: '' })); // Clear error
        } catch (err) {
            console.error(err);
            setErrors(prev => ({ ...prev, logo: 'Failed to process image' }));
        } finally {
            setIsUploading(false);
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Name Validation
        if (!name.trim()) newErrors.name = 'Team Name is required';
        else if (name.length < 3) newErrors.name = 'Name too short (min 3 chars)';

        // Tag Validation
        const tagRegex = /^[A-Z]{2,4}$/;
        if (!tag) newErrors.tag = 'Tag is required';
        else if (!tagRegex.test(tag)) newErrors.tag = 'Tag must be 2-4 uppercase letters (A-Z)';
        else {
            // Check uniqueness
            const isTaken = MOCK_TEAMS.some(t => t.tag === tag);
            if (isTaken) newErrors.tag = 'Tag already exists';
        }

        // Logo Validation
        if (!logo) {
            // Optional: could generate default if empty, but spec says required? 
            // "Logo upload (required)" in prompt, but let's allow URL or default
            newErrors.logo = 'Logo URL is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            const newTeam: Team = {
                id: `team_${Date.now()}`, // Auto-generated ID
                name: name.trim(),
                tag: tag,
                logo: logo,
                ownerId: currentUserId,
                captainId: currentUserId,
                level: 1,
                members: [
                    { playerId: currentUserId, role: 'OWNER', joinedAt: new Date().toISOString() }
                ],
                requests: [],
                invites: [],
                createdAt: new Date().toISOString().split('T')[0],
                stats: { wins: 0, losses: 0, tournamentsPlayed: 0 }
            };
            onSave(newTeam);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-zinc-900 border border-zinc-800 text-white">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="text-green-500" />
                        Create New Team
                    </DialogTitle>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Team Name */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-zinc-500">Team Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Humo Gladiators"
                            className="w-full bg-black/50 border border-zinc-700 rounded p-2 focus:border-green-500 outline-none transition-colors"
                        />
                        {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                    </div>

                    {/* Short Tag */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-zinc-500">Short Tag (2-4 Uppercase)</label>
                        <input
                            value={tag}
                            onChange={(e) => setTag(e.target.value.toUpperCase())} // Force Upper
                            placeholder="e.g. HG"
                            maxLength={4}
                            className="w-full bg-black/50 border border-zinc-700 rounded p-2 focus:border-green-500 outline-none transition-colors font-mono tracking-wider"
                        />
                        {errors.tag && <span className="text-xs text-red-500">{errors.tag}</span>}
                    </div>

                    {/* Logo URL */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-zinc-500">Team Logo</label>
                        <div className="flex gap-2">
                            <div className="w-16 h-16 rounded border border-zinc-700 bg-zinc-900 overflow-hidden shrink-0">
                                {logo ? (
                                    <img src={logo} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <input
                                    value={logo}
                                    onChange={(e) => setLogo(e.target.value)}
                                    placeholder="Logo URL or Upload..."
                                    className="w-full bg-black/50 border border-zinc-700 rounded p-2 text-sm focus:border-green-500 outline-none transition-colors"
                                />
                                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs font-bold cursor-pointer transition-colors border border-zinc-700">
                                    <Upload className="w-3 h-3" />
                                    {isUploading ? 'Processing...' : 'Upload from Device'}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={isUploading}
                                    />
                                </label>
                            </div>
                        </div>
                        {errors.logo && <span className="text-xs text-red-500">{errors.logo}</span>}
                        <div className="text-[10px] text-zinc-600">
                            You can paste an image URL or upload directly from your device.
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
                            Create Team
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
