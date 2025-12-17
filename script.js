document.getElementById("registerForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = document.getElementById("registerForm");
    const status = document.getElementById("status");

    const formData = new FormData(form);

    status.innerHTML = "Yuborilmoqda...";

    let response = await fetch("/api/register", {
        method: "POST",
        body: formData
    });

    let result = await response.text();
    status.innerHTML = result;
});
