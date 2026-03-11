const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pindl",
    alias: ["pinterest", "pin", "pins"],
    desc: "Download or search Pinterest media",
    category: "download",
    react: "📌",
    filename: __filename
}, async (conn, mek, m, { args, from, reply, sender }) => {
    try {
        if (!args[0]) {
            return reply('⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴘɪɴᴛᴇʀᴇsᴛ ᴜʀʟ ᴏʀ ᴋᴇʏᴡᴏʀᴅ.*');
        }

        const input = args.join(" ");
        const isUrl = input.includes('pinterest.com') || input.includes('pin.it');
        
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        if (isUrl) {
            // --- DIRECT DOWNLOAD LOGIC ---
            const encodedUrl = encodeURIComponent(input);
            const apis = [
                `https://api-aswin-sparky.koyeb.app/api/downloader/pin?url=${encodedUrl}`,
                `https://api.giftedtech.web.id/api/download/pinterestdl?apikey=gifted&url=${encodedUrl}`,
                `https://api.siputzx.my.id/api/s/pinterest?query=${encodedUrl}`
            ];

            let data = null;
            for (const api of apis) {
                try {
                    const res = await axios.get(api);
                    if (res.data.status || res.data.success) {
                        data = res.data.data || res.data.result;
                        break;
                    }
                } catch (e) { console.log("Fallback to next API..."); }
            }

            if (!data) return reply("❌ *ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ᴍᴇᴅɪᴀ ꜰʀᴏᴍ ᴛʜɪs ᴜʀʟ.*");

            // Extracting Media
            const title = data.title || 'Pinterest Media';
            let mediaUrl, type;

            if (data.media_urls) { // Aswin API structure
                const video = data.media_urls.find(v => v.type === 'video');
                mediaUrl = video ? video.url : data.media_urls[0].url;
                type = video ? 'video' : 'image';
            } else if (data.media) { // Gifted API structure
                const video = data.media.find(m => m.type.includes('video'));
                mediaUrl = video ? video.download_url : data.media[0].download_url;
                type = video ? 'video' : 'image';
            }

            const caption = `*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴘɪɴᴛᴇʀᴇsᴛ ᴅʟ 」*\n\n┌───────────────────┐\n  📌 *ᴛɪᴛʟᴇ:* ${title}\n  📁 *ᴛʏᴘᴇ:* ${type.toUpperCase()}\n  👤 *ʙʏ:* @${sender.split('@')[0]}\n└───────────────────┘\n\n> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

            await conn.sendMessage(from, { 
                [type]: { url: mediaUrl }, 
                caption, 
                contextInfo: { mentionedJid: [sender] } 
            }, { quoted: mek });

        } else {
            // --- SEARCH LOGIC (First 5 Results) ---
            const searchRes = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(input)}`);
            
            if (!searchRes.data.status || !searchRes.data.data.length) {
                return reply("❌ *ɴᴏ ʀᴇsᴜʟᴛs ꜰᴏᴜɴᴅ ꜰᴏʀ ᴛʜɪs ᴋᴇʏᴡᴏʀᴅ.*");
            }

            const pins = searchRes.data.data.slice(0, 5);
            await reply(`🔍 *sᴇᴀʀᴄʜɪɴɢ:* ${input}\n📤 *sᴇɴᴅɪɴɢ ᴛᴏᴘ 5 ʀᴇsᴜʟᴛs...*\n\n> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);

            for (const pin of pins) {
                const mediaUrl = pin.video_url || pin.image_url;
                const type = pin.video_url ? 'video' : 'image';
                
                const searchCaption = `*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ᴘɪɴᴛᴇʀᴇsᴛ sᴇᴀʀᴄʜ 」*\n\n📝 *ᴛɪᴛʟᴇ:* ${pin.grid_title || 'No Title'}\n👤 *ᴘɪɴɴᴇʀ:* ${pin.pinner?.username || 'Unknown'}\n\n> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

                await conn.sendMessage(from, { [type]: { url: mediaUrl }, caption: searchCaption }, { quoted: mek });
                await new Promise(res => setTimeout(res, 1500)); // Delay to prevent spam
            }
        }

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('❌ *ᴀɴ sʏsᴛᴇᴍ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ.*');
    }
});