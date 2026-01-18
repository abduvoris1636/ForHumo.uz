import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

interface ComingSoonCardProps {
    title: string;
    description?: string;
}

export function ComingSoonCard({ title, description }: ComingSoonCardProps) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
            <div className="mb-6 rounded-full bg-primary/10 p-6 ring-1 ring-border">
                <Construction className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl mb-2">{title}</h1>
            <p className="text-xl text-primary font-medium mb-4">Tez kunda</p>
            <p className="max-w-md text-muted-foreground mb-8">
                {description || "Ushbu bo'lim hozirda ishlab chiqilmoqda. Yangiliklarni kuzatib boring!"}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-card px-6 py-3 text-sm font-medium text-card-foreground ring-1 ring-border transition-colors hover:bg-muted"
                >
                    <ArrowLeft size={16} />
                    Bosh Sahifaga Qaytish
                </Link>
                <Link
                    href="https://t.me/ForHumo"
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    Yangiliklarni Kuzatish
                </Link>
            </div>
        </div>
    );
}
