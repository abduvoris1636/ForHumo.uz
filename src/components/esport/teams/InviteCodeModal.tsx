'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Timer, Copy, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface InviteCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    joinCode?: { code: string; expiresAt: string };
    onGenerateCode: () => void;
}

export function InviteCodeModal({ isOpen, onClose, joinCode, onGenerateCode }: InviteCodeModalProps) {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isOpen || !joinCode) {
            setTimeLeft(0);
            return;
        }

        const expires = new Date(joinCode.expiresAt).getTime();

        const updateTimer = () => {
            const now = Date.now();
            const diff = Math.max(0, Math.floor((expires - now) / 1000));
            setTimeLeft(diff);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [isOpen, joinCode]);

    const handleCopy = () => {
        if (joinCode) {
            navigator.clipboard.writeText(joinCode.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm bg-zinc-900 border border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Timer className="w-5 h-5 text-green-400" />
                        Invite Player
                    </DialogTitle>
                </DialogHeader>

                <div className="py-6 flex flex-col items-center justify-center space-y-6">
                    {!joinCode || timeLeft === 0 ? (
                        <div className="text-center space-y-4">
                            <p className="text-zinc-400 text-sm">
                                Generate a temporary 5-character code. Players can use this code to join your team instantly.
                            </p>
                            <button
                                onClick={onGenerateCode}
                                className="px-6 py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full transition-all active:scale-95 shadow-[0_0_15px_-3px_rgba(34,197,94,0.4)]"
                            >
                                Generate Code
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="text-center space-y-1">
                                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
                                    Expires in {formatTime(timeLeft)}
                                </div>
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-5xl font-mono font-bold tracking-widest text-white"
                                >
                                    {joinCode.code}
                                </motion.div>
                            </div>

                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 transition-colors"
                            >
                                {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy Code'}
                            </button>

                            <p className="text-xs text-zinc-500 text-center max-w-[80%]">
                                Share this code with your teammate. It is valid for one use only.
                            </p>

                            {/* Option to regenerate if needed (reset timer) */}
                            {timeLeft < 290 && (
                                <button onClick={onGenerateCode} className="text-[10px] text-zinc-600 hover:text-white flex items-center gap-1">
                                    <RefreshCw className="w-3 h-3" /> Regenerate
                                </button>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
