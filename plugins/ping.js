import config from '../../config.cjs';
import { performance } from 'perf_hooks'; // Assuming Node.js environment for performance

const ping = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "ping") {
    // 1. Capture the exact time the command is initiated.
    const commandTime = new Date();

    const start = performance.now();
    await m.React('⏳');

    await sock.sendPresenceUpdate('composing', m.from);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await sock.sendPresenceUpdate('paused', m.from);

    const end = performance.now();
    const responseTime = Math.round(end - start);

    const text = `
╭━━━〔 *PONG!* 〕━━━╮
┃ ⚡ *Status:* Online
┃ ⏱️ *Response:* ${responseTime} ms
┃ ${getFancyMessage()}
╰━━━━━━━━━━━━━━╯
    `.trim();

    let profilePic;
    try {
      // Fetch the profile picture of the sender
      profilePic = await sock.profilePictureUrl(m.sender, 'image');
    } catch (err) {
      // Fallback image if profile pic isn't available
      profilePic = 'https://i.ibb.co/7yzjwvJ/default.jpg';
    }

    // The new WhatsApp Channel Link provided by the user.
    const whatsappChannelLink = 'https://whatsapp.com/channel/0029VbAc4VmEQIaizBLCuC0M';

    // 2. Format the captured time into a readable string for display.
    const formattedTime = commandTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formattedDate = commandTime.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });

    // Send the message with image, caption, and enhanced contextInfo
    await sock.sendMessage(m.from, {
      image: { url: profilePic },
      caption: text
    }, {
      // The 'quoted' option is used to reply to a specific message.
      quoted: m,
      contextInfo: {
        // Existing externalAdReply structure
        externalAdReply: {
          title: "ꊼεɸƞ-ꊼԵεϲཏ ႪɸԵ", 
          // 3. Update the 'body' to show the dynamic timestamp.
          body: `Commanded on: ${formattedDate} at ${formattedTime}`, // Body text for the ad reply
          thumbnailUrl: 'https://files.catbox.moe/6g5aq0.jpg',
          sourceUrl: whatsappChannelLink,
          mediaType: 1,
          renderLargerThumbnail: false,
        },
        // Added context information as requested by the user
        mentionedJid: [m.sender], 
        forwardingScore: 999,      
        isForwarded: true,         
        forwardedNewsletterMessageInfo: { 
          newsletterJid: '120363369453603973@newsletter',
          newsletterName: "ꊼεɸƞ-ꊼԵεϲཏ",
          serverMessageId: 143
        }
      }
    });
  }
}

// Helper function to get a random fancy message for variety.
function getFancyMessage() {
  const messages = [
    "⚡ Zooming through the wires!",
    "💨 Too fast to catch!",
    "🚀 Full throttle response!",
    "✨ Lightning mode activated!",
    "🌐 Instant like magic!",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

export default ping;
