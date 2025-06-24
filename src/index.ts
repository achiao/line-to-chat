import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3001;
import { Client } from '@line/bot-sdk';
import getFileURL from './getFile';
import getText from './getText';
import sendMessageToChat from './sendMessageToChat';
import { sendMessageToLine } from './sendMessageToLine';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', async function (req) {
  const data = req.body;
  console.log('Line: ', data);
  let channelAccessToken = '';
  let chatToken = '';
  console.log('process.env.LINE_BOT_10F', process.env.LINE_BOT_10F);
  if (data.destination === process.env.LINE_BOT_7F) {
    channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN_7F!;
    chatToken = process.env.CHAT_TOKEN_7F!;
  } else if (data.destination === process.env.LINE_BOT_10F) {
    channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN_10F!;
    chatToken = process.env.CHAT_TOKEN_10F!;
  } else if (data.destination === process.env.LINE_BOT_DEV) {
    channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN_DEV!;
    chatToken = process.env.CHAT_TOKEN_DEV!;
  } else if (data.destination === process.env.LINE_BOT_11F) {
    channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN_11F!;
    chatToken = process.env.CHAT_TOKEN_11F!;
  } else {
    return;
  }
  console.log('channelAccessToken: ', channelAccessToken);
  console.log('chatToken: ', chatToken);
  const client = new Client({
    channelAccessToken
  });
  console.log('create client');
  let userId = '';
  let text = '';
  let fileURL = '';
  for (const event of data.events) {
    const message = event?.message;
    const type = message?.type;
    userId = event?.source?.userId || '';
    if (!message || !type || userId === '') {
      return;
    }

    if (type === 'text') {
      text += getText(message.text) + '\\n';
    } else if (type === 'image') {
      const messageId = message.id;
      fileURL = await getFileURL(messageId, client);
    }
  }
  console.log('get text or file', text, fileURL);
  await sendMessageToChat(text, fileURL, chatToken);
  console.log('send message to chat');
  sendMessageToLine(client, userId);
  console.log('send message to line');
});

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
