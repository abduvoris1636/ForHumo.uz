import fs from "fs";

export default function handler(req, res) {
    const { teamName } = req.query;

    if (!teamName) {
        return res.status(400).json({ error: "teamName kerak" });
    }

    const filePath = "./registered.json";

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }

    const registered = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const exists = registered.some(t => t.teamName.toLowerCase() === teamName.toLowerCase());

    return res.status(200).json({
        available: !exists,       // true = bo'sh
        message: exists ? "Ushbu nom band!" : "Ushbu nom bo‘sh, ishlatishingiz mumkin!"
    });
}
