'use client';

import { Role } from '@/lib/esport-types';
import { getRoleColor } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { Shield, ShieldAlert, Bot } from 'lucide-react';

interface RoleSwitcherProps {
    currentRole: Role;
    onRoleChange: (role: Role) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
    const roles: Role[] = ['ORGANIZER', 'MODERATOR', 'SYSTEM_AI'];

    return (
        <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-lg border border-white/10">
            {roles.map((role) => (
                <button
                    key={role}
                    onClick={() => onRoleChange(role)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                        currentRole === role
                            ? getRoleColor(role).replace('text-', 'bg-').replace('/10', '/20') + " text-white border-transparent"
                            : "text-neutral-500 hover:text-white"
                    )}
                >
                    {role === 'ORGANIZER' && <Shield className="w-3 h-3" />}
                    {role === 'MODERATOR' && <ShieldAlert className="w-3 h-3" />}
                    {role === 'SYSTEM_AI' && <Bot className="w-3 h-3" />}
                    {role.replace('_', ' ')}
                </button>
            ))}
        </div>
    );
}
