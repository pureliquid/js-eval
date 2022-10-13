import * as _WebSocket from 'ws';
import * as readline from 'readline';
import * as fs from 'fs';

const wss = new _WebSocket.Server({port: 8080});


export const startWsServer = () => {
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

startWsServer();

//  "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'" add to manifest.json to execute