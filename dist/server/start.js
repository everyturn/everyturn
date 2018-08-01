"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("boardgame.io/server");
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const koa_mount_1 = __importDefault(require("koa-mount"));
const tic_tac_toe_1 = require("../src/game-types/tic-tac-toe");
const koa_router_1 = __importDefault(require("koa-router"));
const koa_1 = __importDefault(require("koa"));
const koa_jwt_1 = __importDefault(require("koa-jwt"));
const jwks_rsa_1 = require("jwks-rsa");
const cors_1 = __importDefault(require("@koa/cors"));
const PORT = process.env.PORT || 8000;
const server = server_1.Server({ games: [tic_tac_toe_1.TicTacToe] });
if (process.env.NODE_ENV !== 'development') {
    server.app.use(koa_helmet_1.default());
}
server.app.use(koa_mount_1.default('/api/v1', server.api));
const jwtCheck = koa_jwt_1.default({
    secret: jwks_rsa_1.koaJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://amitport.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://api.turn-based.com',
    issuer: 'https://amitport.auth0.com/',
    algorithms: ['RS256']
});
const app = new koa_1.default();
const router = new koa_router_1.default();
router.get('/ping', (ctx) => {
    ctx.body = ctx.state.user;
});
app
    .use(cors_1.default())
    .use(jwtCheck)
    .use(router.routes())
    .use(router.allowedMethods());
server.app.use(koa_mount_1.default('/api-authorized', app));
(async () => {
    await server.db.connect();
    server.app.listen(PORT, () => {
        console.log(`Serving at: http://localhost:${PORT}/`);
    });
})();
