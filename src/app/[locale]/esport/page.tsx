import { EsportContent } from "@/components/esport/esport-content";
import { setRequestLocale } from 'next-intl/server';

export default async function EsportPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <EsportContent />;
}
