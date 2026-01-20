import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
    children: ReactNode;
    icon?: ReactNode;
}

export function AnimatedButton({
    variant = 'primary',
    isLoading,
    children,
    className,
    icon,
    ...props
}: AnimatedButtonProps) {
    const variants = {
        primary: "bg-white text-black hover:bg-neutral-200 border-transparent",
        secondary: "bg-neutral-800 text-white hover:bg-neutral-700 border-transparent",
        outline: "bg-transparent text-white border-white/20 hover:bg-white/5",
        ghost: "bg-transparent text-white hover:bg-white/5 border-transparent"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-colors border",
                variants[variant],
                isLoading && "opacity-70 cursor-not-allowed",
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : icon ? (
                <span className="w-4 h-4">{icon}</span>
            ) : null}
            {children}
        </motion.button>
    );
}
