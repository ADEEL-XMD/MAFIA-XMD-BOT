const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

// --- HELPER FOR CLEAN CONTEXT ---
const cleanContext = (sender) => ({
    mentionedJid: [sender],
    forwardingScore: 0,
    isForwarded: false
});

// 1. CHAT OPENAI
cmd({
    pattern: "ai",
    desc: "Chat with an AI model",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react, sender }) => {
    try {
        if (!q) return reply(`⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴍᴇssᴀɢᴇ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);

        const apiUrl = `https://apis.sandarux.sbs/api/ai/chatopenai?apikey=darknero&text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.answer) {
            await react("❌");
            return reply(`❌ *ᴀɪ ꜰᴀɪʟᴇᴅ ᴛᴏ ʀᴇsᴘᴏɴᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);
        }

        const response = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴀɪ ᴄʜᴀᴛ 」*

┌───────────────────┐
${data.answer}
└───────────────────┘
> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        await conn.sendMessage(from, { text: response, contextInfo: cleanContext(sender) }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply(`❌ *ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);
    }
});

// 2. OPENAI (SUPUN API)
cmd({
    pattern: "openai",
    desc: "Chat with OpenAI",
    category: "ai",
    react: "🧠",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react, sender }) => {
    try {
        if (!q) return reply(`⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ǫᴜᴇʀʏ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);

        const apiUrl = `https://supun-md-api-xmjh.vercel.app/api/ai/openai?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.results) {
            await react("❌");
            return reply(`❌ *ᴏᴘᴇɴᴀɪ ꜰᴀɪʟᴇᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);
        }

        const response = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴏᴘᴇɴᴀɪ 」*

┌───────────────────┐
${data.results}
└───────────────────┘
> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        await conn.sendMessage(from, { text: response, contextInfo: cleanContext(sender) }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply(`❌ *ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);
    }
});

// 3. VENICE (MISTRAL 24B)
cmd({
    pattern: "venice",
    desc: "Chat with Venice AI",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react, sender }) => {
    try {
        if (!q) return reply(`⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ǫᴜᴇʀʏ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);

        const apiUrl = `https://malvin-api.vercel.app/ai/venice?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.status || !data?.result) {
            await react("❌");
            return reply(`❌ *ᴠᴇɴɪᴄᴇ ꜰᴀɪʟᴇᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);
        }

        const response = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴠᴇɴɪᴄᴇ ᴀɪ 」*

┌───────────────────┐
${data.result}
└───────────────────┘
> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        await conn.sendMessage(from, { text: response, contextInfo: cleanContext(sender) }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply(`❌ *ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);
    }
});

// 4. COPILOT (STANDARD)
cmd({
    pattern: "copilot",
    desc: "Chat with Copilot",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react, sender }) => {
    try {
        if (!q) return reply(`⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ɪɴᴘᴜᴛ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);

        const apiUrl = `https://malvin-api.vercel.app/ai/copilot?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.status || !data?.result) {
            await react("❌");
            return reply(`❌ *ᴄᴏᴘɪʟᴏᴛ ꜰᴀɪʟᴇᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);
        }

        const response = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴄᴏᴘɪʟᴏᴛ 」*

┌───────────────────┐
${data.result}
└───────────────────┘
⌚ *ᴛɪᴍᴇ:* ${data.response_time}
> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        await conn.sendMessage(from, { text: response, contextInfo: cleanContext(sender) }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply(`❌ *ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);
    }
});

// 5. GPT-5 (COPILOT ENGINE)
cmd({
    pattern: "gpt",
    desc: "Chat with GPT-5 Engine",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react, sender }) => {
    try {
        if (!q) return reply(`⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ǫᴜᴇsᴛɪᴏɴ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);

        const apiUrl = `https://malvin-api.vercel.app/ai/gpt-5?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.status || !data?.result) {
            await react("❌");
            return reply(`❌ *ɢᴘᴛ-5 ꜰᴀɪʟᴇᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);
        }

        const response = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ɢᴘᴛ-5 ᴄᴏʀᴇ 」*

┌───────────────────┐
${data.result}
└───────────────────┘
⌚ *ᴛɪᴍᴇ:* ${data.response_time}
> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        await conn.sendMessage(from, { text: response, contextInfo: cleanContext(sender) }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply(`❌ *ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ.*\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);
    }
});