'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { JoinRequest, Player } from '@/lib/esport-types';
import { MOCK_PLAYERS } from '@/lib/esport-data';
import { Check, X, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface JoinRequestsModalProps {
    isOpen: boolean;
    onClose: () => void;
    requests: JoinRequest[];
    onAccept: (playerId: string) => void;
    onReject: (playerId: string) => void;
}

export function JoinRequestsModal({ isOpen, onClose, requests, onAccept, onReject }: JoinRequestsModalProps) {
    // Filter only pending
    const pendingRequests = requests.filter(r => r.status === 'PENDING');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-zinc-900 border border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <User className="w-5 h-5 text-zinc-400" />
                        Join Requests ({pendingRequests.length})
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    {pendingRequests.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500 italic">
                            No pending requests.
                        </div>
                    ) : (
                        pendingRequests.map((req) => {
                            // Find player details from mock
                            const player = MOCK_PLAYERS.find(p => p.id === req.playerId) || {
                                nickname: 'Unknown User',
                                firstName: 'ID: ' + req.playerId
                            } as Player;

                            return (
                                <motion.div
                                    key={req.playerId}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-black/40 p-3 rounded-lg border border-white/5 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden">
                                            {player.avatar && <img src={player.avatar} alt={player.nickname} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{player.nickname}</div>
                                            <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                                                Lvl {player.level} • {new Date(req.requestedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onReject(req.playerId)}
                                            className="p-2 hover:bg-red-500/20 text-zinc-500 hover:text-red-500 rounded-full transition-colors"
                                            title="Reject"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onAccept(req.playerId)}
                                            className="p-2 hover:bg-green-500/20 text-zinc-500 hover:text-green-500 rounded-full transition-colors border border-transparent hover:border-green-500/30"
                                            title="Accept"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
