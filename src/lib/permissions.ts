import { Role, Action } from './esport-types';

const PERMISSIONS: Record<Role, Action[]> = {
    ORGANIZER: [
        'FINALIZE_TOURNAMENT',
        'MARK_PAID',
        'TRANSFER_TEAM',
        'CREATE_MATCH',
        'EDIT_MATCH',
        'FLAG_INCIDENT',
        'VALIDATE_DATA'
    ],
    MODERATOR: [
        'CREATE_MATCH',
        'EDIT_MATCH',
        'FLAG_INCIDENT',
        'VALIDATE_DATA'
    ],
    SYSTEM_AI: [
        'VALIDATE_DATA',
        'FLAG_INCIDENT'
    ]
};

export function hasPermission(role: Role, action: Action): boolean {
    const allowedActions = PERMISSIONS[role];
    return allowedActions ? allowedActions.includes(action) : false;
}

export function getRoleColor(role: Role): string {
    switch (role) {
        case 'ORGANIZER': return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10';
        case 'MODERATOR': return 'text-blue-500 border-blue-500/20 bg-blue-500/10';
        case 'SYSTEM_AI': return 'text-purple-500 border-purple-500/20 bg-purple-500/10';
        default: return 'text-neutral-500';
    }
}
