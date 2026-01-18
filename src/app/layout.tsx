import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/app/providers";
import { BackgroundEffects } from "@/components/background-effects";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "For Humo",
    description: "A unified ecosystem of digital platforms including eSPort, AI, TV, and more.",
    icons: {
        icon: "/logo.png",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
