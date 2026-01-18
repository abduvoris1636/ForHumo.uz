"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: "Bosh Sahifa", href: "/" },
        { name: "Ekotizim", href: "#ecosystem" },
        { name: "eSport", href: "#esport" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                            <Image
                                src="/logo.png"
                                alt="For Humo Logo"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors hidden sm:block">
                            For Humo
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
                    <nav className="flex flex-col p-4 gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-base font-medium text-foreground transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
