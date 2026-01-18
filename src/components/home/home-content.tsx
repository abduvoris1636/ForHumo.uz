"use client";

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
    Users
} from "lucide-react";
import { ProjectCard } from "@/components/ui/project-card";

interface HomeContentProps {
    tHeroPrefix: string;
    tHeroSuffix: string;
    tHeroDescription: string;
    tHeroExplore: string;
    tProjectsTitle: string;
    projects: {
        title: string;
        description: string;
        href: string;
        iconName: string;
        status: "active" | "coming-soon";
    }[];
}

const iconMap = {
    Gamepad2, Brain, Tv, BookOpen, Music, Home, GraduationCap, Mic, Users
};

export function HomeContent({
    tHeroPrefix,
    tHeroSuffix,
    tHeroDescription,
    tHeroExplore,
    tProjectsTitle,
    projects
}: HomeContentProps) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

                <div className="container px-4 text-center z-10">
                    <div className="relative mx-auto h-32 w-32 mb-8 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] rounded-full">
                        <Image
                            src="/logo.png"
                            alt="For Humo Logo"
                            fill
                            className="object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            priority
                        />
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground mb-6">
                        {tHeroPrefix} <span className="text-primary">{tHeroSuffix}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                        {tHeroDescription}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#ecosystem"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-medium text-primary-foreground transition-colors hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                        >
                            {tHeroExplore}
                        </a>
                    </div>
                </div>
            </section>

            {/* Ecosystem Grid */}
            <section id="ecosystem" className="py-20 bg-muted/50">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{tProjectsTitle}</h2>
                        <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => {
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
