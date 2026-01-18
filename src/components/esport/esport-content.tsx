"use client";

import { Link } from "@/i18n/routing";
import { Gamepad2, Trophy, Play, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function EsportContent() {
    const t = useTranslations("Esport");

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 dark:opacity-20 opacity-5" />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background/80 to-background" />

                <div className="container relative z-10 px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="inline-flex items-center justify-center p-4 mb-6 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
                    >
                        <Gamepad2 className="w-8 h-8 text-primary mr-3" />
                        <span className="text-2xl font-bold text-foreground">{t("hero_tag")}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight"
                    >
                        {t("hero_title")}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
                    >
                        {t("hero_desc")}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link
                            href="https://t.me/Humo_eSportBot"
                            target="_blank"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
                        >
                            <Trophy className="w-5 h-5" />
                            {t("register")}
                        </Link>
                        <Link
                            href="https://www.youtube.com/@ForHumo_eSport"
                            target="_blank"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-8 py-4 text-lg font-bold text-destructive-foreground transition-all hover:bg-destructive/90 hover:scale-105 active:scale-95 shadow-lg shadow-destructive/25"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            {t("watch")}
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features/Games Section */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group overflow-hidden rounded-2xl border border-border bg-card aspect-video md:aspect-[4/3] lg:aspect-video"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 group-hover:scale-105 transition-transform duration-700" />

                        <div className="absolute bottom-0 left-0 p-8 z-20">
                            <h3 className="text-3xl font-bold text-white mb-2">Mobile Legends: BB</h3>
                            <p className="text-gray-200 mb-4">{t("mlbb_desc")}</p>
                            <Link href="https://t.me/Humo_eSportBot" target="_blank" className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-2">
                                {t("mlbb_action")} <ExternalLink size={16} />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group overflow-hidden rounded-2xl border border-border bg-card aspect-video md:aspect-[4/3] lg:aspect-video"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-900 to-yellow-900 group-hover:scale-105 transition-transform duration-700" />

                        <div className="absolute bottom-0 left-0 p-8 z-20">
                            <h3 className="text-3xl font-bold text-white mb-2">PUBG Mobile</h3>
                            <p className="text-gray-200 mb-4">{t("pubg_desc")}</p>
                            <Link href="https://t.me/Humo_eSportBot" target="_blank" className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-2">
                                {t("pubg_action")} <ExternalLink size={16} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
