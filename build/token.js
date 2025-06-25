"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = void 0;
const node_jose_1 = __importDefault(require("node-jose"));
const privateKey = `
{
  "alg": "RS256",
  "d": "Ap3VKeTMo6B9-iGsOrDDOxfmsL3hyughCI5pNzCJME8seX2F-VldfQQ5ztVZfPhYDeH9PkNYZ19qqdhXc97jDKdK9RZbJxrKInJjgwhpmPvBypflYasLhVFsyYGsaLaxGj-xVduHDwrISf0Xu27uQp-mtlc0EB37yHYob9QcG4kYdm98qndrXck83TVn3yO20xkTGcvpa2ZyJWXjkxZJ_4hOZ6saYO34CFlW_kru6ylWyGe65k4inhiiWaq7IR0q8D9xYOBIpyt-wuUhReVUFneZx-o2wATpgdyZU0HgDDLF6hv4Njql4p5uRRqE1gAU_9Gds5QV4TuEQ4wNiPLSAQ",
  "dp": "MWn5Q8QrXvZS5qUDH1B_VGb6kS_9-Vkk3HwHqFpsG2g4YzDTL7-1-uTPH-ululdh-6h0Dqk1qeaIlmrI6AzBHvD3QWyk9cQgXRarqtWYQhLaPugebE771ZoYDa7NgDNgxQySoibvEw-egWx4dNUst6C7d89ekXyI1Yx9DthyWQE",
  "dq": "dqd07R0DmXjSy_fqrcGfGvQkjAb4-Nlb5O6P8dYcglNIujP9_Ms3YM0oD3UNn9ZJfmevhuoki8FrLKyc4krSms2koyN6n_-J4TSFKbfcp3lzwMjp5Y3r7FqC52gIu2xvnWMFQOa2vzfks9CSUK2RyaC5yl5Y6UyeBv-ZFYCHEAE",
  "e": "AQAB",
  "ext": true,
  "key_ops": [
    "sign"
  ],
  "kty": "RSA",
  "n": "3P80rUe1FULyaSvawYnnFaIGMSQol-dmpY_f3ZsgghwDb5NHSIJuXJKs8NBJrauBobKNAHZVJqUY7wf-6lEC1pq6vQadpjNXPVpS039KV8C-z7UZXQjojQY9y_uZxNpuYYxuSyLXVtyfMex7z_emm9GCVnQPXVzxkX9WajWh-oG_kDG60_dRR6DElpgWvlYq6fkUwziyRdJZC13SGXJ6XFBVgVDLVecUccreRC8-6rrd3Yi2nELgmfNcrZejd5cwO0TwG_pBVbBv1qpK5jlgfrkxB2ihdrpXxvqLX83-7O6ImwlQv7RXNHD8AHhWze3mpuUpI6Bc5qcqgu2Cgn5bIQ",
  "p": "_h12ZIxv6Ykd_ZZ0HVIXj6JzOjnWFVsVKkhmS5J9dyr74-a8rUvOZSNlLV-7VuHf66PALt7SQxj1fjg7hF9SCGYCnogVQt_SYn3Yf01cPKXFihdotOZKVkGFDsL_LSzbC__VOjS8OS8eEopnMpLp62D3VTrI5WK34tvk6Hy6xCE",
  "q": "3qLa-eqLezlvUvz_7J-UylBxhLdyVjXckm3q5PR-1JvQuMsN1_YQCWoxspStPkyHPxmMtqjz2OAnRXsWCeg66SJbH9bwbbjFuOw6YzA-ngHXYeVXPM2VtirMTE44UJosZmVXKQPPBlKWMPCuvb3gveDUzwp2B4u41_5b3BGQtwE",
  "qi": "Uzp_st2JgntzIjRATbNqGu7HgxH-e5M9WqH8LAfY96cnaCzHZiviK2Ao4lmhet5WSIJ6LnmvFBFuzUW8ms2xfaKLQBDjsNAwLIadOR9D40dVMTSPMjzyfryNVa0coG07k-zonIoIfTFFTdeXGABosgsnXnmf5hqy5K2gutIS-B4"
}
`;
const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: '09f50876-1c19-47de-8567-683cd85d5e18'
};
const payload = {
    iss: '1661488720',
    sub: '1661488720',
    aud: 'https://api.line.me/',
    exp: Math.floor(new Date().getTime() / 1000) + 60 * 30,
    token_exp: 60 * 60 * 24 * 30
};
async function getAccessToken() {
    try {
        const result = await node_jose_1.default.JWS.createSign({ format: 'compact', fields: header }, JSON.parse(privateKey))
            .update(JSON.stringify(payload))
            .final();
        console.log(result);
        return result;
    }
    catch (error) {
        console.error(error);
    }
}
exports.getAccessToken = getAccessToken;
