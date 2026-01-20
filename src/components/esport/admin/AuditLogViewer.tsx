import { AuditLogEntry } from '@/lib/esport-types';
import { getRoleColor } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface AuditLogViewerProps {
    logs: AuditLogEntry[];
}

export function AuditLogViewer({ logs }: AuditLogViewerProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">System Audit Log</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {logs.length === 0 && (
                    <div className="text-neutral-500 text-sm italic">No recent activity</div>
                )}

                {logs.map((log) => (
                    <div key={log.id} className="flex gap-4 p-3 rounded-lg bg-white/5 border border-white/5 text-sm">
                        <div className={cn(
                            "p-2 rounded-lg h-fit",
                            getRoleColor(log.role)
                        )}>
                            {log.role === 'SYSTEM_AI' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-white">{log.actor}</span>
                                <span className="text-xs text-neutral-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                                <span className={cn(
                                    "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                                    log.status === 'SUCCESS' ? "bg-green-500/10 text-green-500" :
                                        log.status === 'FLAGGED' ? "bg-yellow-500/10 text-yellow-500" :
                                            "bg-red-500/10 text-red-500"
                                )}>
                                    {log.action}
                                </span>
                                <span className="text-neutral-400">on {log.target}</span>
                            </div>

                            {log.details && (
                                <p className="text-xs text-neutral-500 mt-1 pl-2 border-l-2 border-white/10">
                                    {log.details}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
