"use client";

export function BackgroundEffects() {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            {/* Ambient Orb 1 */}
            <div
                className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/20 blur-[100px]"
            />

            {/* Ambient Orb 2 */}
            <div
                className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-500/10 blur-[120px]"
            />
        </div>
    );
}
