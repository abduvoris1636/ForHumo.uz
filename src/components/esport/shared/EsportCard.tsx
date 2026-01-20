import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface EsportCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    hoverEffect?: boolean;
}

export function EsportCard({ children, className, onClick, hoverEffect = true }: EsportCardProps) {
    return (
        <motion.div
            whileHover={hoverEffect ? { y: -5, boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)' } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={onClick}
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/5 bg-neutral-900/50 backdrop-blur-md p-6",
                "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100",
                onClick && "cursor-pointer",
                className
            )}
        >
            {children}
        </motion.div>
    );
}
