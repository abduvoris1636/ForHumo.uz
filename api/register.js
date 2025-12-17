import formidable from "formidable";
import fs from "fs";
import fetch from "node-fetch";

export const config = {
    api: {
        bodyParser: false
    }
};

const BOT_TOKEN = "8450838728:AAEfQjdrCd3VgVev3Af6W2QoiD8IF4hEUD8";
const CHAT_ID = "YOUR_TELEGRAM_ID"; // O'zingizniki qo'ying

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Faqat POST ruxsat etiladi" });
    }

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: "Form xatolik" });

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
            const fileData = fs.readFileSync(file.filepath);

            const tgForm = new FormData();
            tgForm.append("chat_id", CHAT_ID);
            tgForm.append("caption", caption);
            tgForm.append("parse_mode", "Markdown");
            tgForm.append("photo", new Blob([fileData]), file.originalFilename);

            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: "POST",
                body: tgForm
            });

            res.status(200).json({ ok: true });

        } catch (e) {
            res.status(500).json({ error: "Telegramga yuborishda xato", detail: e });
        }
    });
}
