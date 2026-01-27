'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Player, Team, JoinRequest, TeamInvite, TeamMember } from '@/lib/esport-types';
import { MOCK_PLAYERS } from '@/lib/esport-data';
import { formatDistanceToNow } from 'date-fns';
import {
    Users, QrCode, Send, ArrowRight, X, Check, Timer, Copy, CheckCircle, RefreshCw, Trophy, Gamepad2, Search, Settings, Trash2, Upload, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { compressImage } from '@/lib/image-utils';

interface TeamManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    team: Team;
    onUpdateTeam: (updatedTeam: Team) => void;
    onDeleteTeam?: (teamId: string) => void;
}

type Tab = 'CODE' | 'INCOMING' | 'OUTGOING' | 'SETTINGS';

export function TeamManagementModal({ isOpen, onClose, team, onUpdateTeam, onDeleteTeam }: TeamManagementModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('CODE');

    // --- SETTINGS STATE ---
    const [editName, setEditName] = useState(team.name);
    const [editTag, setEditTag] = useState(team.tag);
    const [editLogo, setEditLogo] = useState(team.logo);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    // Sync state when opening
    useEffect(() => {
        if (isOpen) {
            setEditName(team.name);
            setEditTag(team.tag);
            setEditLogo(team.logo);
            setIsDeleteConfirmOpen(false);
        }
    }, [isOpen, team]);

    const handleSaveChanges = async () => {
        try {
            const res = await fetch('/api/teams/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamId: team.id,
                    userId: team.ownerId,
                    name: editName,
                    tag: editTag,
                    logo: editLogo
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update team');
            }

            const updatedTeamData = await res.json();

            // Trigger refresh
            onUpdateTeam({ ...team, ...updatedTeamData });
            alert('Team settings updated successfully!');

        } catch (err: any) {
            console.error(err);
            alert(err.message);
        }
    };

    // ... (rest of code)

    // UI Improvement for Logo Input
    // ...
                                                <input
                                                    value={editLogo.length > 100 ? "(Image Data Loaded)" : editLogo}
                                                    onChange={(e) => {
                                                        // Only allow editing if it's not a long data string, or if clearing
                                                        if (e.target.value.length < 100 || e.target.value === '') {
                                                            setEditLogo(e.target.value);
                                                        }
                                                    }}
                                                    className="w-full bg-black/30 border border-zinc-800 rounded p-2 text-xs focus:border-blue-500 outline-none text-zinc-500"
                                                    placeholder="Logo URL or Upload..."
                                                    readOnly={editLogo.length > 100}
                                                />
                                                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs font-bold cursor-pointer transition-colors border border-zinc-700">
                                                    <Upload className="w-3 h-3" /> Upload from Device
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={async (e) => {
}
