"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, UserPlus, Copy, Check, Crown, ShieldAlert, X, QrCode } from "lucide-react";
import { useState, useEffect } from "react";
import { Player, Team } from "./types";

interface TeamSectionProps {
    player: Player | null;
    team: Team | null;
    onCreateTeam: (data: any) => void;
    onInvite: () => void;
}

export function TeamSection({ player, team, onCreateTeam, onInvite }: TeamSectionProps) {
    const t = useTranslations("Esport");
    const [isCreating, setIsCreating] = useState(false);
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [copied, setCopied] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [joinMethod, setJoinMethod] = useState<'none' | 'code' | 'apply'>('none');

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setInviteCode(null);
        }
    }, [timeLeft]);

    const generateInviteCode = () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setInviteCode(code);
        setTimeLeft(180); // 3 minutes
        onInvite();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!player) {
        return (
            <div className="bg-muted/30 border border-dashed border-border p-6 rounded-3xl text-center space-y-2 opacity-60">
                <ShieldAlert className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-sm font-medium">{t('team_title')} ochish uchun avval ID Card yarating</p>
            </div>
        );
    }

    if (!team && !isCreating && !isJoining) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border p-6 rounded-3xl shadow-xl space-y-4"
            >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Users size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold">{t('team_title')}</h3>
                    <p className="text-sm text-muted-foreground">Jamoa yarating yoki taklifni qabul qiling</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex-1 h-12 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Plus size={18} /> {t('create_team')}
                    </button>
                    <button
                        onClick={() => setIsJoining(true)}
                        className="flex-1 h-12 bg-muted font-bold rounded-2xl hover:bg-muted/80 transition-all active:scale-95"
                    >
                        {t('join_team')}
                    </button>
                </div>
            </motion.div>
        );
    }

    if (isCreating) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-border p-6 rounded-3xl shadow-xl space-y-4"
            >
                <h3 className="text-xl font-bold mb-4">{t('create_team')}</h3>
                <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    onCreateTeam(Object.fromEntries(formData));
                    setIsCreating(false);
                }}>
                    <input name="name" required placeholder={t('team_name')} className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    <input name="shortName" required maxLength={3} placeholder={t('team_short_name')} className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    <input name="logo" required placeholder="Logo URL (majburiy)" className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />

                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => setIsCreating(false)} className="flex-1 h-12 bg-muted font-bold rounded-xl hover:bg-muted/80 transition-all text-sm">
                            Bekor qilish
                        </button>
                        <button type="submit" className="flex-1 h-12 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-sm">
                            Yaratish
                        </button>
                    </div>
                </form>
            </motion.div>
        );
    }

    if (isJoining) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-border p-6 rounded-3xl shadow-xl space-y-4"
            >
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{t('join_team')}</h3>
                    <button onClick={() => { setIsJoining(false); setJoinMethod('none'); }} className="text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                {joinMethod === 'none' ? (
                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={() => setJoinMethod('code')}
                            className="w-full h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-4 px-6 hover:bg-primary/20 transition-all"
                        >
                            <QrCode className="text-primary" size={24} />
                            <div className="text-left">
                                <p className="font-bold text-sm">Kod orqali</p>
                                <p className="text-[10px] text-muted-foreground">Taklif kodini kiriting</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setJoinMethod('apply')}
                            className="w-full h-14 bg-muted border border-border rounded-2xl flex items-center gap-4 px-6 hover:bg-border transition-all"
                        >
                            <UserPlus className="text-muted-foreground" size={24} />
                            <div className="text-left">
                                <p className="font-bold text-sm">Ariza tashlash</p>
                                <p className="text-[10px] text-muted-foreground">Jamoa sardoriga so'rov yuborish</p>
                            </div>
                        </button>
                    </div>
                ) : joinMethod === 'code' ? (
                    <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        // Handle joining by code
                        setIsJoining(false);
                        setJoinMethod('none');
                    }}>
                        <input name="code" required placeholder="6 xonali kod" className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 text-center font-mono text-xl tracking-widest focus:ring-primary/50" />
                        <button type="submit" className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all">
                            Qo'shilish
                        </button>
                        <button type="button" onClick={() => setJoinMethod('none')} className="w-full text-xs text-muted-foreground hover:underline">Orqaga</button>
                    </form>
                ) : (
                    <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        // Handle joining by application
                        setIsJoining(false);
                        setJoinMethod('none');
                    }}>
                        <input name="teamId" required placeholder="Jamoa nomi yoki ID" className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 text-sm" />
                        <textarea placeholder="Nega bu jamoaga qo'shilmoqchisiz?" className="w-full h-24 bg-muted/50 border border-border rounded-xl p-4 text-sm resize-none focus:ring-primary/50" />
                        <button type="submit" className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all">
                            Ariza yuborish
                        </button>
                        <button type="button" onClick={() => setJoinMethod('none')} className="w-full text-xs text-muted-foreground hover:underline">Orqaga</button>
                    </form>
                )}
            </motion.div>
        );
    }

    const isOwner = team?.ownerId === player.id;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border p-6 rounded-3xl shadow-xl space-y-6"
        >
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-2xl font-black text-muted-foreground border border-border overflow-hidden">
                    {team?.logo ? <img src={team.logo} alt={team.name} className="w-full h-full object-cover" /> : team?.shortName}
                </div>
                <div>
                    <h3 className="text-xl font-bold">{team?.name}</h3>
                    <div className="flex items-center gap-2 text-primary font-bold text-xs">
                        <Crown size={12} /> JAMOASI
                    </div>
                </div>
            </div>

            {isOwner && (
                <div className="pt-4 border-t border-border space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">{t('invite_player')}</h4>
                        {inviteCode && (
                            <span className="text-[10px] font-mono font-bold text-primary animate-pulse">
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </span>
                        )}
                    </div>

                    {!inviteCode ? (
                        <button
                            onClick={generateInviteCode}
                            className="w-full h-12 bg-primary/10 text-primary border border-primary/20 font-bold rounded-xl hover:bg-primary/20 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <UserPlus size={18} /> {t('invite_code')} olish
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <div className="flex-1 h-12 bg-muted rounded-xl flex items-center justify-center font-mono text-xl font-black tracking-[0.2em] border border-border relative overflow-hidden group">
                                {inviteCode}
                                <div className="absolute inset-0 bg-primary/10 -translate-x-full group-hover:translate-x-0 transition-transform pointer-events-none" />
                            </div>
                            <button
                                onClick={() => copyToClipboard(inviteCode)}
                                className="w-12 h-12 bg-muted border border-border flex items-center justify-center rounded-xl hover:bg-border transition-all"
                            >
                                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                        </div>
                    )}
                    <p className="text-[10px] text-muted-foreground italic text-center">
                        {t('invite_code_expiry')}
                    </p>
                </div>
            )}

            <div className="pt-4 border-t border-border">
                <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3">Jamoa a'zolari ({team?.members.length})</h4>
                <div className="space-y-2">
                    {team?.members.slice(0, 3).map((id) => (
                        <div key={id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-all text-sm">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                {id.substring(0, 2)}
                            </div>
                            <div className="flex-1 font-medium truncate">Foydalanuvchi {id.substring(0, 4)}</div>
                            {team.captainId === id && <Crown size={12} className="text-yellow-500" />}
                        </div>
                    ))}
                    {team?.members.length && team.members.length > 3 && (
                        <p className="text-xs text-center text-muted-foreground pt-1">+ yan {team.members.length - 3} kishi</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
