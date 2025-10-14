import https from 'https';

export default async function sendMessageToChat(
  text = '',
  fileURL = '',
  chatToken = ''
) {
  return new Promise((resolve) => {
    let data = '';
    https.get(
      `https://chat.synology.com/webapi/entry.cgi?api=SYNO.ChatPlus.External&method=incoming&version=1&token=%22${chatToken}%22&payload={"text": "${text}", "file_url": "${fileURL}"}`,
      (res) => {
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(data);
        });
      }
    );
  });
}
