const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "xnxx",
    alias: ["xv", "xvideo"],
    react: "🔞",
    desc: "All-in-one X-Search & Download",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { q, from, reply, sender }) => {
    try {
        if (!q) return reply("⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ sᴇᴀʀᴄʜ ᴛᴇʀᴍ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");

        // 1. Unified Search (Using Aswin-Sparky API for reliability)
        const searchRes = await fetchJson(`https://api-aswin-sparky.koyeb.app/api/search/xnxx?search=${encodeURIComponent(q)}`);
        const results = searchRes?.result?.result;

        if (!results || results.length === 0) return reply("❌ *ɴᴏ ʀᴇsᴜʟᴛs ꜰᴏᴜɴᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");

        // 2. Build Results List
        let list = `*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : x-sᴇᴀʀᴄʜ ᴄᴏʀᴇ 」*\n\n`;
        results.slice(0, 10).forEach((vid, i) => {
            list += `*${i + 1}* ‣ ${vid.title}\n`;
        });
        list += `\n*ʀᴇᴘʟʏ ᴡɪᴛʜ ɴᴜᴍʙᴇʀ ᴛᴏ sᴇʟᴇᴄᴛ*\n\n> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        const listMsg = await conn.sendMessage(from, { 
            text: list, 
            contextInfo: { mentionedJid: [sender], forwardingScore: 0, isForwarded: false } 
        }, { quoted: mek });

        // 3. Selection & Download Listener
        const handler = async (update) => {
            const msg = update?.messages?.[0];
            if (!msg?.message || msg.message.extendedTextMessage?.contextInfo?.stanzaId !== listMsg.key.id) return;

            const index = parseInt(msg.message.conversation || msg.message.extendedTextMessage?.text) - 1;
            if (isNaN(index) || index < 0 || index >= results.length) return;

            await conn.sendMessage(from, { react: { text: '⏳', key: msg.key } });
            
            // Fetch Download Data
            const dlRes = await fetchJson(`https://api-aswin-sparky.koyeb.app/api/downloader/xnxx?url=${encodeURIComponent(results[index].link)}`);
            const info = dlRes?.data;
            if (!info) return reply("❌ *ᴅᴏᴡɴʟᴏᴀᴅ ꜰᴀɪʟᴇᴅ.*");

            // Cyber-Grid Delivery
            const finalCaption = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : x-ᴅᴇʟɪᴠᴇʀʏ 」*

┌───────────────────┐
  🔞 *ᴛɪᴛʟᴇ:* ${info.title}
  ⏱️ *ᴅᴜʀ:* ${info.duration || "N/A"}
  📉 *ǫᴜᴀʟɪᴛʏ:* ʜɪɢʜ/sᴛᴅ
└───────────────────┘
> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

            await conn.sendMessage(from, { 
                video: { url: info.files.high || info.files.low }, 
                caption: finalCaption,
                contextInfo: { forwardingScore: 0, isForwarded: false }
            }, { quoted: msg });

            // Cleanup listener
            conn.ev.off("messages.upsert", handler);
        };

        conn.ev.on("messages.upsert", handler);
        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000); // 5 min timeout

    } catch (e) {
        reply("❌ *sʏsᴛᴇᴍ ᴇʀʀᴏʀ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");
    }
});