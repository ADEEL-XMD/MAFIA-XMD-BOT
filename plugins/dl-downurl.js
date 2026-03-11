const { cmd, commands } = require('../command');
const axios = require("axios");

cmd({
    pattern: "download",
    alias: ["downurl"],
    use: ".download <link>",
    react: "⏳",
    desc: "Download file from direct link",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) {
            return reply("⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ᴅɪʀᴇᴄᴛ ʟɪɴᴋ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");
        }

        const link = q.trim();
        const urlPattern = /^(https?:\/\/[^\s]+)/i;
        
        if (!urlPattern.test(link)) {
            return reply("❌ *ɪɴᴠᴀʟɪᴅ ᴜʀʟ ꜰᴏʀᴍᴀᴛ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");
        }

        // Fetching file metadata for the Cyber-Grid box
        const head = await axios.head(link).catch(() => {
            throw "❌ *ᴜɴᴀʙʟᴇ ᴛᴏ ʀᴇᴀᴄʜ ᴛʜᴇ sᴇʀᴠᴇʀ.*";
        });

        const contentType = head.headers['content-type'] || "application/octet-stream";
        const sizeBytes = head.headers['content-length'];
        const sizeMB = sizeBytes ? (sizeBytes / (1024 * 1024)).toFixed(2) + " MB" : "Unknown Size";

        // --- CYBER GRID INFO ---
        const infoMsg = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴜʀʟ ꜰᴇᴛᴄʜᴇʀ 」*

┌───────────────────┐
  📂 *ꜰᴏʀᴍᴀᴛ:* ${contentType.split('/')[1]?.toUpperCase() || 'DATA'}
  📦 *sɪᴢᴇ:* ${sizeMB}
  🔗 *sᴛᴀᴛᴜs:* ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ...
└───────────────────┘
> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        await reply(infoMsg);

        // Send file as document
        await conn.sendMessage(from, {
            document: { url: link },
            mimetype: contentType,
            fileName: `ᴀᴋɪɴᴅᴜ-ᴍᴅ_ꜰɪʟᴇ`,
            caption: `*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 0,
                isForwarded: false
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        reply(`${err}\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);
    }
});