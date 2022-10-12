class RemoteEvalFrontend {

    constructor(private url: string = 'ws://localhost:8080') {

    }

    bootstrap() {
        this.createSocketConnection();
    }

    createSocketConnection() {
        const connection: WebSocket = new WebSocket(this.url);
        connection.onopen = () => {
            alert('connected!');
        };

        connection.onerror = error => {
            alert('error.. can not connect to remoteeval!');
        };

        connection.onopen = () => {
            connection.send('frontend connected');
        };
        connection.onmessage = async (e: MessageEvent) => {
            await eval(e.data);
            connection.send(JSON.stringify({
              response: await eval(e.data)
            }));

        }
    }
}

const ext: RemoteEvalFrontend = new RemoteEvalFrontend();
console.log('Running..');
window.onload = ext.bootstrap.bind(ext);