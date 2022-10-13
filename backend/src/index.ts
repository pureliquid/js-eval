// @ts-nocheck
import * as _WebSocket from 'ws';
import * as readline from 'readline';
import * as fs from 'fs';
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

const fetchInput = async (doOnFetch: (res: string) => Promise<void>) => {
	const res = await prompt('>');
	await doOnFetch(res as string);
	await fetchInput(doOnFetch);
};
const wss = new _WebSocket.Server({port: 8080});
let shouldSave = false;
let saveTo = '';
export const startWsServer = async () => {
	wss.on('connection', async (ws) => {
		ws.on('message', async (message) => {
			try {
				console.log(JSON.parse(JSON.parse(message).response));
				if(shouldSave && saveTo) {
					shouldSave = false;
					fs.writeFileSync(saveTo, JSON.stringify(JSON.parse(JSON.parse(message).response), null, 2));
					saveTo = '';

				}
			} catch (e) {
				console.error('Error processing response.');
				console.log(JSON.parse(message).response);

			}
			const query: string = await prompt('>');
			if (query.includes('|')) {
				ws.send(query.split('|')[0]);
				shouldSave = true;
				saveTo = query.split('|')[1];
			} else {
				ws.send(query);
				shouldSave = false;
				saveTo = '';
			}

		});

		ws.onclose = () => {
			console.log('connection lost!..');
		};
		ws.send(await prompt('>'));
	});

};

startWsServer();

//  "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'" add to manifest.json to execute