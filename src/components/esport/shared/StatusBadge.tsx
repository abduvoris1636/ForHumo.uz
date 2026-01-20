import { cn } from '@/lib/utils';

type Status = 'LIVE' | 'UPCOMING' | 'FINISHED' | 'SCHEDULED';

interface StatusBadgeProps {
    status: Status;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const getColors = (s: Status) => {
        switch (s) {
            case 'LIVE':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'UPCOMING':
            case 'SCHEDULED':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'FINISHED':
                return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
            default:
                return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
        }
    };

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border uppercase tracking-wider",
            getColors(status),
            className
        )}>
            {status === 'LIVE' && (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
            )}
            {status}
        </div>
    );
}
