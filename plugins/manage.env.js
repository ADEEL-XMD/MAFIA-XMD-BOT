const { cmd } = require('../command');
const config = require('../config');

// Helper for Boolean Toggles
const handleToggle = async (conn, mek, m, args, configVar, successMsg, failMsg, example, isCreator, reply) => {
    if (!isCreator) return reply("🚫 *ᴏᴡɴᴇʀ ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ!*");
    
    const status = args[0]?.toLowerCase();
    if (status === "on" || status === "off") {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: mek.key } });
        config[configVar] = status === "on" ? "true" : "false";
        
        const gridMsg = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : sᴇᴛᴛɪɴɢ ᴜᴘᴅᴀᴛᴇ 」*

┌───────────────────┐
  ${status === "on" ? "✅" : "❌"} *${successMsg}*
  🔹 *sᴛᴀᴛᴜs:* ${status.toUpperCase()}
└───────────────────┘

> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        await reply(gridMsg);
        return await conn.sendMessage(m.chat, { react: { text: '✅', key: mek.key } });
    } else {
        return reply(`⚠️ *ᴜsᴀɢᴇ:* ${config.PREFIX}${example}`);
    }
};

// --- CORE SETTINGS ---

cmd({
    pattern: "mode",
    alias: ["setmode"],
    react: "🫟",
    desc: "Set bot mode to private or public.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { args, isCreator, reply }) => {
    if (!isCreator) return reply("🚫 *ᴏᴡɴᴇʀ ᴏɴʟʏ!*");
    const mode = args[0]?.toLowerCase();
    if (mode === "private" || mode === "public") {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: mek.key } });
        config.MODE = mode;
        await reply(`*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ 」*\n\n✅ *ʙᴏᴛ ᴍᴏᴅᴇ sᴇᴛ ᴛᴏ:* ${mode.toUpperCase()}`);
        await conn.sendMessage(m.chat, { react: { text: '✅', key: mek.key } });
    } else {
        reply(`📌 *ᴄᴜʀʀᴇɴᴛ ᴍᴏᴅᴇ:* ${config.MODE}\nUsage: .mode public/private`);
    }
});

cmd({
    pattern: "setprefix",
    alias: ["prefix"],
    react: "🔧",
    desc: "Change bot prefix.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { args, isCreator, reply }) => {
    if (!isCreator) return reply("🚫 *ᴏᴡɴᴇʀ ᴏɴʟʏ!*");
    if (!args[0]) return reply("❌ *ᴘʀᴏᴠɪᴅᴇ ᴀ ᴘʀᴇꜰɪx (ᴇ.ɢ. .sᴇᴛᴘʀᴇꜰɪx !)*");
    config.PREFIX = args[0];
    reply(`✅ *ᴘʀᴇꜰɪx ᴄʜᴀɴɢᴇᴅ ᴛᴏ:* ${args[0]}`);
});

// --- TOGGLE COMMANDS ---

cmd({ pattern: "welcome", desc: "Toggle welcome", category: "settings", filename: __filename }, 
async (c, k, m, e) => { await handleToggle(c, k, m, e.args, "WELCOME", "ᴡᴇʟᴄᴏᴍᴇ ᴍᴇssᴀɢᴇs", "", "welcome on/off", e.isCreator, e.reply); });

cmd({ pattern: "auto-typing", desc: "Toggle typing", category: "settings", filename: __filename }, 
async (c, k, m, e) => { await handleToggle(c, k, m, e.args, "AUTO_TYPING", "ᴀᴜᴛᴏ-ᴛʏᴘɪɴɢ", "", "auto-typing on/off", e.isCreator, e.reply); });

cmd({ pattern: "auto-recording", desc: "Toggle recording", category: "settings", filename: __filename }, 
async (c, k, m, e) => { await handleToggle(c, k, m, e.args, "AUTO_RECORDING", "ᴀᴜᴛᴏ-ʀᴇᴄᴏʀᴅɪɴɢ", "", "auto-recording on/off", e.isCreator, e.reply); });

cmd({ pattern: "auto-seen", alias: ["autostatusview"], desc: "Toggle status seen", category: "settings", filename: __filename }, 
async (c, k, m, e) => { await handleToggle(c, k, m, e.args, "AUTO_STATUS_SEEN", "sᴛᴀᴛᴜs ᴀᴜᴛᴏ-ᴠɪᴇᴡ", "", "auto-seen on/off", e.isCreator, e.reply); });

cmd({ pattern: "anti-bad", desc: "Toggle antibad", category: "settings", filename: __filename }, 
async (c, k, m, e) => { await handleToggle(c, k, m, e.args, "ANTI_BAD_WORD", "ᴀɴᴛɪ-ʙᴀᴅ ᴡᴏʀᴅs", "", "anti-bad on/off", e.isCreator, e.reply); });

cmd({ pattern: "antilink", desc: "Toggle antilink", category: "group", filename: __filename }, 
async (c, k, m, e) => { 
    if (!e.isGroup || !e.isBotAdmins || !e.isAdmins) return e.reply("❌ *ᴀᴅᴍɪɴs ᴏɴʟʏ ɪɴ ɢʀᴏᴜᴘs!*");
    await handleToggle(c, k, m, e.args, "ANTI_LINK", "ᴀɴᴛɪ-ʟɪɴᴋ", "", "antilink on/off", true, e.reply); 
});

// --- REPEAT FOR REMAINING (Simplified for brevity) ---
cmd({ pattern: "auto-reply", desc: "Toggle autoreply", category: "settings", filename: __filename }, 
async (c, k, m, e) => { await handleToggle(c, k, m, e.args, "AUTO_REPLY", "ᴀᴜᴛᴏ-ʀᴇᴘʟʏ", "", "auto-reply on/off", e.isCreator, e.reply); });

cmd({ pattern: "auto-react", desc: "Toggle autoreact", category: "settings", filename: __filename }, 
async (c, k, m, e) => { await handleToggle(c, k, m, e.args, "AUTO_REACT", "ᴀᴜᴛᴏ-ʀᴇᴀᴄᴛ", "", "auto-react on/off", e.isCreator, e.reply); });