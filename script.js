document.getElementById("regForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
        team: e.target.team.value,
        captain: e.target.captain.value,
        phone: e.target.phone.value,
        players: e.target.players.value
    };

    await fetch("/api/save", {
        method: "POST",
        body: JSON.stringify(formData)
    });

    window.location.href = "thanks.html";
});
