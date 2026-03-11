const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

// --- HELPER: CLEAN CONTEXT ---
const cleanContext = (sender) => ({
    mentionedJid: [sender],
    forwardingScore: 0,
    isForwarded: false
});

cmd({
    pattern: "menu",
    desc: "Interactive Akindu-MD Cyber Menu",
    category: "menu",
    react: "🚀",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    try {
        const totalCommands = Object.keys(commands).length;
        
        const mainCaption = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : sʏsᴛᴇᴍ ᴍᴇɴᴜ 」*

┌───────────────────┐
  👑 *ᴏᴡɴᴇʀ:* ${config.OWNER_NAME}
  🚀 *ᴜᴘᴛɪᴍᴇ:* ${runtime(process.uptime())}
  ⚙️ *ᴍᴏᴅᴇ:* ${config.MODE}
  📚 *ᴄᴍᴅs:* ${totalCommands}
└───────────────────┘

*sᴇʟᴇᴄᴛ ᴀ ᴄᴀᴛᴇɢᴏʀʏ:*

01 ‣ *ᴀɪ ᴍᴇɴᴜ*
02 ‣ *ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ*
03 ‣ *ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ*
04 ‣ *ꜰᴜɴ ᴍᴇɴᴜ*
05 ‣ *ɢʀᴏᴜᴘ ᴍᴇɴᴜ*
06 ‣ *ɪᴍᴀɢɪɴᴇ ᴍᴇɴᴜ*
07 ‣ *ʟᴏɢᴏ ᴍᴇɴᴜ*
08 ‣ *ᴍᴀɪɴ ᴍᴇɴᴜ*
09 ‣ *ᴏᴛʜᴇʀ ᴍᴇɴᴜ*
10 ‣ *ᴏᴡɴᴇʀ ᴍᴇɴᴜ*
11 ‣ *sᴇᴀʀᴄʜ ᴍᴇɴᴜ*
12 ‣ *sᴇᴛᴛɪɴɢ ᴍᴇɴᴜ*

*ʀᴇᴘʟʏ ᴡɪᴛʜ ᴛʜᴇ ɴᴜᴍʙᴇʀ*

> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        const menuMsg = await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/brlkte.jpg' },
            caption: mainCaption,
            contextInfo: cleanContext(sender)
        }, { quoted: mek });

        const menuData = {
            '1': { title: "ᴀɪ", list: "ai, gpt, venice, copilot, openai, aiimg, aianime, imgedit" },
            '2': { title: "ᴄᴏɴᴠᴇʀᴛ", list: "sticker, tts, tomp3, translate, tiny, tourl, enhance" },
            '3': { title: "ᴅᴏᴡɴʟᴏᴀᴅ", list: "apk, fb, gdrive, ig, mega, pinterest, tiktok, song, video" },
            '4': { title: "ꜰᴜɴ", list: "hack, joke, quote, dare, truth, ship, character, rate" },
            '5': { title: "ɢʀᴏᴜᴘ", list: "add, kick, promote, demote, hidetag, tagall, mute, lock" },
            '6': { title: "ɪᴍᴀɢɪɴᴇ", list: "anime, imagine, wallpaper, removebg, couplepp, hug, kiss" },
            '7': { title: "ʟᴏɢᴏ", list: "3dpaper, blackpink, neonlight, pornhub, hacker, luxury" },
            '8': { title: "ᴍᴀɪɴ", list: "alive, ping, repo, system, version, uptime, owner" },
            '9': { title: "ᴏᴛʜᴇʀ", list: "date, ssweb, tempmail, vcc, webinfo, calculate" },
            '10': { title: "ᴏᴡɴᴇʀ", list: "block, broadcast, ban, setsudo, update, shutdown" },
            '11': { title: "sᴇᴀʀᴄʜ", list: "lyrics, news, weather, yts, githubstalk, country" },
            '12': { title: "sᴇᴛᴛɪɴɢ", list: "mode, setprefix, welcome, auto-seen, antilink, anticall" }
        };

        const handler = async (update) => {
            const receivedMsg = update.messages[0];
            if (!receivedMsg?.message) return;

            const text = (receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text || "").trim();
            const isReply = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === menuMsg.key.id;

            if (isReply && menuData[text]) {
                const choice = menuData[text];
                const subMenu = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ${choice.title} 」*

┌───────────────────┐
${choice.list.split(', ').map(cmd => `  ‣ ${cmd}`).join('\n')}
└───────────────────┘

> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

                await conn.sendMessage(from, { react: { text: '⚡', key: receivedMsg.key } });
                await conn.sendMessage(from, {
                    image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/brlkte.jpg' },
                    caption: subMenu,
                    contextInfo: cleanContext(sender)
                }, { quoted: receivedMsg });
            }
        };

        conn.ev.on("messages.upsert", handler);
        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000);

    } catch (e) {
        reply("❌ *ᴍᴇɴᴜ sʏsᴛᴇᴍ ᴇʀʀᴏʀ.*");
    }
});