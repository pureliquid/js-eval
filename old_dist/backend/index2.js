"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _WebSocket = require("ws");
const wss = new _WebSocket.Server({ port: 8080 });
exports.startWsServer = () => {
    console.log('startup...');
    wss.on('connection', ws => {
        console.log('connected');
        ws.on('message', message => {
            console.log(message);
        });
        // wsConnections.push(ws);
        ws.onclose = () => {
            console.log('connection lost!..');
            process.exit();
            //removeFromWsConnections(ws);
        };
    });
};
exports.startWsServer();
//  "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'" add to manifest.json to execute
//# sourceMappingURL=index2.js.map