const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "setting",
    alias: ["settings", "env", "config"],
    desc: "Show all bot configuration variables (Owner Only)",
    category: "system",
    react: "⚙️",
    filename: __filename
}, 
async (conn, mek, m, { from, reply, isCreator, sender }) => {
    try {
        // Owner check
        if (!isCreator) {
            return reply("🚫 *ᴏᴡɴᴇʀ ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ!*");
        }

        // Start Loading Reaction
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const isEnabled = (value) => value && value.toString().toLowerCase() === "true";

        let settingsPanel = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : sʏsᴛᴇᴍ sᴇᴛᴛɪɴɢs 」*

┌───────────────────┐
  🤖 *ʙᴏᴛ ɪɴꜰᴏ*
  • ɴᴀᴍᴇ: ${config.BOT_NAME}
  • ᴘʀᴇꜰɪx: [ ${config.PREFIX} ]
  • ᴏᴡɴᴇʀ: ${config.OWNER_NAME}
  • ᴍᴏᴅᴇ: ${config.MODE.toUpperCase()}
└───────────────────┘

┌───────────────────┐
  ⚙️ *ᴄᴏʀᴇ ᴄᴏɴꜰɪɢ*
  • ᴘᴜʙʟɪᴄ ᴍᴏᴅᴇ: ${isEnabled(config.PUBLIC_MODE) ? "✅" : "❌"}
  • ᴀʟᴡᴀʏs ᴏɴʟɪɴᴇ: ${isEnabled(config.ALWAYS_ONLINE) ? "✅" : "❌"}
  • ʀᴇᴀᴅ ᴍsɢs: ${isEnabled(config.READ_MESSAGE) ? "✅" : "❌"}
  • ᴀᴜᴛᴏ ᴛʏᴘɪɴɢ: ${isEnabled(config.AUTO_TYPING) ? "✅" : "❌"}
  • ᴀᴜᴛᴏ ʀᴇᴄᴏʀᴅ: ${isEnabled(config.AUTO_RECORDING) ? "✅" : "❌"}
└───────────────────┘

┌───────────────────┐
  🔌 *ᴀᴜᴛᴏᴍᴀᴛɪᴏɴ*
  • ᴀᴜᴛᴏ ʀᴇᴘʟʏ: ${isEnabled(config.AUTO_REPLY) ? "✅" : "❌"}
  • ᴀᴜᴛᴏ ʀᴇᴀᴄᴛ: ${isEnabled(config.AUTO_REACT) ? "✅" : "❌"}
  • ᴀᴜᴛᴏ sᴛɪᴄᴋᴇʀ: ${isEnabled(config.AUTO_STICKER) ? "✅" : "❌"}
  • ᴀᴜᴛᴏ ᴠᴏɪᴄᴇ: ${isEnabled(config.AUTO_VOICE) ? "✅" : "❌"}
└───────────────────┘

┌───────────────────┐
  📢 *sᴛᴀᴛᴜs ᴄᴏɴꜰɪɢ*
  • sᴛᴀᴛᴜs sᴇᴇɴ: ${isEnabled(config.AUTO_STATUS_SEEN) ? "✅" : "❌"}
  • sᴛᴀᴛᴜs ʀᴇᴘʟʏ: ${isEnabled(config.AUTO_STATUS_REPLY) ? "✅" : "❌"}
  • sᴛᴀᴛᴜs ʀᴇᴀᴄᴛ: ${isEnabled(config.AUTO_STATUS_REACT) ? "✅" : "❌"}
└───────────────────┘

┌───────────────────┐
  🛡️ *sᴇᴄᴜʀɪᴛʏ*
  • ᴀɴᴛɪ-ʟɪɴᴋ: ${isEnabled(config.ANTI_LINK) ? "✅" : "❌"}
  • ᴀɴᴛɪ-ʙᴀᴅ: ${isEnabled(config.ANTI_BAD) ? "✅" : "❌"}
  • ᴀɴᴛɪ-ᴅᴇʟᴇᴛᴇ: ${isEnabled(config.ANTI_DELETE) ? "✅" : "❌"}
└───────────────────┘

📝 *ɴᴏᴛᴇ:* ᴜsᴇ \`${config.PREFIX}update <ᴠᴀʀ>:<ᴠᴀʟᴜᴇ>\` ᴛᴏ ᴄʜᴀɴɢᴇ sᴇᴛᴛɪɴɢs.

> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/brlkte.jpg' },
            caption: settingsPanel,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 0,
                isForwarded: false,
                externalAdReply: {
                    title: "ᴀᴋɪɴᴅᴜ-ᴍᴅ sʏsᴛᴇᴍ ᴄᴏɴᴛʀᴏʟ",
                    body: "ᴏꜰꜰɪᴄɪᴀʟ ᴄᴏɴꜰɪɢᴜʀᴀᴛɪᴏɴ ᴘᴀɴᴇʟ",
                    mediaType: 1,
                    thumbnailUrl: config.MENU_IMAGE_URL,
                    sourceUrl: "https://github.com/Akindu/AKINDU-MD",
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

        // Success Reaction
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error('Settings command error:', error);
        reply(`❌ *ᴇʀʀᴏʀ:* ${error.message}`);
    }
});