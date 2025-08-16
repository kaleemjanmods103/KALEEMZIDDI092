import axios from 'axios';
import config from '../../config.cjs';

const sessionGen = async (m, sock) => {
  // Define the WhatsApp channel link for contextual information.
  const whatsappChannelLink = 'https://whatsapp.com/channel/0029VasHgfG4tRrwjAUyTs10';

  const prefix = config.PREFIX;
.
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();
  const senderName = m.pushName || 'User';

  // If the command is not 'pair', exit the function.
  if (cmd !== 'pair') {
    return;
  }

  if (!text || !/^\+?\d{9,15}$/.test(text)) {
    // Send an error message with an example format if the input is invalid.
    await sock.sendMessage(m.from, {
      text: `🔴 *Invalid Format!*\n\n🟢 Example: *.pair +254759000340*`,
      contextInfo: {
        forwardingScore: 5, 
        isForwarded: true, 
        forwardedNewsletterMessageInfo: {
          newsletterName: "𝐗ҽσɳ-𝐗ƚҽƈ𝐡",
          newsletterJid: "120363369453603973@newsletter",
        },
        // An external ad reply structure, often used for rich previews or branding.
        externalAdReply: {
          title: "xᴇᴏɴ-xᴛᴇᴄʜ ʙᴏᴛ",
          body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙʟᴀᴄᴋ-ᴛᴀᴘᴘʏ",
          thumbnailUrl: 'https://files.catbox.moe/6g5aq0.jpg', 
          sourceUrl: whatsappChannelLink, 
          mediaType: 1, 
          renderLargerThumbnail: false, 
        },
      },
    }, { quoted: m }); // Reply to the original message.
    return;
  }

  try {
    // Make an API call to generate the pairing code for the provided phone number.
    const response = await axios.get(`https://xeon-xtech-pair-case.onrender.com/pair?number=${encodeURIComponent(text)}`);
    // Expecting the API to return JSON with a 'code' property.
    const { code } = response.data;
    if (!code) {
      // Throw an error if the API response does not contain a 'code'.
      throw new Error("😕 No code returned from the server.");
    }

    // Send a success message with the generated pairing code and an image.
    await sock.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/8k0enh.jpg' }, // Image URL for the success message.
      caption: `🟢 *Pairing Code Generated!*\n\n👤 Number: ${text}\n🔐 Code: *${code}*\n\nUse this on your bot plugins or CLI to connect the number.`, // Caption text for the message.
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "ꊼεɸƞ-ꊼԵεϲཏ𝐡",
          newsletterJid: "120363369453603973@newsletter",
        },
        externalAdReply: {
          title: "ꊼεɸƞ-ꊼԵεϲཏ ႪɸԵ",
          body: "Powered By Black-Tappy",
          thumbnailUrl: 'https://files.catbox.moe/6g5aq0.jpg',
          sourceUrl: whatsappChannelLink,
          mediaType: 1,
          renderLargerThumbnail: false,
        },
      },
    }, { quoted: m }); // Reply to the original message.

  } catch (err) {
    // Log the error for server-side debugging.
    console.error(`Error generating pairing code: ${err.message}`);

    // Send an error message to the user, including an image and detailed reason.
    await sock.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/8k0enh.jpg' }, // Image URL for the error message.
      caption: `🔴 *Failed to generate pairing code.*\n\nReason: ${err.response?.data?.error || err.message || 'An unknown error occurred.'}`, // Text content for the error message.
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          // Note: The newsletter name here differs from the success message.
          newsletterName: "ꊼεɸƞ-ꊼԵεϲཏ",
          newsletterJid: "120363369453603973@newsletter",
        },
        externalAdReply: {
          title: "ꊼεɸƞ-ꊼԵεϲཏ ႪɸԵ",
          body: "Powered By Black-Tappy",
          thumbnailUrl: 'https://files.catbox.moe/6g5aq0.jpg',
          sourceUrl: whatsappChannelLink,
          mediaType: 1,
          renderLargerThumbnail: false,
        },
      },
    }, { quoted: m }); // Reply to the original message.
  }
};

// Export the sessionGen function as the default export for the module.
export default sessionGen;
