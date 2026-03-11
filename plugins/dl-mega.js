const { cmd } = require('../command');
const { File } = require('megajs');
const path = require('path');
const fs = require('fs');
const os = require('os');

cmd({
    pattern: "mega",
    alias: ["meganz", "megadl"],
    react: "☁️",
    desc: "Download files from Mega.nz (Direct Transfer)",
    category: "download",
    use: ".mega <mega.nz link>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) {
            return reply("⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ᴍᴇɢᴀ.ɴᴢ ʟɪɴᴋ.*");
        }

        // Initial Loading Reaction
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Initialize MEGA File from link
        const file = File.fromURL(q);
        
        // Attempt to fetch file metadata first to verify link
        await file.loadAttributes();
        
        const fileName = file.name || "AKINDU-MD-FILE";
        const fileSize = file.size ? (file.size / (1024 * 1024)).toFixed(2) : "Unknown";

        // Notify user that download has started
        await reply(`*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴍᴇɢᴀ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ 」*\n\n┌───────────────────┐\n  📂 *ꜰɪʟᴇ:* ${fileName}\n  ⚖️ *sɪᴢᴇ:* ${fileSize} MB\n└───────────────────┘\n\n> *ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ, ꜰɪʟᴇ ɪs ʙᴇɪɴɢ ᴘʀᴏᴄᴇssᴇᴅ...*`);

        // Download into buffer
        const data = await new Promise((resolve, reject) => {
            file.download((err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        // Create temp file path
        const tempPath = path.join(os.tmpdir(), `${Date.now()}_${fileName}`);
        fs.writeFileSync(tempPath, data);

        // Uploading Reaction
        await conn.sendMessage(from, { react: { text: '⬆️', key: m.key } });

        // Send Document
        await conn.sendMessage(from, {
            document: fs.readFileSync(tempPath),
            fileName: fileName,
            mimetype: "application/octet-stream",
            caption: `*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴍᴇɢᴀ ᴅᴏᴡɴʟᴏᴀᴅ 」*\n\n📦 *ꜰɪʟᴇ:* ${fileName}\n📊 *sɪᴢᴇ:* ${fileSize} MB\n👤 *ʀᴇǫᴜᴇsᴛᴇᴅ:* @${sender.split('@')[0]}\n\n> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: "ᴍᴇɢᴀ.ɴᴢ sʏsᴛᴇᴍ ᴅᴏᴡɴʟᴏᴀᴅ",
                    body: fileName,
                    mediaType: 1,
                    thumbnailUrl: "https://files.catbox.moe/brlkte.jpg",
                    sourceUrl: q,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

        // Cleanup
        fs.unlinkSync(tempPath);
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error("❌ MEGA Error:", error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply(`❌ *ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ.*\n\n*ʀᴇᴀsᴏɴ:* ${error.message || "Invalid link or file is too large."}`);
    }
});