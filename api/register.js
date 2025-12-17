import formidable from "formidable";
import fs from "fs";

export const config = {
    api: { bodyParser: false }
};

const BOT_TOKEN = "8450838728:AAEfQjdrCd3VgVev3Af6W2QoiD8IF4hEUD8";
const CHAT_ID = "6579383715";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Faqat POST ruxsat etiladi" });
    }

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: "Form xatolik" });

        const { teamName, captainName, mlbbId, telegram } = fields;
        const file = files.teamLogo;

        const caption = `
Yangi jamoa ro‘yxatdan o‘tdi!
🏆 Jamoa nomi: ${teamName}
👑 Sardor: ${captainName}
🆔 MLBB ID: ${mlbbId}
📩 Telegram: ${telegram}
`;

        try {
            const buffer = fs.readFileSync(file.filepath);
            const blob = new Blob([buffer]);

            const formData = new FormData();
            formData.append("chat_id", CHAT_ID);
            formData.append("caption", caption);
            formData.append("parse_mode", "HTML");
            formData.append("photo", blob, file.originalFilename);

            const tgRes = await fetch(
                `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
                { method: "POST", body: formData }
            );

            const result = await tgRes.json();

            if (!result.ok) {
                return res.status(500).json({
                    error: "Telegramga yuborishda xato",
                    telegram_error: result
                });
            }

            return res.status(200).json({ ok: true });

        } catch (error) {
            return res.status(500).json({
                error: "Server xatosi",
                detail: String(error)
            });
        }
    });
}
