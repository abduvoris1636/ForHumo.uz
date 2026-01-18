"use client";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ProjectCardProps {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    status: "active" | "coming-soon";
    className?: string;
}

export function ProjectCard({ title, description, href, icon: Icon, status, className }: ProjectCardProps) {
    const t = useTranslations("Status");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.5 }}
            className="h-full"
        >
            <Link href={href} className={cn("block group relative h-full", className)}>
                <div
                    className="flex flex-col h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="rounded-lg bg-primary/10 p-3 text-primary group-hover:text-primary/80 transition-colors">
                            <Icon size={24} />
                        </div>
                        {status === "active" ? (
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                                {t("active")}
                            </span>
                        ) : (
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                                {t("coming_soon")}
                            </span>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-grow">
                        {description}
                    </p>

                    <div className="mt-auto flex items-center justify-between text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                        <span className="text-sm font-medium">Batafsil</span>
                        <span>→</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
