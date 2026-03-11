const axios = require("axios");
const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "tiktok",
  alias: ["tt"],
  desc: "Download TikTok videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply, sender }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return reply("⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ᴛɪᴋᴛᴏᴋ ᴜʀʟ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // ✅ Fetching data
    const response = await axios.get(`https://api-aswin-sparky.koyeb.app/api/downloader/tiktok?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.data) {
      return reply("❌ *ꜰᴀɪʟᴇᴅ ᴛᴏ ʀᴇᴛʀɪᴇᴠᴇ ᴍᴇᴅɪᴀ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");
    }
    
    const dat = data.data;
    
    // --- CYBER GRID SELECTION PANEL ---
    const caption = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴛᴛ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ 」*

┌───────────────────┐
  📑 *ᴛɪᴛʟᴇ:* ${dat.title || "No title"}
  ⏱️ *ᴅᴜʀ:* ${dat.duration || "N/A"}
  📊 *sᴛᴀᴛs:* ❤️ ${dat.view || "0"} | 💬 ${dat.comment || "0"}
└───────────────────┘

*sᴇʟᴇᴄᴛ ᴘʀᴏᴛᴏᴄᴏʟ:*

┏━━━━━━━━━━━━━━━━━━━┓
┃ 01 ‣ *ᴠɪᴅᴇᴏ (ʜᴅ ǫᴜᴀʟɪᴛʏ)* 🎥
┃ 02 ‣ *ᴀᴜᴅɪᴏ (ᴍᴘ3 ꜰɪʟᴇ)* 🎶
┗━━━━━━━━━━━━━━━━━━━┛
> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: dat.thumbnail },
      caption,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 0,
        isForwarded: false,
        externalAdReply: {
          title: "ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴍᴇᴅɪᴀ ᴄᴏʀᴇ",
          body: "ᴛɪᴋᴛᴏᴋ ᴄᴏɴᴛᴇɴᴛ ᴅᴇʟɪᴠᴇʀʏ",
          thumbnail: { url: dat.thumbnail },
          sourceUrl: `https://wa.me/${config.OWNER_NUMBER}`,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    const messageID = sentMsg.key.id;

    // --- INTERACTIVE LISTENER ---
    const handler = async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg?.message) return;

      const receivedText = (receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text || "").trim();
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        if (receivedText === "1") {
          await conn.sendMessage(from, { react: { text: '🎥', key: receivedMsg.key } });
          await conn.sendMessage(from, {
            video: { url: dat.video },
            caption: "*ᴀᴋɪɴᴅᴜ-ᴍᴅ*",
            contextInfo: { forwardingScore: 0, isForwarded: false }
          }, { quoted: receivedMsg });
          conn.ev.off("messages.upsert", handler);
        } 
        else if (receivedText === "2") {
          await conn.sendMessage(from, { react: { text: '🎶', key: receivedMsg.key } });
          await conn.sendMessage(from, {
            audio: { url: dat.audio },
            mimetype: "audio/mp4",
            ptt: false,
            contextInfo: { forwardingScore: 0, isForwarded: false }
          }, { quoted: receivedMsg });
          conn.ev.off("messages.upsert", handler);
        }
      }
    };

    conn.ev.on("messages.upsert", handler);
    setTimeout(() => conn.ev.off("messages.upsert", handler), 300000);

  } catch (error) {
    console.error(error);
    reply("❌ *sʏsᴛᴇᴍ ᴇʀʀᴏʀ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");
  }
});