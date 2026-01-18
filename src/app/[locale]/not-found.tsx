"use client";

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function NotFound() {
    const t = useTranslations("Common");

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
            <h2 className="text-4xl font-bold mb-4">404</h2>
            <p className="mb-6 text-muted-foreground">{t("under_dev")}</p>
            <Link href="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                {t("back_home")}
            </Link>
        </div>
    );
}
