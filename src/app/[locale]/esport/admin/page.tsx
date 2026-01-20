'use client';

import { useState } from 'react';
import { Role, AuditLogEntry, Action } from '@/lib/esport-types';
import { hasPermission } from '@/lib/permissions';
import { validateMatchUpdate } from '@/lib/ai-moderator';
import { RoleSwitcher } from '@/components/esport/admin/RoleSwitcher';
import { AuditLogViewer } from '@/components/esport/admin/AuditLogViewer';
import { SectionHeader } from '@/components/esport/shared/SectionHeader';
import { EsportCard } from '@/components/esport/shared/EsportCard';
import { AnimatedButton } from '@/components/esport/shared/AnimatedButton';
import { Lock, Save, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

export default function AdminDashboardPage() {
    const [currentRole, setCurrentRole] = useState<Role>('ORGANIZER');
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
        {
            id: '1',
            actor: 'System AI',
            role: 'SYSTEM_AI',
            action: 'VALIDATE_DATA',
            target: 'Match #120',
            timestamp: new Date().toISOString(),
            status: 'SUCCESS',
            details: 'Routine integrity check passed'
        }
    ]);

    // Simulated Match State
    const [matchScoreA, setMatchScoreA] = useState(0);
    const [matchScoreB, setMatchScoreB] = useState(0);
    const [validationMessage, setValidationMessage] = useState<string | null>(null);

    const addLog = (action: Action, status: 'SUCCESS' | 'FAILED' | 'FLAGGED', details?: string) => {
        const newLog: AuditLogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            actor: currentRole === 'SYSTEM_AI' ? 'System AI' : 'Current User',
            role: currentRole,
            action,
            target: 'Match #Demo',
            timestamp: new Date().toISOString(),
            status,
            details
        };
        setAuditLogs(prev => [newLog, ...prev]);
    };

    const handleUpdateScore = () => {
        // 1. Permission Check
        if (!hasPermission(currentRole, 'EDIT_MATCH')) {
            addLog('EDIT_MATCH', 'FAILED', 'Permission Denied');
            alert('Access Denied: You do not have permission to edit matches.');
            return;
        }

        // 2. AI Validation (Triggered internally even if human edits)
        const validation = validateMatchUpdate({ scoreA: matchScoreA, scoreB: matchScoreB });

        if (!validation.isValid) {
            setValidationMessage(validation.flags.join(', '));
            addLog('VALIDATE_DATA', 'FLAGGED', `AI Flagged: ${validation.flags.join(', ')}`);

            // If user is AI, stop. If human, warn but maybe allow? For this demo, we deny on flag.
            return;
        }

        setValidationMessage(null);
        addLog('EDIT_MATCH', 'SUCCESS', `Score updated to ${matchScoreA}-${matchScoreB}`);
    };

    const handleFinalize = () => {
        if (!hasPermission(currentRole, 'FINALIZE_TOURNAMENT')) {
            addLog('FINALIZE_TOURNAMENT', 'FAILED', 'Permission Denied');
            alert('Access Denied: Only Organizers can finalize tournaments.');
            return;
        }
        addLog('FINALIZE_TOURNAMENT', 'SUCCESS', 'Tournament Autumn 2025 Finalized');
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-20">
            <div className="container mx-auto max-w-6xl">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                    <SectionHeader title="Admin & Moderation" subtitle="Role-based access control dashboard" className="mb-0" />
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Simulate Role</span>
                        <RoleSwitcher currentRole={currentRole} onRoleChange={setCurrentRole} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Actions */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Match Editor (Moderator+) */}
                        <EsportCard>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Match Editor</h3>
                                {hasPermission(currentRole, 'EDIT_MATCH') ? (
                                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded font-bold uppercase">Write Access</span>
                                ) : (
                                    <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded font-bold uppercase flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Read Only
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-6">
                                <div className="text-center">
                                    <h4 className="font-bold mb-2 text-blue-400">Team A</h4>
                                    <input
                                        type="number"
                                        value={matchScoreA}
                                        onChange={(e) => setMatchScoreA(parseInt(e.target.value))}
                                        className="w-20 text-center bg-neutral-800 border-white/10 rounded p-2 text-2xl font-bold"
                                        disabled={!hasPermission(currentRole, 'EDIT_MATCH')}
                                    />
                                </div>
                                <div className="text-center">
                                    <h4 className="font-bold mb-2 text-red-400">Team B</h4>
                                    <input
                                        type="number"
                                        value={matchScoreB}
                                        onChange={(e) => setMatchScoreB(parseInt(e.target.value))}
                                        className="w-20 text-center bg-neutral-800 border-white/10 rounded p-2 text-2xl font-bold"
                                        disabled={!hasPermission(currentRole, 'EDIT_MATCH')}
                                    />
                                </div>
                            </div>

                            {validationMessage && (
                                <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-3 text-yellow-200 text-sm">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                    {validationMessage}
                                </div>
                            )}

                            <div className="flex justify-center">
                                <AnimatedButton
                                    onClick={handleUpdateScore}
                                    disabled={!hasPermission(currentRole, 'EDIT_MATCH')}
                                >
                                    <Save className="w-4 h-4" /> Save Result
                                </AnimatedButton>
                            </div>
                        </EsportCard>

                        {/* Tournament Actions (Organizer Only) */}
                        <EsportCard className={!hasPermission(currentRole, 'FINALIZE_TOURNAMENT') ? "opacity-50" : ""}>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5" /> Sensitive Actions
                            </h3>
                            <p className="text-neutral-400 text-sm mb-6">
                                These actions are restricted to Organizers only.
                            </p>
                            <div className="flex gap-4">
                                <AnimatedButton
                                    variant="secondary"
                                    onClick={handleFinalize}
                                    disabled={!hasPermission(currentRole, 'FINALIZE_TOURNAMENT')}
                                >
                                    Finalize Tournament
                                </AnimatedButton>
                                <AnimatedButton
                                    variant="outline"
                                    disabled={!hasPermission(currentRole, 'MARK_PAID')}
                                    onClick={() => addLog('MARK_PAID', hasPermission(currentRole, 'MARK_PAID') ? 'SUCCESS' : 'FAILED')}
                                >
                                    Mark Prizes Paid
                                </AnimatedButton>
                            </div>
                        </EsportCard>
                    </div>

                    {/* Right Column: Audit Log */}
                    <div>
                        <EsportCard className="h-full">
                            <AuditLogViewer logs={auditLogs} />
                        </EsportCard>
                    </div>
                </div>

            </div>
        </div>
    );
}
