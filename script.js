document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    document.getElementById("status").innerHTML = "Yuborilmoqda...";

    const formData = new FormData();

    formData.append("teamName", e.target.teamName.value);
    formData.append("captainName", e.target.captainName.value);
    formData.append("mlbbId", e.target.mlbbId.value);
    formData.append("telegram", e.target.telegram.value);
    formData.append("teamLogo", e.target.teamLogo.files[0]);

    const res = await fetch("/api/register.js", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (data.ok) {
        document.getElementById("status").innerHTML = "Jamoa muvaffaqiyatli ro‘yxatdan o‘tdi!";
    } else {
        document.getElementById("status").innerHTML = "Xato: " + data.error;
    }
});

// ❄ REALISTIC SNOW EFFECT
const snowContainer = document.createElement('div');
snowContainer.className = 'snow-container';
document.body.appendChild(snowContainer);

function createSnow() {
    const snow = document.createElement('div');
    snow.className = 'snow';

    // Random holat
    snow.style.left = Math.random() * window.innerWidth + 'px';
    snow.style.opacity = Math.random();
    snow.style.transform = `scale(${Math.random()})`;

    snowContainer.appendChild(snow);

    // Pastga tushish
    setTimeout(() => {
        snow.remove();
    }, 8000);
}

setInterval(createSnow, 80);
