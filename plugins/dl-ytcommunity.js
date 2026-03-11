const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

cmd({
    pattern: "ytpost",
    desc: "Download a YouTube community post",
    category: "downloader",
    react: "⏳",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react, sender }) => {
    try {
        if (!q) return reply("⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ʏᴏᴜᴛᴜʙᴇ ᴄᴏᴍᴍᴜɴɪᴛʏ ʟɪɴᴋ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");

        const apiUrl = `https://api.siputzx.my.id/api/d/ytpost?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data) {
            await react("❌");
            return reply("❌ *ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ᴛʜᴇ ᴘᴏsᴛ. ᴄʜᴇᴄᴋ ᴛʜᴇ ᴜʀʟ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");
        }

        const post = data.data;

        // --- CYBER GRID CAPTION ---
        const mainCaption = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ʏᴛ ᴄᴏᴍᴍᴜɴɪᴛʏ 」*

┌───────────────────┐
  📜 *ᴄᴏɴᴛᴇɴᴛ:* ${post.content || "No text content"}
└───────────────────┘
> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        const context = {
            mentionedJid: [sender],
            forwardingScore: 0,
            isForwarded: false
        };

        if (post.images && post.images.length > 0) {
            for (let i = 0; i < post.images.length; i++) {
                await conn.sendMessage(from, { 
                    image: { url: post.images[i] }, 
                    caption: i === 0 ? mainCaption : `*ᴘᴀɢᴇ ${i + 1}* \n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`,
                    contextInfo: context
                }, { quoted: mek });
            }
        } else {
            await conn.sendMessage(from, { 
                text: mainCaption, 
                contextInfo: context 
            }, { quoted: mek });
        }

        await react("✅");
    } catch (e) {
        console.error("Error in ytpost command:", e);
        await react("❌");
        reply("❌ *ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ ᴡʜɪʟᴇ ꜰᴇᴛᴄʜɪɴɢ ᴛʜᴇ ᴘᴏsᴛ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");
    }
});