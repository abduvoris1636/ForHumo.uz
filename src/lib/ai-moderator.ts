import { TournamentMatch, ValidationResult } from './esport-types';

export function validateMatchUpdate(match: Partial<TournamentMatch>): ValidationResult {
    const flags: string[] = [];

    // Rule 1: Negative Scores
    if ((match.scoreA !== undefined && match.scoreA !== null && match.scoreA < 0) || (match.scoreB !== undefined && match.scoreB !== null && match.scoreB < 0)) {
        flags.push("Impossible Score: Negative value detected");
    }

    // Rule 2: Same Team
    if (match.teamA?.id && match.teamB?.id && match.teamA.id === match.teamB.id) {
        flags.push("Logic Error: Team cannot play against itself");
    }

    // Rule 3: High Score Suspicion
    if ((match.scoreA || 0) > 3 || (match.scoreB || 0) > 3) {
        // Assuming BO5 max, score > 3 is suspicious but possible in specific formats, treating as warning
        // Actually for standard BO3/BO5, a single map score is just 1 or 0 usually, but this is series score.
        // Let's assume series score. 
        flags.push("Anomaly: Score exceeds typical BO5 range");
    }

    return {
        isValid: flags.length === 0,
        flags,
        confidence: flags.length === 0 ? 1.0 : 0.4
    };
}
