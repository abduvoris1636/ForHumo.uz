import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function generateSecureId(): string {
    const length = 8;
    const chars = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*'
    };

    // Ensure at least one of each
    let id = [
        chars.upper[Math.floor(Math.random() * chars.upper.length)],
        chars.lower[Math.floor(Math.random() * chars.lower.length)],
        chars.numbers[Math.floor(Math.random() * chars.numbers.length)],
        chars.symbols[Math.floor(Math.random() * chars.symbols.length)]
    ];

    // Fill the rest randomly
    const allChars = Object.values(chars).join('');
    for (let i = 4; i < length; i++) {
        id.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Shuffle
    return id.sort(() => Math.random() - 0.5).join('');
}
