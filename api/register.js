import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {

  if (req.method !== "POST")
      return res.status(405).send("Faqat POST");

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID; // Siz kiritasiz

  const form = await req.body;
  const data = await new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
  });

  // Multipart form parsing
  const boundary = req.headers["content-type"].split("boundary=")[1];
  const parts = data.toString().split(`--${boundary}`);

  // Extract fields
  let teamName = extract("teamName", parts);
  let captainName = extract("captainName", parts);
  let mlbbId = extract("mlbbId", parts);
  let telegram = extract("telegram", parts);

  // Extract image
  const logoPart = parts.find(p => p.includes('name="logo"'));
  const logoBinary = extractFileBinary(logoPart);

  // Prepare Telegram message
  const message = `
Yangi jamoa ro‘yxatdan o‘tdi!

Jamoa nomi: ${teamName}
Sardor: ${captainName}
MLBB ID: ${mlbbId}
Telegram: ${telegram}
  `;

  // Send message
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
  });

  // Send logo
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: createFormData(BOT_TOKEN, CHAT_ID, logoBinary)
  });

  return res.status(200).send("Muvaffaqiyatli yuborildi!");
}

// Helpers -------------
function extract(name, parts){
  let p = parts.find(x => x.includes(`name="${name}"`));
  if(!p) return "";
  return p.split("\r\n\r\n")[1].replace("\r\n","").trim();
}

function extractFileBinary(part){
  let binary = part.split("\r\n\r\n")[1];
  binary = binary.slice(0, binary.lastIndexOf("\r\n"));
  return Buffer.from(binary, "binary");
}

function createFormData(token, chatId, photo){
  const fd = new FormData();
  fd.append("chat_id", chatId);
  fd.append("photo", new Blob([photo]), "logo.jpg");
  return fd;
}
