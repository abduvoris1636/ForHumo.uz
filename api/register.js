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
const filePath = "./registered.json";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Faqat POST ruxsat etiladi" });
    }

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: "Form xatolik" });

        const { teamName, captainName, mlbbId, telegram } = fields;
        const file = files.teamLogo;

        // === REGISTERED.JSON bilan ishlash ===
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
        }

        const registeredTeams = JSON.parse(fs.readFileSync(filePath, "utf8"));

        // Takror kirishni tekshirish
        const already = registeredTeams.find(
            t => t.mlbbId === mlbbId || t.telegram === telegram
        );

        if (already) {
            return res.status(400).json({
                error: "Bu sardor avval ro'yxatdan o'tgan. Takror ruxsat yo‘q!"
            });
        }

        // Yangi jamoani jsonga yozamiz
        registeredTeams.push({
            teamName,
            captainName,
            mlbbId,
            telegram,
            time: new Date().toISOString()
        });

        fs.writeFileSync(filePath, JSON.stringify(registeredTeams, null, 2));

        // === Telegramga yuborish ===
        const caption = 
`Yangi jamoa ro‘yxatdan o‘tdi!
🏆 *Jamoa nomi:* ${teamName}
👑 *Sardor:* ${captainName}
🆔 *MLBB ID:* ${mlbbId}
📩 *Telegram:* ${telegram}
`;

        try {
            const fileBuffer = fs.readFileSync(file.filepath);

            const telegramForm = new FormData();
            telegramForm.append("chat_id", CHAT_ID);
            telegramForm.append("caption", caption);
            telegramForm.append("parse_mode", "Markdown");
            telegramForm.append("photo", fileBuffer, file.originalFilename);

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
