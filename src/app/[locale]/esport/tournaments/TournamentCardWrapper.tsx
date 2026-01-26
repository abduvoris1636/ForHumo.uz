'use client';

import { TournamentCard } from '@/components/esport/tournaments/TournamentCard';
import { useState } from 'react';

// This wrapper might be needed if I want to handle specific client logic or state management
// for the list (like filtering) later. For now it just passes through.
// Actually, I can allow the page to be server component and just use TournamentCard which is Use Client.
// Page.tsx:
// import { TournamentCard } from ...
// ... map(t => <TournamentCard ... />)
// This works in Next.js App Router.

// So I will fix page.tsx to fetch data and render TournamentCard.
// But I need to define the type of `tournament` in Card props strictly if possible, or `any` for now to speed up.

export function TournamentCardWrapper({ tournament }: { tournament: any }) {
    return <TournamentCard tournament={tournament} onClick={() => { }} />;
}
