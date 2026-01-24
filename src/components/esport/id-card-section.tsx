"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { User, Send, CheckCircle2, QrCode, Edit2, X } from "lucide-react";
import { useState } from "react";
import { Player } from "./types";

interface IdCardSectionProps {
    player: Player | null;
    onRegister: (data: any) => void;
    onUpdate: (player: Player) => void;
}

export function IdCardSection({ player, onRegister, onUpdate }: IdCardSectionProps) {
    const t = useTranslations("Esport");
    const [isRegistering, setIsRegistering] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    if (!player && !isRegistering) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border p-6 rounded-3xl shadow-xl space-y-4"
            >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <User size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold">{t('id_card_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('id_card_desc')}</p>
                </div>
                <button
                    onClick={() => setIsRegistering(true)}
                    className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all active:scale-95"
                >
                    {t('register')}
                </button>
            </motion.div>
        );
    }

    if (isRegistering || isEditing) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-border p-6 rounded-3xl shadow-xl space-y-4"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{isEditing ? t('edit') : t('register')}</h3>
                    <button onClick={() => { setIsRegistering(false); setIsEditing(false); }} className="text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>
                <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const data = Object.fromEntries(formData);
                    if (isEditing && player) {
                        onUpdate({ ...player, ...data } as Player);
                        setIsEditing(false);
                    } else {
                        onRegister(data);
                        setIsRegistering(false);
                    }
                }}>
                    <input name="name" required defaultValue={player?.name} placeholder={t('name')} className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    <input name="surname" required defaultValue={player?.surname} placeholder={t('surname')} className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    <input name="telegram" required defaultValue={player?.telegram} placeholder={t('telegram')} className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    <input name="mlbbNickname" required defaultValue={player?.mlbbNickname} placeholder={t('mlbb_nickname')} className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    <input name="mlbbId" required defaultValue={player?.mlbbId} placeholder={t('mlbb_id')} className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    <input name="avatar" defaultValue={player?.avatar} placeholder={`Avatar URL (${t('optional')})`} className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />

                    <div className="flex gap-2 pt-2">
                        <button type="submit" className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-sm">
                            {t('save')}
                        </button>
                    </div>
                </form>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden bg-gradient-to-br from-primary/20 via-card to-card border-primary/30 border-2 p-6 rounded-3xl shadow-2xl"
        >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setIsEditing(true)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md border border-white/20">
                    <Edit2 size={14} className="text-foreground" />
                </button>
            </div>

            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <QrCode size={100} />
            </div>

            <div className="relative space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden border border-primary/20 flex items-center justify-center text-primary text-2xl font-black italic">
                        {player?.avatar ? (
                            <img src={player.avatar} alt={player.mlbbNickname} className="w-full h-full object-cover" />
                        ) : (
                            player?.name[0]
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold">{player?.name} {player?.surname}</h3>
                            <CheckCircle2 size={16} className="text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">ID: {player?.id}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">{t('mlbb_nickname')}</p>
                        <p className="font-bold text-primary italic uppercase">{player?.mlbbNickname}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">{t('mlbb_id')}</p>
                        <p className="font-bold">{player?.mlbbId}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-primary font-bold">
                    <Send size={14} />
                    <span className="text-xs">@{player?.telegram}</span>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </motion.div>
    );
}
