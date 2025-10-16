import { v2 as cloudinary } from 'cloudinary';
import { Client } from '@line/bot-sdk';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function getFileURL(
  messageId: string,
  client: Client
): Promise<string> {
  return await client.getMessageContent(messageId).then((stream) => {
    return new Promise(function (resolve) {
      const chunks: Buffer[] = [];
      stream.on('data', async (chunk: Buffer) => {
        chunks.push(chunk);
      });
      stream.on('error', (err: Error) => {
        console.log(err);
        // error handling
      });
      stream.on('end', async () => {
        const imageBuffer = Buffer.concat(chunks as Uint8Array[]);
        const base64Image = imageBuffer.toString('base64');
        const now = new Date();
        const timestamp =
          now.getFullYear() +
          String(now.getMonth() + 1).padStart(2, '0') +
          String(now.getDate()).padStart(2, '0') +
          String(now.getHours()).padStart(2, '0') +
          String(now.getMinutes()).padStart(2, '0') +
          String(now.getSeconds()).padStart(2, '0');

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${base64Image}`,
          {
            folder: 'images',
            public_id: timestamp,
            resource_type: 'image'
          }
        );

        const fileURL = result.secure_url;
        console.log('Cloudinary Upload:', fileURL);
        resolve(fileURL);
      });
    });
  });
}
