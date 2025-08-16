// Import the Axios library for making HTTP requests and the bot's configuration file.
import axios from 'axios';
import config from '../../config.cjs';
const playHandler = async (message, socket) => {
  try {
    // 1. --- Initial Validation ---
    // Ensure the message and socket objects are valid.
    if (!message?.from || !message?.body || !socket) {
      console.error("Invalid message or socket object received.");
      return;
    }

    // 2. --- Command Parsing ---
    // Get the command prefix from the config file, or use '!' as a default.
    const prefix = config.PREFIX || '!';
    const body = message.body || '';

    // Ignore messages that don't start with the prefix.
    if (!body.startsWith(prefix)) {
      return;
    }

    // Extract the command and the query from the message body.
    // e.g., "!play Never Gonna Give You Up" -> command: "play", query: "Never Gonna Give You Up"
    const command = body.slice(prefix.length).split(" ")[0].toLowerCase();
    const songQuery = body.slice(prefix.length + command.length).trim();

    // 3. --- Command Alias Check ---
    // Define aliases for the play command.
    const commandAliases = ["sing", "ytmp3", "song", "audio", "play", 'p'];
    if (!commandAliases.includes(command)) {
      return; // If the command is not a valid alias, do nothing.
    }

    // 4. --- Query Validation ---
    // Check if a song name was provided. If not, send a usage guide.
    if (!songQuery) {
      const usageMessage = {
        text: "🎶 Oops! Please provide a song name or artist! 💖"
      };
      await socket.sendMessage(message.from, usageMessage, { quoted: message });
      // React to the message with an 'X' emoji to indicate an error.
      if (typeof message.React === "function") {
        await message.React('❌');
      }
      return;
    }

    // React with a '⏳' emoji to indicate processing has started.
    if (typeof message.React === "function") {
      await message.React('⏳');
    }

    // 5. --- API Interaction ---
    try {
      // Construct the API URL to search for the song on YouTube.
      const apiUrl = `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(songQuery)}`;
      const apiResponse = await axios.get(apiUrl);
      const apiData = apiResponse.data;

      // If the API doesn't return a valid download URL, inform the user.
      if (!apiData?.result?.download?.url) {
        const notFoundMessage = {
          text: "❌ Uh-oh! No results found for that song! 😔"
        };
        await socket.sendMessage(message.from, notFoundMessage, { quoted: message });
        if (typeof message.React === "function") {
          await message.React('❌');
        }
        return;
      }

      // 6. --- Message Sending ---
      // Extract song metadata from the API response.
      const {
        title,
        url: youtubeUrl,
        image: thumbnailUrl,
        timestamp: duration,
        views,
        author
      } = apiData.result.metadata;

      const downloadUrl = apiData.result.download.url;

      // First, send a message with the song details and thumbnail.
      const detailsMessage = {
        image: { url: thumbnailUrl },
        caption: `╭─❍「 ᴍᴜsɪᴄ ᴅᴇᴛᴀɪʟs 」❍\n│  🎵 *Title:* ${title}\n│  ⌛ *Duration:* ${duration}\n│  👁 *Views:* ${views.toLocaleString()}\n│  🤴 *Artist:* ${author.name}\n╰───────────────━⊷\nᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙʟᴀᴄᴋ-ᴛᴀᴘᴘʏ`,
        contextInfo: {
          externalAdReply: {
            title: title,
            body: "ᴘʟᴀʏɪɴɢ ᴠɪᴀ xᴇᴏɴ-xᴛᴇᴄʜ ʙᴏᴛ",
            thumbnailUrl: thumbnailUrl,
            sourceUrl: youtubeUrl,
            mediaType: 1, // 1 for video links
            renderLargerThumbnail: false
          }
        }
      };
      await socket.sendMessage(message.from, detailsMessage, { quoted: message });

      // Second, send the actual audio file.
      const audioMessage = {
        audio: { url: downloadUrl },
        mimetype: "audio/mpeg",
        ptt: false, // ptt = Push To Talk (voice note)
        caption: `🎶 *Now Playing:* ${title}\n⌛ *Duration:* ${duration}\n↻ ◁ II ▷ ↺`,
        contextInfo: {
          externalAdReply: {
            title: "xᴇᴏɴ-xᴛᴇᴄʜ ʙʏ ʙʟᴀᴄᴋ-ᴛᴀᴘᴘʏ",
            body: "ᴘʟᴀʏɪɴɢ ɴᴏᴡ ↻ ◁ II ▷ ↺",
            thumbnailUrl: thumbnailUrl,
            sourceUrl: youtubeUrl,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      };
      await socket.sendMessage(message.from, audioMessage, { quoted: message });

      // React with a '🎵' emoji to indicate success.
      if (typeof message.React === "function") {
        await message.React('🎵');
      }

    } catch (apiError) {
      // 7. --- Error Handling (API Level) ---
      console.error("Error in play command API call:", apiError);
      const errorMessageText = apiError.response?.data?.message || "Oh no! Something went wrong!";
      const errorMessage = { text: `❌ ${errorMessageText} 😢` };
      await socket.sendMessage(message.from, errorMessage, { quoted: message });
      if (typeof message.React === "function") {
        await message.React('❌');
      }
    }

  } catch (criticalError) {
    // 8. --- Error Handling (Critical Level) ---
    console.error("Critical error in playHandler:", criticalError);
    const criticalErrorMessage = {
      text: "❌ Uh-oh! An unexpected error occurred! 😣 Try using *song2* as fallback."
    };
    await socket.sendMessage(message.from, criticalErrorMessage, { quoted: message });
    if (typeof message.React === "function") {
      await message.React('❌');
    }
  }
};

export default playHandler;
