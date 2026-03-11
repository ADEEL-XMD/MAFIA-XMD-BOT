const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "gdrive",
    alias: ["gd"],
    react: '📥',
    desc: "Download files from Google Drive.",
    category: "download",
    use: ".gdrive <url>",
    filename: __filename
}, async (conn, mek, m, { from, reply, args, q, sender }) => {
    try {
        const gLink = q || args[0];
        if (!gLink || !gLink.includes("drive.google.com")) {
            return reply('⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ɢᴏᴏɢʟᴇ ᴅʀɪᴠᴇ ᴜʀʟ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*');
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Protocol 1: Attempt NexOracle API
        let downloadData = null;
        try {
            const res = await axios.get(`https://api.nexoracle.com/downloader/gdrive`, {
                params: { apikey: 'free_key@maher_apis', url: gLink }
            });
            if (res.data?.status === 200) downloadData = res.data.result;
        } catch (e) { /* fallback to next source */ }

        // Protocol 2: Fallback to Visper API
        if (!downloadData) {
            try {
                const res = await axios.get(`https://visper-md-ap-is.vercel.app/download/gdrive?q=${encodeURIComponent(gLink)}`);
                if (res.data.success) downloadData = res.data.result;
            } catch (e) { /* both failed */ }
        }

        if (!downloadData) return reply('❌ *ᴜɴᴀʙʟᴇ ᴛᴏ ꜰᴇᴛᴄʜ ꜰɪʟᴇ. ᴘʟᴇᴀsᴇ ᴄʜᴇᴄᴋ ᴘᴇʀᴍɪssɪᴏɴs.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*');

        const { downloadUrl, fileName, fileSize, mimetype } = downloadData;

        // --- CYBER GRID PANEL ---
        const infoMsg = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ɢ-ᴅʀɪᴠᴇ ᴄᴏʀᴇ 」*

┌───────────────────┐
  📂 *ꜰɪʟᴇ:* ${fileName}
  📏 *sɪᴢᴇ:* ${fileSize || "N/A"}
  📡 *ᴛʏᴘᴇ:* ${mimetype}
└───────────────────┘
> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        const context = {
            mentionedJid: [sender],
            forwardingScore: 0,
            isForwarded: false
        };

        // Automatic Media Router
        if (mimetype.startsWith('image')) {
            await conn.sendMessage(from, { image: { url: downloadUrl }, caption: infoMsg, contextInfo: context }, { quoted: mek });
        } else if (mimetype.startsWith('video')) {
            await conn.sendMessage(from, { video: { url: downloadUrl }, caption: infoMsg, contextInfo: context }, { quoted: mek });
        } else {
            await conn.sendMessage(from, { 
                document: { url: downloadUrl }, 
                mimetype, 
                fileName, 
                caption: infoMsg, 
                contextInfo: context 
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error(error);
        reply('❌ *ᴅᴏᴡɴʟᴏᴀᴅ ᴘʀᴏᴛᴏᴄᴏʟ ꜰᴀɪʟᴇᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*');
    }
});