"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
async function sendMessageToChat(text = '', fileURL = '', chatToken = '') {
    return new Promise((resolve) => {
        let data = '';
        https_1.default.get(`https://chat.synology.com/webapi/entry.cgi?api=SYNO.Chat.External&method=incoming&version=2&token=%22${chatToken}%22&payload={"text": "${text}", "file_url": "${fileURL}"}`, (res) => {
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        });
    });
}
exports.default = sendMessageToChat;
