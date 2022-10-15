import './prune';

class RemoteEvalFrontend {

	constructor(private url: string = 'ws://192.168.8.143:8080') {

	}

	bootstrap() {
		/*
		const s = document.createElement('script');
		s.src = 'https://cdn.jsdelivr.net/npm/lodash.clonedeep@4.5.0/index.js';
		document.body.appendChild(s);*/
		this.createSocketConnection();

	}

	createSocketConnection() {
		const connection: WebSocket = new WebSocket(this.url, 'echo');
		connection.onopen = () => {
			alert('connected!');
		};
		connection.addEventListener('error',() => {
			alert('error.. can not connect to remoteeval!');
		});

		connection.addEventListener('open',() => {
			connection.send(JSON.stringify({response:`connected ${window.location.href}`}));
		});
		connection.onmessage = async (e: MessageEvent) => {
			try {
				connection.send(JSON.stringify({
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					response: JSON.prune(await eval(e.data))
				}));
			} catch (err) {
				console.log(err);
				connection.send(JSON.stringify({
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					response: JSON.prune(err.data)
				}));
			}
		};
		connection.addEventListener('message', connection.onmessage);
	}
}

const ext: RemoteEvalFrontend = new RemoteEvalFrontend( 'wss://localhost:8080');
console.log('Running..');
/*window.onload = */ext.bootstrap.bind(ext)();
// @ts-ignore
completion(true);