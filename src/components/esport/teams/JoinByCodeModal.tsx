'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { KeyRound, ArrowRight, Loader2 } from 'lucide-react';

interface JoinByCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoin: (code: string) => Promise<void>; // Async for simulated delay/validation
}

export function JoinByCodeModal({ isOpen, onClose, onJoin }: JoinByCodeModalProps) {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (code.length < 8) {
            setError('Code must be 8 characters');
            return;
        }

        setIsLoading(true);
        try {
            await onJoin(code);
            onClose();
            setCode('');
        } catch (err: any) {
            setError(err.message || 'Invalid or expired code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm bg-zinc-900 border border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-blue-400" />
                        Enter Invite Code
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="py-4 space-y-6">
                    <div className="space-y-4">
                        <input
                            autoFocus
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value.toUpperCase().slice(0, 8));
                                setError('');
                            }}
                            placeholder="A1B2C3D4"
                            className={`w-full bg-black/50 border rounded-lg p-4 text-center text-3xl font-mono tracking-[0.5em] outline-none transition-all placeholder:tracking-normal placeholder:text-zinc-700
                                ${error ? 'border-red-500 text-red-400' : 'border-zinc-700 focus:border-blue-500 text-white'}
                            `}
                        />
                        {error && <p className="text-xs text-red-500 text-center font-bold">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || code.length < 8}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join Team'}
                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>

                    <p className="text-[10px] text-zinc-500 text-center">
                        Ask your team captain for the 5-character invite code.
                    </p>
                </form>
            </DialogContent>
        </Dialog>
    );
}
