"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
    Gamepad2,
    Brain,
    Tv,
    BookOpen,
    Music,
    Home,
    GraduationCap,
    Mic,
    Users,
    Newspaper,
    Building2
} from "lucide-react";
import { ProjectCard } from "@/components/ui/project-card";

const iconMap = {
    Gamepad2, Brain, Tv, BookOpen, Music, Home, GraduationCap, Mic, Users, Newspaper, Building2
};

export function HomeContent() {
    const tHero = useTranslations("Hero");
    const tProjects = useTranslations("Projects");

    const projectsData = [
        {
            title: "Humo eSport",
            description: tProjects("esport_desc"),
            href: "/esport",
            iconName: "Gamepad2",
            status: "active" as const,
        },
        {
            title: "Humo AI",
            description: tProjects("ai_desc"),
            href: "/coming-soon",
            iconName: "Brain",
            status: "coming-soon" as const,
        },
        {
            title: "Humo TV",
            description: tProjects("tv_desc"),
            href: "/coming-soon",
            iconName: "Tv",
            status: "coming-soon" as const,
        },
        {
            title: "Humo Book",
            description: tProjects("book_desc"),
            href: "/coming-soon",
            iconName: "BookOpen",
            status: "coming-soon" as const,
        },
        {
            title: "Humo Music",
            description: tProjects("music_desc"),
            href: "/coming-soon",
            iconName: "Music",
            status: "coming-soon" as const,
        },
        {
            title: "Humo Home",
            description: tProjects("home_desc"),
            href: "/coming-soon",
            iconName: "Home",
            status: "coming-soon" as const,
        },
        {
            title: "Humo EDU",
            description: tProjects("edu_desc"),
            href: "/coming-soon",
            iconName: "GraduationCap",
            status: "coming-soon" as const,
        },
        {
            title: "Humo Studio",
            description: tProjects("studio_desc"),
            href: "/coming-soon",
            iconName: "Mic",
            status: "coming-soon" as const,
        },
        {
            title: "Humo Social",
            description: tProjects("social_desc"),
            href: "/coming-soon",
            iconName: "Users",
            status: "coming-soon" as const,
        },
        {
            title: "Humo News",
            description: tProjects("news_desc"),
            href: "/coming-soon",
            iconName: "Newspaper",
            status: "coming-soon" as const,
        },
        {
            title: "Humo Bank",
            description: tProjects("bank_desc"),
            href: "/coming-soon",
            iconName: "Building2",
            status: "coming-soon" as const,
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

                <div className="container px-4 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="relative mx-auto h-32 w-32 mb-8 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] rounded-full"
                    >
                        <Image
                            src="/logo.png"
                            alt="For Humo Logo"
                            fill
                            className="object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            priority
                        />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground mb-6"
                    >
                        {tHero("title_prefix")} <span className="text-primary">{tHero("title_suffix")}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
                    >
                        {tHero("description")}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <a
                            href="#ecosystem"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-medium text-primary-foreground transition-colors hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                        >
                            {tHero("explore")}
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Ecosystem Grid */}
            <section id="ecosystem" className="py-20 bg-muted/50">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                        >
                            {tProjects("title")}
                        </motion.h2>
                        <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projectsData.map((project, index) => {
                            const IconComponent = iconMap[project.iconName as keyof typeof iconMap] || Gamepad2;
                            return (
                                <ProjectCard
                                    key={project.title}
                                    {...project}
                                    icon={IconComponent}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
