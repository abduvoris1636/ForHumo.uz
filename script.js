document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = document.getElementById("registerForm");
    const formData = new FormData(form);

    document.getElementById("result").innerText = "Yuborilmoqda...";

    // BU YERGA KEYIN TELEGRAM BOT API YOZAMIZ
    const BOT_URL = "YOUR_API_URL_HERE";

    const res = await fetch(BOT_URL, {
        method: "POST",
        body: formData
    });

    if (res.ok) {
        document.getElementById("result").innerText = "Jamoa muvaffaqiyatli roʻyhatdan o'tdi!";
        form.reset();
    } else {
        document.getElementById("result").innerText = "Xatolik yuz berdi!";
    }
});
