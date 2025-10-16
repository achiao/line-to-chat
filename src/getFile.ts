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
        console.log(
          process.env.CLOUDINARY_CLOUD_NAME,
          process.env.CLOUDINARY_API_KEY,
          process.env.CLOUDINARY_API_SECRET
        );
        const imageBuffer = Buffer.concat(chunks as Uint8Array[]);
        const base64Image = imageBuffer.toString('base64');
        console.log('base64Image: ', base64Image);
        const now = new Date();
        const timestamp =
          now.getFullYear() +
          String(now.getMonth() + 1).padStart(2, '0') +
          String(now.getDate()).padStart(2, '0') +
          String(now.getHours()).padStart(2, '0') +
          String(now.getMinutes()).padStart(2, '0') +
          String(now.getSeconds()).padStart(2, '0');

        // Upload to Cloudinary
        let result;
        try {
          result = await cloudinary.uploader.upload(base64Image, {
            folder: 'images',
            public_id: timestamp,
            resource_type: 'image'
          });
        } catch (error) {
          console.error('Cloudinary Upload Error:', error);
          return resolve(''); // or handle the error as needed
        }

        const fileURL = result.secure_url;
        console.log('Cloudinary Upload:', fileURL);
        resolve(fileURL);
      });
    });
  });
}
