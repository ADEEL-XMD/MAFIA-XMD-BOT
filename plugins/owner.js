const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    alias: ["developer", "dev"],
    react: "👑", 
    desc: "Get owner contact details",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const ownerNumber = config.OWNER_NUMBER; 
        const ownerName = config.OWNER_NAME;     

        // Create Official vCard
        const vcard = 'BEGIN:VCARD\n' +
                      'VERSION:3.0\n' +
                      `FN:${ownerName}\n` +  
                      `ORG:ᴀᴋɪɴᴅᴜ-ᴍᴅ ᴅᴇᴠᴇʟᴏᴘᴇʀ;\n` +
                      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace(/[+ ]/g, '')}:${ownerNumber}\n` + 
                      'END:VCARD';

        // 1. Send the vCard first
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        }, { quoted: mek });

        // 2. Cyber-Grid Detail Panel
        const ownerPanel = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴏᴡɴᴇʀ ᴅᴇᴛᴀɪʟs 」*

┌───────────────────┐
  👤 *ɴᴀᴍᴇ:* ${ownerName}
  📞 *ɴᴜᴍʙᴇʀ:* ${ownerNumber}
  ⚙️ *sᴛᴀᴛᴜs:* ᴅᴇᴠᴇʟᴏᴘᴇʀ
  🚀 *ᴠᴇʀsɪᴏɴ:* 2.0.0 ʙᴇᴛᴀ
└───────────────────┘

> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/brlkte.jpg' }, 
            caption: ownerPanel,
            contextInfo: {
                mentionedJid: [sender, `${ownerNumber.replace(/[+ ]/g, '')}@s.whatsapp.net`], 
                forwardingScore: 0,
                isForwarded: false,
                externalAdReply: {
                    title: `ᴄᴏɴᴛᴀᴄᴛ: ${ownerName}`,
                    body: "ᴀᴋɪɴᴅᴜ-ᴍᴅ ᴏꜰꜰɪᴄɪᴀʟ ᴅᴇᴠᴇʟᴏᴘᴇʀ",
                    mediaType: 1,
                    thumbnailUrl: 'https://files.catbox.moe/brlkte.jpg',
                    sourceUrl: `https://wa.me/${ownerNumber.replace(/[+ ]/g, '')}`,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ *ᴇʀʀᴏʀ:* ${error.message}\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);
    }
});