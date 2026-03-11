const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script"],
    desc: "Fetch Akindu-MD repository information",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply, sender }) => {
    const githubRepoURL = 'https://github.com/Akindu/AKINDU-MD'; 

    try {
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
        const repoData = await response.json();

        // Single Modern Cyber-Grid Style
        const repoStatus = `
*「 ᴀᴋɪɴᴅᴜ-ᴍᴅ : ʀᴇᴘᴏ sᴛᴀᴛs 」*

┌───────────────────┐
  📂 *ɴᴀᴍᴇ:* ${repoData.name}
  👑 *ᴏᴡɴᴇʀ:* ${repoData.owner.login}
  ⭐ *sᴛᴀʀs:* ${repoData.stargazers_count}
  ⑂ *ꜰᴏʀᴋs:* ${repoData.forks_count}
  📅 *ᴜᴘᴅᴀᴛᴇᴅ:* ${new Date(repoData.updated_at).toLocaleDateString()}
├───────────────────┤
  📝 *ᴅᴇsᴄ:* ${repoData.description || 'ᴀɪ ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛ ᴍᴜʟᴛɪ-ᴅᴇᴠɪᴄᴇ'}
  🔗 *ᴜʀʟ:* ${repoData.html_url}
└───────────────────┘

> *ᴀᴋɪɴᴅᴜ-ᴍᴅ*`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/brlkte.jpg' },
            caption: repoStatus,
            contextInfo: { 
                mentionedJid: [sender],
                forwardingScore: 0,
                isForwarded: false,
                externalAdReply: {
                    title: "ᴀᴋɪɴᴅᴜ-ᴍᴅ ᴏꜰꜰɪᴄɪᴀʟ ʀᴇᴘᴏ",
                    body: "ɢᴇᴛ ᴛʜᴇ ʟᴀᴛᴇsᴛ ʙᴏᴛ sᴄʀɪᴘᴛ",
                    mediaType: 1,
                    thumbnailUrl: config.MENU_IMAGE_URL,
                    sourceUrl: repoData.html_url,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Repo Error:", error);
        reply(`❌ *ᴇʀʀᴏʀ:* ${error.message}\n\n*ᴀᴋɪɴᴅᴜ-ᴍᴅ*`);
    }
});