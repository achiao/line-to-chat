"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 3001;
const bot_sdk_1 = require("@line/bot-sdk");
const getFile_1 = __importDefault(require("./getFile"));
const getText_1 = __importDefault(require("./getText"));
const sendMessageToChat_1 = __importDefault(require("./sendMessageToChat"));
const sendMessageToLine_1 = require("./sendMessageToLine");
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.post('/', async function (req) {
    const data = req.body;
    const client = new bot_sdk_1.Client({
        channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
    });
    let userId = '';
    let text = '';
    let fileURL = '';
    data.events.forEach(async (event) => {
        const message = event?.message;
        const type = message?.type;
        userId = event?.source?.userId || '';
        if (!message || !type || userId === '') {
            return;
        }
        if (type === 'text') {
            text += (0, getText_1.default)(message.text) + '\\n';
        }
        else if (type === 'image') {
            const messageId = message.id;
            fileURL = await (0, getFile_1.default)(messageId, client);
        }
    });
    await (0, sendMessageToChat_1.default)(text, fileURL);
    (0, sendMessageToLine_1.sendMessageToLine)(client, userId);
});
app.get('/', function (req, res) {
    res.send('Hello World');
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});