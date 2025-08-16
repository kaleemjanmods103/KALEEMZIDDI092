import config from '../../config.cjs';
import fetch from 'node-fetch'; // Ensure you have this installed

const repo = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "repo") {
    await m.React('🖇️'); // A gem for a precious repo!
    const repoUrl = 'https://github.com/kaleemjanmods103/KALEEMZIDDI092.git';
    // The imageUrl used for the main message content.
    const imageUrl = 'https://files.catbox.moe/og4tsk.jpg';

    try {
      const apiUrl = `https://github.com/kaleemjanmods103/KALEEMZIDDI092.git`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.forks_count !== undefined && data.stargazers_count !== undefined) {
        // The message content to be sent.
        const stylishMessage = {
          image: { url: imageUrl },
          caption: `
╭───『 KALEEM-XTECH REPO 』───⳹
│
│🚀 *Explore the Innovation Hub!*
│
│ 📦 *Repository*: ${repoUrl}   
│ 👑 *Owner*: Black-Tappy 
│ ⭐ *Stars*: \`${data.stargazers_count}\` 
│ ⑂ *Forks*: \`${data.forks_count}\`  
│ 🔗 *URL*: https://whatsapp.com/channel/0029VbAc4VmEQIaizBLCuC0M
│
│ 📝 *Description*:
│ 🤝 *Join the Community!* 
│   Contribute & Shape the Future!  
│
╰────────────────⳹
> Powered  by Black-Tappy 🩷
`.trim(),
        };

        // Define the WhatsApp Channel link.
        const whatsappChannelLink = 'https://whatsapp.com/channel/0029VbAc4VmEQIaizBLCuC0M';
        const externalAdReply = {
          title: "ꊼεɸƞ-ꊼԵεϲཏ ႪɸԵ", 
          body: "Powered By Black-Tappy", 
          thumbnailUrl: 'https://files.catbox.moe/6g5aq0.jpg', 
          sourceUrl: whatsappChannelLink, 
          mediaType: 1, 
          renderLargerThumbnail: false, 
        };

        // Send the message with the stylishMessage content and the externalAdReply option.
        sock.sendMessage(m.from, stylishMessage, {
            quoted: m,
            externalAdReply: externalAdReply,
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363369453603973@newsletter',
                newsletterName: "ꊼεɸƞ-ꊼԵεϲཏ",
                serverMessageId: 143
            }
        });
      } else {
        sock.sendMessage(m.from, { text: '⚠️ Could not retrieve full repo details. Please try again later. 🥺', quoted: m });
      }
    } catch (error) {
      console.error("Error fetching repo info:", error);
      sock.sendMessage(m.from, { text: '🚨 Error encountered while fetching repo data. 😢', quoted: m });
    } finally {
      await m.React('✅');
    }
  }
};

export default repo;
