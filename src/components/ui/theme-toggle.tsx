"use client";

import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-9 h-9" />; // Placeholder
    }

    const cycleTheme = () => {
        if (theme === "light") setTheme("dark");
        else if (theme === "dark") setTheme("system");
        else setTheme("light");
    };

    return (
        <button
            onClick={cycleTheme}
            className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors relative"
            aria-label="Toggle Theme"
            title={`Current theme: ${theme}`}
        >
            {theme === "light" && <Sun size={20} />}
            {theme === "dark" && <Moon size={20} />}
            {theme === "system" && <Laptop size={20} />}
        </button>
    );
}
