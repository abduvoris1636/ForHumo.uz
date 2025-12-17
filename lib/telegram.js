import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramNotification(teamData) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Telegram credentials not configured');
      return false;
    }

    const message = `
🎮 *Yangi Jamoa Ro'yxatdan O'tdi!*

🏆 *Jamoa Nomi:* ${teamData.teamName}
👑 *Kapiton:* ${teamData.captainName}
🆔 *MLBB ID:* ${teamData.mlbbId}
📱 *Telegram:* @${teamData.telegramUsername}
⏰ *Ro'yxatdan O'tgan Sana:* ${new Date(teamData.registeredAt).toLocaleString('uz-UZ')}

💫 *Humo eSport Tournament* 💫
    `;

    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '✅ Tasdiqlash',
                callback_data: `approve_${teamData._id}`
              },
              {
                text: '❌ Rad etish',
                callback_data: `reject_${teamData._id}`
              }
            ]
          ]
        }
      }
    );

    return response.data.ok;
  } catch (error) {
    console.error('Telegram notification error:', error);
    return false;
  }
}
