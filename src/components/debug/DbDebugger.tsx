'use client';

import { useState, useEffect } from 'react';
import { debugDatabase } from '@/app/actions/debug-db';

export function DbDebugger() {
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/debug')
            .then(res => res.json())
            .then(data => {
                setLogs(data.logs || ["No logs returned"]);
            })
            .catch(err => {
                setLogs(["CLIENT FETCH ERROR", err.message]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-xs text-yellow-500">Running Diagnostics...</div>;

    return (
        <div className="p-4 my-4 bg-black border border-yellow-500/50 rounded text-xs font-mono text-yellow-500 overflow-auto max-h-60">
            <h4 className="font-bold border-b border-yellow-500/30 mb-2">SYSTEM DIAGNOSTICS (Send Screenshot if red)</h4>
            {logs.map((log, i) => (
                <div key={i} className="mb-1 border-b border-white/5 pb-1">
                    {log}
                </div>
            ))}
        </div>
    );
}
