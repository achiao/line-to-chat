"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
// Cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
async function getFileURL(messageId, client) {
    return await client.getMessageContent(messageId).then((stream) => {
        return new Promise(function (resolve) {
            const chunks = [];
            stream.on('data', (chunk) => {
                chunks.push(chunk);
            });
            stream.on('error', (err) => {
                console.log(err);
                // error handling
            });
            stream.on('end', async () => {
                console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);
                const imageBuffer = Buffer.concat(chunks);
                const base64Image = imageBuffer.toString('base64');
                console.log('base64Image: ', base64Image);
                // Upload to Cloudinary
                let result;
                try {
                    result = await cloudinary_1.v2.uploader.upload(`data:image/jpeg;base64,${base64Image}`, {
                        resource_type: 'image'
                    });
                }
                catch (error) {
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
exports.default = getFileURL;
