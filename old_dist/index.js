"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _WebSocket = require("ws");
// Get process.stdin as the standard input object.
const standard_input = process.stdin;
// Set input character encoding.
standard_input.setEncoding('utf-8');
const wss = new _WebSocket.Server({ port: 8080 });
exports.startWsServer = () => {
    wss.on('connection', ws => {
        ws.on('message', message => {
            console.log(`Received message => ${message}`);
            try {
                console.log(message);
                console.log('\r\n>');
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
        standard_input.on('data', function (data) {
            // User input exit.
            if (data === 'exit\n') {
                // Program exit.
                console.log("User input complete, program exit.");
                process.exit();
            }
            else {
                // Print user input in console.
                console.log('User Input Data : ' + data);
                ws.send(data);
            }
        });
    });
};
//# sourceMappingURL=index.js.map