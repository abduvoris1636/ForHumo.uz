export const AUTUMN_2025_DATA = {
    meta: {
        name: "Autumn Tournament",
        season: "2025–2026",
        game: "Mobile Legends: Bang Bang",
        organizer: "Humo eSport",
        startDate: "2025-11-10",
        endDate: "2025-11-14",
        prizePool: "200,000 UZS",
        status: "Completed"
    },
    teams: [
        { name: "Assasin’s", status: "Active" },
        { name: "Kurayami", status: "Active" },
        { name: "Phantom", status: "Withdrawn", note: "Withdrew on Day 1" },
        { name: "Team Vamos", status: "Active" },
        { name: "Star Boys", status: "Active" }
    ],
    matches: [
        {
            id: "m1",
            date: "10/11/2025",
            time: "22:00",
            teamA: "Assasin’s",
            teamB: "Phantom",
            winner: "Assasin’s",
            score: "1-0",
            youtube: "https://www.youtube.com/live/-JLvSRfYnu0?si=6KzjTia3wpfEB137",
            stage: "Group"
        },
        {
            id: "m2",
            date: "10/11/2025",
            time: "22:30",
            teamA: "Star Boys",
            teamB: "Kurayami",
            winner: "Star Boys",
            score: "1-0",
            youtube: "https://www.youtube.com/live/LM9wcoIt2-s?si=Ok1hleYD9U6eUMTN",
            stage: "Group"
        },
        {
            id: "m3",
            date: "10/11/2025",
            time: "23:00",
            teamA: "Team Vamos",
            teamB: "Assasin’s",
            status: "INCIDENT",
            reason: "Tournament organizer error. Unauthorized participant joined. Match disrupted. Assasin’s surrendered.",
            verdict: "No Winner",
            youtube: "https://www.youtube.com/live/cbuwvi6kZgM?si=KyB8SAWRQ-a0C_db",
            stage: "Group"
        },
        // Semifinals
        {
            id: "m4",
            date: "11/11/2025",
            time: "22:00",
            teamA: "Team Vamos",
            teamB: "Kurayami",
            winner: "Team Vamos",
            score: "1-0",
            youtube: "https://www.youtube.com/live/OjuCvSPrplo?si=rNlDPhRsJ7_8OF9J",
            stage: "Semifinals"
        },
        {
            id: "m5",
            date: "11/11/2025",
            time: "22:30",
            teamA: "Kurayami",
            teamB: "Team Vamos",
            winner: "Team Vamos",
            score: "0-1",
            seriesScore: "Vamos wins 2:0",
            youtube: "https://www.youtube.com/live/CakirTjDBUY?si=yMC-10WXlV0xmptx",
            stage: "Semifinals"
        },
        {
            id: "m6",
            date: "12/11/2025",
            time: "22:00",
            teamA: "Star Boys",
            teamB: "Assasin’s",
            winner: "Star Boys",
            score: "1-0",
            youtube: "https://www.youtube.com/live/FmEnbblZcjA?si=ycFDJQmxpxJIX2QC",
            stage: "Semifinals"
        },
        {
            id: "m7",
            date: "12/11/2025",
            time: "22:30",
            teamA: "Assasin’s",
            teamB: "Star Boys",
            winner: "Star Boys",
            score: "0-1",
            seriesScore: "Star Boys wins 2:0",
            youtube: "https://www.youtube.com/live/2KmSLcdc4AQ?si=WTQRg9tnRXXUWMSX",
            stage: "Semifinals"
        },
        // Third Place
        {
            id: "m8",
            date: "13/11/2025",
            teamA: "Kurayami",
            teamB: "Assasin’s",
            winner: "Kurayami",
            score: "3:0",
            status: "TECHNICAL",
            reason: "Assasin’s voluntarily withdrew. Technical victory awarded.",
            youtube: null,
            stage: "Third Place"
        },
        // Finals
        {
            id: "m9",
            date: "14/11/2025",
            time: "22:00",
            teamA: "Star Boys",
            teamB: "Team Vamos",
            winner: "Star Boys",
            score: "1-0",
            youtube: "https://www.youtube.com/live/ihVDDDAzwxs?si=XvaGCIwu4-UbyUNa",
            stage: "Grand Final"
        },
        {
            id: "m10",
            date: "14/11/2025",
            time: "22:30",
            teamA: "Team Vamos",
            teamB: "Star Boys",
            winner: "Star Boys",
            score: "0-1",
            seriesScore: "Star Boys wins 2:0",
            youtube: "https://www.youtube.com/live/YT4XiYoRyKY?si=gsH_vRPq_gtPvnxG",
            stage: "Grand Final"
        }
    ],
    standings: [
        { place: "1st", team: "Star Boys", prize: "100,000 UZS", proof: "https://t.me/ForHumo_eSport/70", medal: "🥇" },
        { place: "2nd", team: "Team Vamos", prize: "55,000 UZS", proof: "https://t.me/ForHumo_eSport/69", medal: "🥈" },
        { place: "3rd", team: "Kurayami", prize: "30,000 UZS", proof: "https://t.me/ForHumo_eSport/59", medal: "🥉" },
        { place: "4th", team: "Assasin’s", prize: "15,000 UZS", proof: "https://t.me/ForHumo_eSport/58", medal: "" },
        { place: "5th", team: "Phantom", prize: "—", proof: null, medal: "", note: "Withdrawn" }
    ]
};
