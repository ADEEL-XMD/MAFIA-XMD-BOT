const axios = require("axios");
const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "facebook",
  alias: ["fb"], 
  desc: "Download Facebook videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply, sender }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return reply("⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ꜰʙ ᴜʀʟ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/fbdl?url=${encodeURIComponent(q)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data?.status || !data?.data) {
      return reply("❌ *ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ᴍᴇᴅɪᴀ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*");
    }

    const { title, thumbnail, low, high } = data.data;

    // --- CYBER GRID SELECTION PANEL ---
    const caption = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ꜰʙ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ 」*

┌───────────────────┐
  📑 *ᴛɪᴛʟᴇ:* ${title || "No title"}
  🔗 *sᴛᴀᴛᴜs:* ʟɪɴᴋ ᴅᴇᴛᴇᴄᴛᴇᴅ
└───────────────────┘

*sᴇʟᴇᴄᴛ ᴘʀᴏᴛᴏᴄᴏʟ:*

┏━━━━━━━━━━━━━━━━━━━┓
┃ 01 ‣ *sᴅ ǫᴜᴀʟɪᴛʏ* 🪫
┃ 02 ‣ *ʜᴅ ǫᴜᴀʟɪᴛʏ* 🔋
┃ 03 ‣ *ᴀᴜᴅɪᴏ ᴍᴘ𝟹* 🎶
┗━━━━━━━━━━━━━━━━━━━┛
> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumbnail },
      caption,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 0,
        isForwarded: false,
        externalAdReply: {
          title: "ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴍᴇᴅɪᴀ ᴄᴏʀᴇ",
          body: "ꜰᴀᴄᴇʙᴏᴏᴋ ᴅᴏᴡɴʟᴏᴀᴅ ᴘᴀɴᴇʟ",
          thumbnail: { url: thumbnail },
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
          await conn.sendMessage(from, { react: { text: '📉', key: receivedMsg.key } });
          await conn.sendMessage(from, {
            video: { url: low },
            caption: "*ᴀᴋɪɴᴅᴜ-ᴍᴅ*",
            contextInfo: { forwardingScore: 0, isForwarded: false }
          }, { quoted: receivedMsg });
          conn.ev.off("messages.upsert", handler);
        } 
        else if (receivedText === "2") {
          await conn.sendMessage(from, { react: { text: '📈', key: receivedMsg.key } });
          await conn.sendMessage(from, {
            video: { url: high },
            caption: "*ᴀᴋɪɴᴅᴜ-ᴍᴅ*",
            contextInfo: { forwardingScore: 0, isForwarded: false }
          }, { quoted: receivedMsg });
          conn.ev.off("messages.upsert", handler);
        }
        else if (receivedText === "3") {
          await conn.sendMessage(from, { react: { text: '🎶', key: receivedMsg.key } });
          await conn.sendMessage(from, {
            audio: { url: low || high },
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