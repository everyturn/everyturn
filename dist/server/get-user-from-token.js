"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const jws_1 = require("jws");
const JwksClient_1 = require("jwks-rsa/lib/JwksClient");
const util_1 = require("util");
const jsonwebtoken_1 = require("jsonwebtoken");
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const jwksClient = new JwksClient_1.JwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://amitport.auth0.com/.well-known/jwks.json'
});
jwksClient.asyncGetSigningKey = util_1.promisify(jwksClient.getSigningKey);
const asyncVerifyToken = util_1.promisify(jsonwebtoken_1.verify);
async function getUserFromToken(token) {
    // just get the header
    const decoded = jws_1.decode(token);
    if (!decoded || !decoded.header) {
        throw new Error('Invalid token');
    }
    const { alg, kid } = decoded.header;
    if (alg !== 'RS256') {
        throw new Error('Missing / invalid token algorithm');
    }
    // get auth0 public key for verifying the access_token
    const jwk = await jwksClient.asyncGetSigningKey(kid);
    const auth0PublicKey = jwk.publicKey || jwk.rsaPublicKey;
    if (!auth0PublicKey) {
        throw new Error('Secret not provided');
    }
    // verify user is allowed access to https://api.turn-based.com
    await asyncVerifyToken(token, auth0PublicKey, {
        audience: 'https://api.turn-based.com',
        issuer: 'https://amitport.auth0.com/',
        algorithms: ['RS256']
    });
    return request_promise_native_1.default({
        uri: 'https://amitport.auth0.com/userinfo',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        json: true
    });
}
exports.getUserFromToken = getUserFromToken;
