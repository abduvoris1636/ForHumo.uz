"use client";

import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";

export function AuthBarrier({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const t = useTranslations("Hero"); // Using Hero translations for branding

    if (status === "loading") {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background z-[100]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-4 overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 blur-[120px] rounded-full animate-pulse delay-1000" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-8"
                >
                    <div className="space-y-4">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                For Humo
                            </h1>
                            <p className="text-xl text-muted-foreground mt-2">
                                yagona raqamli ekotizim
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-card/50 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-2xl"
                    >
                        <button
                            onClick={() => signIn("google")}
                            className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-white/90 font-semibold h-14 rounded-2xl transition-all shadow-lg hover:shadow-white/10 active:scale-95 overflow-hidden relative group"
                        >
                            <img
                                src="https://authjs.dev/img/providers/google.svg"
                                alt="Google"
                                className="w-6 h-6"
                            />
                            <span>Continue with Google</span>
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}
