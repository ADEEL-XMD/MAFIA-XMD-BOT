const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "mediafire",
  alias: ["mfire"],
  react: '📥',
  desc: "Download files from MediaFire.",
  category: "download",
  use: ".mediafire <MediaFire URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args, q, sender }) => {
  try {
    if (!q) {
      return reply('⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴍᴇᴅɪᴀꜰɪʀᴇ ᴜʀʟ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*');
    }

    // Processing reaction
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Build the API URL
    const apiUrl = `https://ominisave.vercel.app/api/mfire?url=${encodeURIComponent(q)}`;

    // Fetch from API
    const { data } = await axios.get(apiUrl);

    // Validate response
    if (!data.status || !data.result || !data.result.download) {
      return reply('❌ *ᴜɴᴀʙʟᴇ ᴛᴏ ꜰᴇᴛᴄʜ ᴛʜᴇ ꜰɪʟᴇ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*');
    }

    // Extract details
    const { fileName, uploaded, fileType, size, download } = data.result;

    // --- CYBER GRID INFO PANEL ---
    const infoMsg = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴍᴇᴅɪᴀꜰɪʀᴇ 」*

┌───────────────────┐
  📂 *ꜰɪʟᴇ:* ${fileName}
  📦 *sɪᴢᴇ:* ${size}
  📅 *ᴜᴘ:* ${uploaded}
└───────────────────┘
> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

    await reply(infoMsg);

    // Download file
    const fileResponse = await axios.get(download, { responseType: 'arraybuffer' });

    // Send file
    await conn.sendMessage(from, {
      document: fileResponse.data,
      mimetype: fileType || 'application/octet-stream',
      fileName: fileName,
      caption: `*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 0,
        isForwarded: false
      }
    }, { quoted: mek });

    // Success reaction
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error('Error downloading file:', error);
    reply('❌ *ᴇʀʀᴏʀ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ᴛʜᴇ ꜰɪʟᴇ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*');
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});