import pkg from '@whiskeysockets/baileys';
const { downloadMediaMessage } = pkg;
import config from '../../config.cjs';

// Placeholder for the WhatsApp channel link. Replace with an actual link if available.
const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10'; 

const OwnerCmd = async (m, Matrix) => {
  const botNumber = Matrix.user.id.split(':')[0] + '@s.whatsapp.net';
  const ownerNumber = config.OWNER_NUMBER + '@s.whatsapp.net';
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const isOwner = m.sender === ownerNumber;
  const isBot = m.sender === botNumber;

  if (!['vv', 'vv2', 'vv3'].includes(cmd)) return;
  if (!m.quoted) return m.reply('*Reply to a View Once message!*');

  let msg = m.quoted.message;
  if (msg.viewOnceMessageV2) msg = msg.viewOnceMessageV2.message;
  else if (msg.viewOnceMessage) msg = msg.viewOnceMessage.message;

  if (!msg) return m.reply('*This is not a View Once message!*');

  // VV2 & VV3 only for Owner/Bot
  if (['vv2', 'vv3'].includes(cmd) && !isOwner && !isBot) {
    return m.reply('*Only the owner or bot can use this command!*');
  }

  // Restrict VV command to owner or bot
  if (cmd === 'vv' && !isOwner && !isBot) {
    return m.reply(' *Only the owner or bot can use this command to send media!*');
  }

  try {
    const messageType = Object.keys(msg)[0];
    let buffer;
    if (messageType === 'audioMessage') {
      buffer = await downloadMediaMessage(m.quoted, 'buffer', {}, { type: 'audio' });
    } else {
      buffer = await downloadMediaMessage(m.quoted, 'buffer');
    }

    if (!buffer) return m.reply(' *Failed to retrieve media!*');

    let mimetype = msg.audioMessage?.mimetype || 'audio/ogg';
    let caption = ` *ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ᴠɪᴇᴡ ᴏɴᴄᴇ ʙʏ xᴇᴏɴ-xᴛᴇᴄʜ*`;

    let recipient;
    if (cmd === 'vv') {
      recipient = m.from; // Same chat, restricted to Owner/Bot only
    } else if (cmd === 'vv2') {
      recipient = botNumber; // ✅ Bot inbox
    } else if (cmd === 'vv3') {
      recipient = ownerNumber; // ✅ Owner inbox
    }

    // Define the common options to be added to all sendMessage calls
    const commonMessageOptions = {
      mentionedJid: [m.sender], 
      forwardingScore: 999,      
      isForwarded: true,         
      forwardedNewsletterMessageInfo: { 
        newsletterJid: '120363369453603973@newsletter',
        newsletterName: "ꊼεɸƞ-ꊼԵεϲཏ",
        serverMessageId: 143
      },
      externalAdReply: { 
        title: "ꊼεɸƞ-ꊼԵεϲཏ ႪɸԵ",
        body: "Powered By Black-Tappy",
        thumbnailUrl: 'https://files.catbox.moe/6g5aq0.jpg',
        sourceUrl: whatsappChannelLink, 
        mediaType: 1,
        renderLargerThumbnail: false, 
      },
    };

    if (messageType === 'imageMessage') {
      await Matrix.sendMessage(recipient, { 
        image: buffer, 
        caption,
        ...commonMessageOptions // Spread the common options
      });
    } else if (messageType === 'videoMessage') {
      await Matrix.sendMessage(recipient, { 
        video: buffer, 
        caption, 
        mimetype: 'video/mp4',
        ...commonMessageOptions // Spread the common options
      });
    } else if (messageType === 'audioMessage') {  
      await Matrix.sendMessage(recipient, { 
        audio: buffer, 
        mimetype, 
        ptt: true,
        ...commonMessageOptions // Spread the common options
      });
    } else {
      return m.reply('*Unsupported media type!*');
    }

    // No reply to user about the action
  } catch (error) {
    console.error(error);
    await m.reply('*Failed to process View Once message!*');
  }
};

// coded by Black-Tappy 
export default OwnerCmd;
