const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    desc: "Check bot status and local Sri Lanka time",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        // Calculate System Data
        const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);

        // Get Sri Lanka Time & Date
        const slTime = new Date().toLocaleString("en-US", { 
            timeZone: "Asia/Colombo", 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true 
        });
        
        const slDate = new Date().toLocaleString("en-US", { 
            timeZone: "Asia/Colombo", 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        const status = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴀʟɪᴠᴇ sᴛᴀᴛᴜs 」*

┌───────────────────┐
  🤖 *sᴛᴀᴛᴜs:* ᴀᴄᴛɪᴠᴇ & ᴏɴʟɪɴᴇ
  👑 *ᴏᴡɴᴇʀ:* ${config.OWNER_NAME}
  ⌛ *ᴜᴘᴛɪᴍᴇ:* ${runtime(process.uptime())}
  💾 *ʀᴀᴍ:* ${usedRam}MB / ${totalRam}MB
  🚀 *ᴍᴏᴅᴇ:* ${config.MODE}
├───────────────────┤
  🕒 *ᴛɪᴍᴇ:* ${slTime}
  📅 *ᴅᴀᴛᴇ:* ${slDate}
  📍 *ʟᴏᴄ:* sʀɪ ʟᴀɴᴋᴀ
└───────────────────┘

> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        await conn.sendMessage(from, {
            image: { url: config.ALIVE_IMG || config.MENU_IMAGE_URL || 'https://files.catbox.moe/brlkte.jpg' },
            caption: status,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 0,
                isForwarded: false,
                externalAdReply: {
                    title: "ᴀᴋɪɴᴅᴜ-ᴍᴅ : sʏsᴛᴇᴍ ᴏɴʟɪɴᴇ",
                    body: `ʟᴏᴄᴀʟ ᴛɪᴍᴇ: ${slTime}`,
                    mediaType: 1,
                    thumbnailUrl: config.MENU_IMAGE_URL,
                    sourceUrl: "https://github.com/",
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`❌ *ᴇʀʀᴏʀ:* ${e.message}\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);
    }
});