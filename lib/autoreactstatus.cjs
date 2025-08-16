// lib/autoreactstatus.cjs

/**
 * A list of emojis to use for reacting to status updates.
 * You can customize this list.
 */
const statusReactEmojis = [
    '❤️', '😂', '👍', '🎉', '🔥', '🤔', '🙏', '💯', '😮', '😊',
    '😢', '🚀', '✨', '💀', '🤖', '✅', '😎', '🙌', '👀', '🤯'
];

/**
 * Reacts to a WhatsApp status update with a random emoji from the predefined list.
 *
 * @param {object} Matrix - The WhatsApp socket connection object.
 * @param {object} mek - The message object representing the status update.
 */
async function doStatusReact(Matrix, mek) {
    // Basic validation to ensure necessary objects and properties are present.
    if (!Matrix || !mek || !mek.key || !mek.key.remoteJid) {
        console.error("doStatusReact: Invalid arguments or message key provided. Cannot react to status.");
        return;
    }

    // Select a random emoji from the list.
    const randomEmoji = statusReactEmojis[Math.floor(Math.random() * statusReactEmojis.length)];

    try {
        // Send a reaction message to the status update.
        await Matrix.sendMessage(mek.key.remoteJid, {
            react: {
                text: randomEmoji, // The emoji to react with.
                key: mek.key,     // The key of the message (status update) to react to.
            },
        });
        console.log(`✅ Successfully reacted to status in ${mek.key.remoteJid} with: ${randomEmoji}`);
    } catch (error) {
        console.error("❌ Failed to react to status message:", error);
    }
}

// Export the function so it can be imported and used in other files.
module.exports = {
    doStatusReact
};
