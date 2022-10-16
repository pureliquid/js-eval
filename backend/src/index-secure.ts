import readline from 'readline';
import { Message, server as WebSocketServer } from 'websocket';
import { IncomingMessage, ServerResponse } from 'http';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const prompt = (query: string): Promise<string> => new Promise((resolve) => rl.question(query, resolve));

const fetchInput = async (doOnFetch: (res: string) => Promise<void>) => {
  const res = await prompt('>');
  await doOnFetch(res);
  await fetchInput(doOnFetch);
};

let shouldSave = false;
let saveTo = '';

const handleQuery = (query: string, ws: any) => {
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

/* start the websockets server */

// const WebSocketServer =  require('websocket').server;
const protocol = require('https');
const fs = require('fs');
/* basic configuration */

const cfg = {
  port: 8080,
  ssl_key: fs.readFileSync('./backend/src/pchess_net.key', 'utf8'),
  ssl_cert: fs.readFileSync('./backend/src/pchess_net.crt', 'utf8'),
};

const server = protocol.createServer(
  {
    key: cfg.ssl_key,
    cert: cfg.ssl_cert,
  },
  function (request: IncomingMessage, response: ServerResponse) {
    console.log(new Date() + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
  }
);

server.listen(cfg.port, function () {
  console.log(new Date() + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production applications
  autoAcceptConnections: false,
  maxReceivedFrameSize: 999999999,
  maxReceivedMessageSize: 999999999,
});

function originIsAllowed(origin: any) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(new Date() + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  const connection = request.accept('echo', request.origin);

  console.log(new Date() + ' Connection accepted.');
  connection.on('message', async function (m: Message) {
    // @ts-ignore
    const message = m.utf8Data;

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
    await handleQuery(query, connection);
  });
  connection.on('close', function (reasonCode, description) {
    console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.');
    console.log(`ReasonCoder: ${reasonCode} `, description);
  });
});
