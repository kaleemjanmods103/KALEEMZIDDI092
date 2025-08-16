import axios from 'axios';
import config from '../../config.cjs';

/**
 * Handles the screenshot command '!ss'.
 * Captures a screenshot of a given URL and sends it as an image.
 * [[1]](https://docs.wwebjs.dev/Message.html)[[2]](https://docs.wwebjs.dev/Client.html)
 * @param {object} m The message object from the WhatsApp client.
 * @param {object} gss The WhatsApp client instance used to send messages.
 */
const screenshotCommand = async (m, gss) => {
  // Retrieve the command prefix from the configuration
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  // Only proceed if the command is 'ss'
  if (cmd === 'ss') {
    // Define the source URL for the rich reply.
    const whatsappChannelLink = 'https://whatsapp.com/channel/your-channel-link';

    const url = m.body.split(" ").slice(1).join(" ");

    // Validate if a URL was provided
    if (!url) {
      await gss.sendMessage(
        m.from,
        { text: "Please provide a valid URL after the command. Example: *!ss https://google.com*" },
        { quoted: m }
      );
      return;
    }

    // Construct the API URL for the screenshot service
    const ssApiUrl = `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}`;

    try {
      // Show a "processing" message to the user
      await gss.sendMessage(
        m.from,
        { text: "Capturing screenshot, please wait..." },
        { quoted: m }
      );

      // Make an API call to get the screenshot image data
      const response = await axios.get(ssApiUrl, { responseType: "arraybuffer" });

      // Check for a valid response
      if (!response || response.status !== 200) {
        console.error('API Response Error:', response);
        await gss.sendMessage(
          m.from,
          { text: "Unable to capture screenshot for the given URL. Please check the link and try again." },
          { quoted: m }
        );
        return;
      }

      // Send the screenshot image with the rich external ad reply and added context information
      await gss.sendMessage(
        m.from,
        {
          image: Buffer.from(response.data, "binary"),
          caption: `*Screenshot captured successfully!*\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙʟᴀᴄᴋ-ᴛᴀᴘᴘʏ*`,
        },
        {
          quoted: m,
          contextInfo: {
            externalAdReply: {
              title: "ꊼεɸƞ-ꊼԵεϲཏ ႪɸԵ",
              body: "Powered By Black-Tappy",
              thumbnailUrl: 'https://files.catbox.moe/6g5aq0.jpg',
              sourceUrl: whatsappChannelLink, // Using the defined whatsappChannelLink
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
        }
      );
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Screenshot Command Error:', error.message || error);

      // Send a user-friendly error message
      await gss.sendMessage(
        m.from,
        { text: "Failed to capture a screenshot. The API might be down or the URL is invalid. Please try again later." },
        { quoted: m }
      );
    }
  }
};

export default screenshotCommand;
