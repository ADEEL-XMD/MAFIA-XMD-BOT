const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "ytstalk",
  alias: ["youtubestalk", "ytinfo"],
  react: '🔍',
  desc: "Get deep information about a YouTube channel.",
  category: "search",
  use: ".ytstalk <username>",
  filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
  try {
    if (!q) return reply('⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ʏᴏᴜᴛᴜʙᴇ ᴜsᴇʀɴᴀᴍᴇ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*');

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    let ytData = null;

    // Protocol 1: Deep Search (Stats + Videos)
    try {
      const res = await axios.get(`https://api.siputzx.my.id/api/stalk/youtube?username=${encodeURIComponent(q)}`);
      if (res.data?.status && res.data.data) {
        const d = res.data.data;
        ytData = {
          name: d.channel.username,
          subs: d.channel.subscriberCount,
          videos: d.channel.videoCount,
          avatar: d.channel.avatarUrl,
          url: d.channel.channelUrl,
          desc: d.channel.description || "No description available.",
          latest: d.latest_videos
        };
      }
    } catch (e) { /* fallback to Protocol 2 */ }

    // Protocol 2: Fallback Search (Basic Stats)
    if (!ytData) {
      try {
        const res = await axios.get(`https://delirius-apiofc.vercel.app/tools/ytstalk?channel=${encodeURIComponent(q)}`);
        if (res.data?.status && res.data.data) {
          const d = res.data.data;
          ytData = {
            name: d.username,
            subs: d.subscriber_count,
            videos: d.video_count,
            avatar: d.avatar,
            url: d.channel,
            desc: "Description fetch failed during fallback.",
            latest: []
          };
        }
      } catch (e) { /* both failed */ }
    }

    if (!ytData) return reply('❌ *ᴄʜᴀɴɴᴇʟ ɴᴏᴛ ꜰᴏᴜɴᴅ ɪɴ ᴀɴʏ ᴅᴀᴛᴀʙᴀsᴇ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*');

    // Cyber-Grid UI Construction
    let infoMsg = `*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ʏᴛ sᴛᴀʟᴋᴇʀ 」*

┌───────────────────┐
  👤 *ᴄʜᴀɴɴᴇʟ:* ${ytData.name}
  📊 *sᴜʙs:* ${ytData.subs}
  🎥 *ᴠɪᴅᴇᴏs:* ${ytData.videos}
  🔗 *ʟɪɴᴋ:* ${ytData.url}
└───────────────────┘

📜 *ᴅᴇsᴄ:* ${ytData.desc.slice(0, 150)}...
`;

    if (ytData.latest.length > 0) {
      infoMsg += `\n🎬 *ʟᴀᴛᴇsᴛ ᴜᴘʟᴏᴀᴅs:*\n`;
      ytData.latest.slice(0, 3).forEach((vid, i) => {
        infoMsg += `\n${i + 1}. *${vid.title}*\n   👁️ ${vid.viewCount} | ⏱️ ${vid.duration}\n`;
      });
    }

    infoMsg += `\n> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

    await conn.sendMessage(from, {
      image: { url: ytData.avatar },
      caption: infoMsg,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 0,
        isForwarded: false,
        externalAdReply: {
          title: `ʏᴏᴜᴛᴜʙᴇ sᴛᴀᴛs: ${ytData.name}`,
          body: "ᴀᴋɪɴᴅᴜ-ᴍᴅ sᴇᴀʀᴄʜ ᴇɴɢɪɴᴇ",
          mediaType: 1,
          thumbnailUrl: ytData.avatar,
          sourceUrl: ytData.url,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error(error);
    reply('❌ *sᴇᴀʀᴄʜ ᴘʀᴏᴛᴏᴄᴏʟ ꜰᴀɪʟᴇᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*');
  }
});