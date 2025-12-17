const BOT_TOKEN = "8450838728:AAEfQjdrCd3VgVev3Af6W2QoiD8IF4hEUD8";
const CHAT_ID = "-1002465352148"; // Kanal yoki guruh ID

document.getElementById("teamForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const statusText = document.getElementById("status");
    statusText.innerHTML = "Yuborilmoqda...";

    const form = e.target;
    const formData = new FormData(form);

    // Telegram botga text yuborish
    const textMessage =
        `🆕 *Yangi jamoa ro‘yxatdan o‘tdi!* \n\n` +
        `🏆 *Winter Tournament 2026*\n\n` +
        `🔹 *Jamoa:* ${formData.get("team_name")}\n` +
        `🔹 *Sardor:* ${formData.get("captain")}\n` +
        `🔹 *MLBB ID:* ${formData.get("mlbb_id")}\n` +
        `🔹 *Telegram:* ${formData.get("telegram")}`;

    // 1) Text yuborish
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: textMessage,
            parse_mode: "Markdown"
        }),
    });

    // 2) Logo yuborish (sifat yo‘qolmaydi!)
    const logo = formData.get("logo");
    const logoData = new FormData();
    logoData.append("chat_id", CHAT_ID);
    logoData.append("photo", logo);

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: logoData,
    });

    statusText.innerHTML = "Jamoa muvaffaqiyatli ro‘yxatdan o‘tdi!";
    form.reset();
});
