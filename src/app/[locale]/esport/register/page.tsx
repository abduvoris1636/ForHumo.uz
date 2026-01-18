"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useState } from "react";
import { Trophy, User, Users, Mail } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function RegisterPage() {
    const { data: session } = useSession();
    const t = useTranslations("Esport");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        // Mocking registration logic
        setTimeout(() => {
            setStatus("success");
        }, 1500);
    };

    if (status === "success") {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6"
                >
                    <Trophy size={40} />
                </motion.div>
                <h1 className="text-3xl font-bold mb-4">Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!</h1>
                <p className="text-muted-foreground mb-8">
                    Siz "Winter Tournament" turnirida ishtirok etish uchun muvaffaqiyatli ro'yxatdan o'tdingiz.
                </p>
                <Link
                    href="/esport"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-medium text-primary-foreground transition-all hover:bg-primary/90"
                >
                    eSport bo'limiga qaytish
                </Link>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div>
                    <h1 className="text-3xl font-bold">Winter Tournament — Ro'yxatdan o'tish</h1>
                    <p className="text-muted-foreground mt-2">
                        Mavsum: 2025–2026 | O'yin: MLBB
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-muted/50 border border-border flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <User size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Kapitan (Siz)</p>
                                <p className="font-medium">{session?.user?.name}</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/50 border border-border flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Mail size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Aloqa uchun email</p>
                                <p className="font-medium">{session?.user?.email}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">MLBB Nickname</label>
                            <input
                                required
                                type="text"
                                placeholder="O'yindagi ismingiz"
                                className="w-full h-14 bg-card border border-border rounded-2xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Jamoa Nomi</label>
                            <input
                                required
                                type="text"
                                placeholder="Jamoangiz nomini kiriting"
                                className="w-full h-14 bg-card border border-border rounded-2xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>
                    </div>

                    <button
                        disabled={status === "loading"}
                        type="submit"
                        className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {status === "loading" ? "Yuborilmoqda..." : "Ro'yxatdan o'tishni yakunlash"}
                    </button>

                    <p className="text-center text-xs text-muted-foreground px-4">
                        "Ro'yxatdan o'tish" tugmasini bosish orqali siz turnir qoidalariga rozilik bildirasiz.
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
