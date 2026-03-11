const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "apk",
  alias: ["getapk", "app"],
  react: '📦',
  desc: "Universal APK Downloader",
  category: "download",
  use: ".apk <app name>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args, sender }) => {
  try {
    const q = args.join(" ");
    if (!q) return reply('⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀɴ ᴀᴘᴘ ɴᴀᴍᴇ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*');

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    let appData = null;
    let source = "ɴᴇxᴏʀᴀᴄʟᴇ";

    // Try Source 1: NexOracle
    try {
      const res = await axios.get(`https://api.nexoracle.com/downloader/apk`, {
        params: { apikey: 'free_key@maher_apis', q }
      });
      if (res.data?.status === 200 && res.data.result) {
        const r = res.data.result;
        appData = {
          name: r.name,
          size: r.size,
          upd: r.lastup,
          icon: r.icon,
          dl: r.dllink
        };
      }
    } catch (e) { /* fallback to next source */ }

    // Try Source 2: Aptoide (if Source 1 failed)
    if (!appData) {
      try {
        const res = await axios.get(`http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`);
        if (res.data?.datalist?.list?.length) {
          const r = res.data.datalist.list[0];
          source = "ᴀᴘᴛᴏɪᴅᴇ";
          appData = {
            name: r.name,
            size: (r.size / 1048576).toFixed(2) + " MB",
            upd: r.updated,
            icon: r.icon,
            dl: r.file.path_alt
          };
        }
      } catch (e) { /* both failed */ }
    }

    if (!appData) return reply('❌ *ᴀᴘᴘ ɴᴏᴛ ꜰᴏᴜɴᴅ ɪɴ ᴀɴʏ ᴅᴀᴛᴀʙᴀsᴇ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*');

    // Cyber-Grid UI
    const infoMsg = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴀᴘᴋ ᴄᴏʀᴇ 」*

┌───────────────────┐
  📦 *ᴀᴘᴘ:* ${appData.name}
  📏 *sɪᴢᴇ:* ${appData.size}
  📅 *ᴜᴘᴅ:* ${appData.upd}
  📡 *sʀᴄ:* ${source}
└───────────────────┘
> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

    // Send Icon/Info
    await conn.sendMessage(from, {
      image: { url: appData.icon },
      caption: infoMsg,
      contextInfo: { mentionedJid: [sender], forwardingScore: 0, isForwarded: false }
    }, { quoted: mek });

    // Send APK File
    await conn.sendMessage(from, {
      document: { url: appData.dl },
      mimetype: 'application/vnd.android.package-archive',
      fileName: `${appData.name}.apk`,
      caption: `*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`,
      contextInfo: { forwardingScore: 0, isForwarded: false }
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    reply('❌ *ᴅᴏᴡɴʟᴏᴀᴅ ᴘʀᴏᴛᴏᴄᴏʟ ꜰᴀɪʟᴇᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*');
  }
});