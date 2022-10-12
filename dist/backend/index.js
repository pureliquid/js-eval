"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _WebSocket = require("ws");
const readline = require("readline");
let input = '';
let inputList = [];
let rl;
let lastInputs = [];
let currentLastIndex = 0;
// Get process.stdin as the standard input object.
const standard_input = process.stdin;
// Set input character encoding.
standard_input.setEncoding('utf-8');
const wss = new _WebSocket.Server({ port: 8080 });
const setupLineReader = (ws) => {
    currentLastIndex = 0;
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('line', (cmd) => {
        // input.push(cmd);
        // rl.close(cmd);
        // rl.close();
        if (cmd === ':::') {
            rl.close();
        }
        else {
            inputList.push(cmd);
        }
    });
    rl.on('close', (cmd) => {
        // console.log(input.join(' '));
        // lastInputs.push(input.join('\n'));
        ws.send(inputList.join(' '));
        inputList = [];
        rl.removeAllListeners();
    });
    rl.prompt();
};
exports.startWsServer = () => {
    console.log('startup...');
    wss.on('connection', ws => {
        // setupLineReader(ws);
        console.log('connected');
        console.log('>');
        // ws.send('console.log("hello")');
        ws.on('message', message => {
            // console.log(`Received message => ${message}`);
            try {
                console.log(JSON.parse(message).response);
                console.log('>');
                // rl.prompt();
                // setupLineReader(ws);
            }
            catch (_a) {
            }
        });
        // wsConnections.push(ws);
        ws.onclose = () => {
            console.log('connection lost!..');
            process.exit();
            //removeFromWsConnections(ws);
        };
        standard_input.on('data', (d) => {
            ws.send(d);
        });
    });
};
exports.startWsServer();
//  "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'" add to manifest.json to execute
//# sourceMappingURL=index.js.map