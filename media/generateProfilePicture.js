import Jimp from 'jimp';
import fs from 'fs/promises'; 
import path from 'path'; // Black-Tappy to pathe{modified}

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const generateProfilePictureWithWatermark = async (buffer) => {
  try {
    const jimp = await Jimp.read(buffer);
    const min = jimp.getWidth();
    const max = jimp.getHeight();
    const cropped = jimp.crop(0, 0, min, max);

    // Generate a random number between 1 and 5
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    // Construct the watermark filename
    const watermarkFileName = `blacktappy${randomNumber}.jpg`;
    // Ensure the watermark path is correct
    const watermarkPath = path.resolve(__dirname, watermarkFileName);

    // Check if watermark file exists
    try {
      await fs.access(watermarkPath);
    } catch (error) {
      throw new Error(`Watermark file not found at ${watermarkPath}. Original error: ${error.message}`);
    }

    const watermarkBuffer = await fs.readFile(watermarkPath);
    const watermark = await Jimp.read(watermarkBuffer);

    // Resize the watermark to a larger size
    watermark.scaleToFit(200, 200); // Increase the size here

    // Calculate the position to place the watermark (bottom left corner)
    const x = 10;
    const y = cropped.bitmap.height - watermark.bitmap.height - 10;

    // Composite the watermark onto the profile picture
    cropped.composite(watermark, x, y);

    // Scale the profile picture to fit within 720x720
    const scaledImg = await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG);

    return {
      img: scaledImg,
      preview: scaledImg, 
    };
  } catch (error) {
    console.error('Error generating profile picture with watermark:', error);
    throw error;
  }
};

export default generateProfilePictureWithWatermark;
