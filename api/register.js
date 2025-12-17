import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";

export const config = {
    api: {
        bodyParser: false
    }
};

const BOT_TOKEN = "8450838728:AAEfQjdrCd3VgVev3Af6W2QoiD8IF4hEUD8";
const CHAT_ID = "6579383715";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Faqat POST ruxsat etiladi" });
    }

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: "Form xatolik" });
        }

        const { teamName, captainName, mlbbId, telegram } = fields;
        const file = files.teamLogo;

        const caption =
`Yangi jamoa ro‘yxatdan o‘tdi!
🏆 *Jamoa nomi:* ${teamName}
👑 *Sardor:* ${captainName}
🆔 *MLBB ID:* ${mlbbId}
📩 *Telegram:* ${telegram}
`;

        try {
            // Faylni o‘qish
            const fileBuffer = fs.readFileSync(file.filepath);

            // Telegramga multipart/form-data yaratish
            const telegramForm = new FormData();
            telegramForm.append("chat_id", CHAT_ID);
            telegramForm.append("caption", caption);
            telegramForm.append("parse_mode", "Markdown");
            telegramForm.append("photo", fileBuffer, file.originalFilename);

            // Yuborish
            const tgRes = await fetch(
                `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
                {
                    method: "POST",
                    body: telegramForm,
                    headers: telegramForm.getHeaders()
                }
            );

            const result = await tgRes.json();

            if (!result.ok) {
                return res.status(500).json({ error: "Telegram xato", result });
            }

            res.status(200).json({ ok: true });
        } catch (e) {
            res.status(500).json({
                error: "Telegramga yuborishda xato",
                detail: e.toString()
            });
        }
    });
}
