"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { User, Send, CheckCircle2, QrCode } from "lucide-react";
import { useState } from "react";
import { Player } from "./types";

export function IdCardSection({ player, onRegister }: { player: Player | null, onRegister: (data: any) => void }) {
    const t = useTranslations("Esport");
    const [isRegistering, setIsRegistering] = useState(false);

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

    if (isRegistering) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border border-border p-6 rounded-3xl shadow-xl space-y-4"
            >
                <h3 className="text-xl font-bold mb-4">{t('register')}</h3>
                <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    onRegister(Object.fromEntries(formData));
                    setIsRegistering(false);
                }}>
                    <input name="name" required placeholder={t('name')} className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    <input name="surname" required placeholder={t('surname')} className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    <input name="telegram" required placeholder={t('telegram')} className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    <input name="mlbbNickname" required placeholder={t('mlbb_nickname')} className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                    <input name="mlbbId" required placeholder={t('mlbb_id')} className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />

                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => setIsRegistering(false)} className="flex-1 h-12 bg-muted font-bold rounded-xl hover:bg-muted/80 transition-all text-sm">
                            Bekor qilish
                        </button>
                        <button type="submit" className="flex-1 h-12 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-sm">
                            Tasdiqlash
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
            className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-card to-card border-primary/30 border-2 p-6 rounded-3xl shadow-2xl"
        >
            {/* ID Card Design */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <QrCode size={80} />
            </div>

            <div className="relative space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/40 text-2xl font-bold">
                        {player?.name[0]}{player?.surname[0]}
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
                        <p className="text-[10px] uppercase text-muted-foreground font-bold">{t('mlbb_nickname')}</p>
                        <p className="font-semibold">{player?.mlbbNickname}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-bold">{t('mlbb_id')}</p>
                        <p className="font-semibold">{player?.mlbbId}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-primary">
                    <Send size={14} />
                    <span className="text-xs font-medium">@{player?.telegram}</span>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 left-0 h-1.5 bg-primary" />
        </motion.div>
    );
}
