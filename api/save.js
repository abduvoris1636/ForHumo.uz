import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Allowed POST only" });

  const data = JSON.parse(req.body);

  const file = path.join(process.cwd(), "teams.json");

  let list = [];

  if (fs.existsSync(file)) {
    const raw = fs.readFileSync(file, "utf-8");
    list = JSON.parse(raw);
  }

  list.push({ ...data, date: new Date().toISOString() });

  fs.writeFileSync(file, JSON.stringify(list, null, 2));

  res.status(200).json({ success: true });
}
