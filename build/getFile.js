"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
// Synology C2 Object Storage configuration
const s3Client = new client_s3_1.S3Client({
    region: 'us-003',
    endpoint: 'https://us-003.s3.synologyc2.net',
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey
    },
    forcePathStyle: false
});
const BUCKET_NAME = '10aaunt';
async function getFileURL(messageId, client) {
    return await client.getMessageContent(messageId).then((stream) => {
        return new Promise(function (resolve) {
            const chunks = [];
            stream.on('data', async (chunk) => {
                chunks.push(chunk);
            });
            stream.on('error', (err) => {
                console.log(err);
                // error handling
            });
            stream.on('end', async () => {
                const imageBuffer = Buffer.concat(chunks);
                // Upload to Synology C2 Object Storage
                const command = new client_s3_1.PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: `images/${messageId}.jpg`,
                    Body: imageBuffer,
                    ContentType: 'image/jpeg',
                    ACL: 'public-read'
                });
                await s3Client.send(command);
                const fileURL = `https://us-003.s3.synologyc2.net/${BUCKET_NAME}/images/${messageId}.jpg`;
                console.log('S3 Upload:', fileURL);
                resolve(fileURL);
            });
        });
    });
}
exports.default = getFileURL;
