import { motion } from 'framer-motion';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    className?: string;
    children?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, className = '', children }: SectionHeaderProps) {
    return (
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 ${className}`}>
            <div>
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400"
                >
                    {title}
                </motion.h2>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-neutral-400 mt-2 text-sm md:text-base"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
            {children && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                >
                    {children}
                </motion.div>
            )}
        </div>
    );
}
