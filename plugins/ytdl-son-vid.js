const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');
const config = require('../config');

// --- SONG COMMAND ---
cmd({
    pattern: "song",
    react: "🎵",
    desc: "Download YouTube MP3",
    category: "download",
    use: ".song <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q, sender }) => {
    try {
        if (!q) return reply("⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ sᴏɴɢ ɴᴀᴍᴇ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");

        const search = await yts(q);
        if (!search.videos.length) return reply("❌ *ɴᴏ ʀᴇsᴜʟᴛs ꜰᴏᴜɴᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");

        const data = search.videos[0];
        const api = `https://ominisave.vercel.app/api/ytmp3_v3?url=${encodeURIComponent(data.url)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.downloadUrl) {
            return reply("❌ *ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ. ᴛʀʏ ᴀɢᴀɪɴ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");
        }

        const results = apiRes.result;

        // --- CYBER GRID PANEL ---
        const caption = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴍᴜsɪᴄ ᴄᴏʀᴇ 」*

┌───────────────────┐
  🎵 *ᴛɪᴛʟᴇ:* ${data.title}
  ⏱️ *ᴅᴜʀ:* ${data.timestamp}
  📊 *ᴠɪᴇᴡs:* ${data.views}
└───────────────────┘

*sᴇʟᴇᴄᴛ ꜰᴏʀᴍᴀᴛ:*

┏━━━━━━━━━━━━━━━━━━━┓
┃ 01 ‣ *ᴀᴜᴅɪᴏ ꜰɪʟᴇ* 🎶
┃ 02 ‣ *ᴅᴏᴄᴜᴍᴇɴᴛ ꜰɪʟᴇ* 📂
┃ 03 ‣ *ᴠᴏɪᴄᴇ ɴᴏᴛᴇ* 🎤
┗━━━━━━━━━━━━━━━━━━━┛
> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        const sentMsg = await conn.sendMessage(from, { 
            image: { url: data.thumbnail }, 
            caption,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 0,
                isForwarded: false
            }
        }, { quoted: m });

        const handler = async (msgData) => {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message) return;
            const text = (receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text || "").trim();
            if (receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId !== sentMsg.key.id) return;

            await conn.sendMessage(from, { react: { text: '📥', key: receivedMsg.key } });

            const audioOptions = {
                contextInfo: { forwardingScore: 0, isForwarded: false }
            };

            if (text === "1" || text === "01") {
                await conn.sendMessage(from, { audio: { url: results.downloadUrl }, mimetype: "audio/mpeg", ptt: false, ...audioOptions }, { quoted: receivedMsg });
                conn.ev.off("messages.upsert", handler);
            } else if (text === "2" || text === "02") {
                await conn.sendMessage(from, { document: { url: results.downloadUrl }, mimetype: "audio/mpeg", fileName: `${data.title}.mp3`, ...audioOptions }, { quoted: receivedMsg });
                conn.ev.off("messages.upsert", handler);
            } else if (text === "3" || text === "03") {
                await conn.sendMessage(from, { audio: { url: results.downloadUrl }, mimetype: "audio/mpeg", ptt: true, ...audioOptions }, { quoted: receivedMsg });
                conn.ev.off("messages.upsert", handler);
            }
        };

        conn.ev.on("messages.upsert", handler);
        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000);

    } catch (e) { reply("❌ *sʏsᴛᴇᴍ ᴇʀʀᴏʀ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*"); }
});

// --- VIDEO COMMAND ---
cmd({
    pattern: "video",
    react: "🎬",
    desc: "Download YouTube MP4",
    category: "download",
    use: ".video <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q, sender }) => {
    try {
        if (!q) return reply("⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠɪᴅᴇᴏ ɴᴀᴍᴇ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");

        const search = await yts(q);
        if (!search.videos.length) return reply("❌ *ɴᴏ ʀᴇsᴜʟᴛs ꜰᴏᴜɴᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");

        const data = search.videos[0];

        // --- CYBER GRID PANEL ---
        const caption = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴠɪᴅᴇᴏ ᴄᴏʀᴇ 」*

┌───────────────────┐
  🎬 *ᴛɪᴛʟᴇ:* ${data.title}
  ⏱️ *ᴅᴜʀ:* ${data.timestamp}
└───────────────────┘

*sᴇʟᴇᴄᴛ ᴘʀᴏᴛᴏᴄᴏʟ:*

┏━━━━━━━━━━━━━━━━━━━┓
┃ 01 ‣ *360ᴘ (ʟᴏᴡ)* 📉
┃ 02 ‣ *720ᴘ (ʜᴅ)* 📈
┃ 03 ‣ *360ᴘ (ꜰɪʟᴇ)* 📂
┃ 04 ‣ *720ᴘ (ꜰɪʟᴇ)* 📁
┗━━━━━━━━━━━━━━━━━━━┛
> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        const sentMsg = await conn.sendMessage(from, { 
            image: { url: data.thumbnail }, 
            caption,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 0,
                isForwarded: false
            }
        }, { quoted: m });

        const handler = async (msgData) => {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message) return;
            const text = (receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text || "").trim();
            if (receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId !== sentMsg.key.id) return;

            let quality = (text === "2" || text === "02" || text === "4" || text === "04") ? "720p" : "360p";
            let isDoc = (text === "3" || text === "03" || text === "4" || text === "04");

            await conn.sendMessage(from, { react: { text: '⏳', key: receivedMsg.key } });

            const api = `https://ominisave.vercel.app/api/ytmp4_v2?url=${encodeURIComponent(data.url)}&quality=${quality}`;
            const { data: apiRes } = await axios.get(api);

            if (apiRes?.status && apiRes.result?.downloadUrl) {
                const media = isDoc ? { 
                    document: { url: apiRes.result.downloadUrl }, 
                    fileName: `${data.title}.mp4`, 
                    mimetype: "video/mp4",
                    caption: "*ᴀᴋɪɴᴅᴜ-ᴍᴅ*"
                } : { 
                    video: { url: apiRes.result.downloadUrl }, 
                    caption: "*ᴀᴋɪɴᴅᴜ-ᴍᴅ*" 
                };
                
                await conn.sendMessage(from, { ...media, contextInfo: { forwardingScore: 0, isForwarded: false } }, { quoted: receivedMsg });
                conn.ev.off("messages.upsert", handler);
            } else {
                reply("❌ *ǫᴜᴀʟɪᴛʏ ᴜɴᴀᴠᴀɪʟᴀʙʟᴇ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");
            }
        };

        conn.ev.on("messages.upsert", handler);
        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000);

    } catch (e) { reply("❌ *sʏsᴛᴇᴍ ᴇʀʀᴏʀ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*"); }
});