import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Client } from '@line/bot-sdk';

// Synology C2 Object Storage configuration
const s3Client = new S3Client({
  region: 'us-003',
  endpoint: 'https://us-003.s3.synologyc2.net',
  credentials: {
    accessKeyId: process.env.accessKeyId as string,
    secretAccessKey: process.env.secretAccessKey as string
  },
  forcePathStyle: false
});

const BUCKET_NAME = '10aaunt';

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

        // Upload to Synology C2 Object Storage
        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: `images/${messageId}.jpg`,
          Body: imageBuffer,
          ContentType: 'image/jpeg',
          ACL: 'public-read' as const
        });

        await s3Client.send(command);

        const fileURL = `https://us-003.s3.synologyc2.net/${BUCKET_NAME}/images/${messageId}.jpg`;
        console.log('S3 Upload:', fileURL);
        resolve(fileURL);
      });
    });
  });
}
