const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd } = require("../command");

// Helper function to format bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

cmd({
    pattern: "tourl",
    alias: ["url", "imgtourl", "upload", "geturl"],
    react: '🖇',
    desc: "Convert media to a permanent Catbox URL.",
    category: "utility",
    use: ".tourl [reply to media]",
    filename: __filename
}, async (conn, mek, m, { reply, sender }) => {
    try {
        const quotedMsg = m.quoted ? m.quoted : m;
        const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
        
        if (!mimeType) {
            return reply("⚠️ *ᴘʟᴇᴀsᴇ ʀᴇᴘʟʏ ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ, ᴠɪᴅᴇᴏ, ᴏʀ ᴀᴜᴅɪᴏ ꜰɪʟᴇ.*");
        }

        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        // Download media
        const mediaBuffer = await quotedMsg.download();
        const extension = path.extname(mimeType.split('/')[1]) || `.${mimeType.split('/')[1]}`;
        const tempFilePath = path.join(os.tmpdir(), `akindu_up_${Date.now()}${extension}`);
        fs.writeFileSync(tempFilePath, mediaBuffer);

        // Prepare Catbox Upload
        const form = new FormData();
        form.append('fileToUpload', fs.createReadStream(tempFilePath));
        form.append('reqtype', 'fileupload');

        const response = await axios.post("https://catbox.moe/user/api.php", form, {
            headers: form.getHeaders()
        });

        if (!response.data || !response.data.includes('https')) {
            throw new Error("Catbox upload failed.");
        }

        const mediaUrl = response.data;
        fs.unlinkSync(tempFilePath);

        // Identify Media Category
        let typeLabel = 'FILE';
        if (mimeType.includes('image')) typeLabel = 'IMAGE';
        else if (mimeType.includes('video')) typeLabel = 'VIDEO';
        else if (mimeType.includes('audio')) typeLabel = 'AUDIO';

        // Cyber-Grid Response
        const caption = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴜʀʟ ɢᴇɴᴇʀᴀᴛᴏʀ 」*

┌───────────────────┐
  📂 *ᴛʏᴘᴇ:* ${typeLabel}
  📏 *sɪᴢᴇ:* ${formatBytes(mediaBuffer.length)}
  🔗 *ᴜʀʟ:* ${mediaUrl}
└───────────────────┘

> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        await conn.sendMessage(m.chat, {
            text: caption,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 0,
                isForwarded: false,
                externalAdReply: {
                    title: "ᴍᴇᴅɪᴀ ᴜᴘʟᴏᴀᴅᴇᴅ sᴜᴄᴄᴇssꜰᴜʟʟʏ",
                    body: "ᴄʟɪᴄᴋ ᴛᴏ ᴠɪᴇᴡ ᴛʜᴇ ᴅɪʀᴇᴄᴛ ʟɪɴᴋ",
                    mediaType: 1,
                    thumbnail: mediaBuffer,
                    sourceUrl: mediaUrl,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error(error);
        reply(`❌ *ᴜᴘʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ:* ${error.message || error}\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);
    }
});