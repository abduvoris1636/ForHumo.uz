import { HomeContent } from "@/components/home/home-content";
import { EsportContent } from "@/components/esport/esport-content";

export default function RootPage() {
    const projectsData = [
        {
            title: "Humo eSport",
            description: "MLBB va PUBG turnirlarini ochiq ro'yxatdan o'tish bilan tashkil etuvchi kiber sport platformasi.",
            href: "#esport",
            iconName: "Gamepad2",
            status: "active" as const,
        },
        {
            title: "Humo AI",
            description: "Ilg'or sun'iy intellekt yechimlari va vositalari.",
            href: "#ai",
            iconName: "Brain",
            status: "coming-soon" as const,
        },
        {
            title: "Humo TV",
            description: "Ko'ngilochar va ta'limiy kontent uchun striming xizmati.",
            href: "#tv",
            iconName: "Tv",
            status: "coming-soon" as const,
        },
        {
            title: "Humo Book",
            description: "Zamonaviy kitobxonlar uchun raqamli kutubxona va nashriyot platformasi.",
            href: "#book",
            iconName: "BookOpen",
            status: "coming-soon" as const,
        },
        {
            title: "Humo Music",
            description: "Musiqa tinglash va yangi ijodkorlarni kashf etish platformasi.",
            href: "#music",
            iconName: "Music",
            status: "coming-soon" as const,
        },
        {
            title: "Humo Home",
            description: "Aqlli uy integratsiyasi va turmush tarzi yechimlari.",
            href: "#home",
            iconName: "Home",
            status: "coming-soon" as const,
        },
        {
            title: "Humo EDU",
            description: "Ta'lim texnologiyalari va onlayn o'qitish platformasi.",
            href: "#edu",
            iconName: "GraduationCap",
            status: "coming-soon" as const,
        },
        {
            title: "Humo Studio",
            description: "Raqamli san'at va media ishlab chiqarish uchun ijodiy studiya.",
            href: "#studio",
            iconName: "Mic",
            status: "coming-soon" as const,
        },
        {
            title: "Humo Social",
            description: "Jamiyat bilan bog'lanish uchun ijtimoiy tarmoq platformasi.",
            href: "#social",
            iconName: "Users",
            status: "coming-soon" as const,
        },
    ];

    const esportData = {
        hero_tag: "Humo eSport",
        hero_title: "O'yiningizni keyingi bosqichga olib chiqing",
        hero_desc: "Eng zo'r kibersport platformasiga qo'shiling. Katta mukofot jamg'armasiga ega haftalik MLBB va PUBG turnirlari.",
        register: "Ro'yxatdan o'tish",
        watch: "Jonli efir",
        mlbb_desc: "5x5 MOBA jangi. Haftalik turnirlar.",
        mlbb_action: "Turnirga qo'shilish",
        pubg_desc: "Battle Royale. Jamoa tuzing va g'alaba qozoning.",
        pubg_action: "Xonaga kirish",
    };

    return (
        <>
            <HomeContent
                tHeroPrefix="For Humo"
                tHeroSuffix=""
                tHeroDescription="Rivojlanish, o'yin-kulgi va ta'lim uchun yagona raqamli ekotizim. Kiber sportdan sun'iy intellektgacha."
                tHeroExplore="Ekotizimni Keshf Etish"
                tProjectsTitle="Bizning Loyihalar"
                projects={projectsData}
            />
            <div id="esport">
                <EsportContent t={esportData} />
            </div>
        </>
    );
}
