const WebSocket = require('ws');
const { EventEmitter } = require('events');

/**
 * The user passed to 
 */
class User extends EventEmitter {
    constructor(ws) {
        super();
        this.ws = ws;
    }

    send(msg) {
        this.ws.send(msg);
    }
}

class Server extends EventEmitter {
    constructor(port) {
        super();
        if (typeof port !== 'number') throw Error('Expected type: number');

        this.clients = [];
        this.port = port;
        this.server = new WebSocket.Server({ port });

        this.server.on('connection', ws => {
            ws.id = Math.round(Math.random() * 10000000000000000);
            ws.user = new User(ws);
            this.clients.push(ws.user);
            this.emit('connection', ws);

            ws.user.on('message', (msg) => {
                ws.user.emit('message', (msg, ws));
            });

            ws.on('close', () => {
                ws.emit('end', this.clients.filter(c => c.readyState !== 1)[0]);
                this.clients = this.clients.filter(c => c.readyState === 1);
            });
        });
    }
}

class Client extends EventEmitter {
    constructor(url) {
        super();
        if (typeof url !== 'string') throw Error('Expected type: number');
        this.url = url;
        this.client = new WebSocket(url);

        this.client.on('open', () => {
            this.emit('open');

            this.client.on('message', data => {
                this.emit('message', data);
            });
        });
    }

    send(msg) {
        this.client.send(msg);
    }

    end() {
        this.client.close();
    }
}

module.exports = { Server, Client };