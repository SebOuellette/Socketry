const WebSocket = require('ws');
const { EventEmitter } = require('events');

/**
 * The user class which is passed down to the server connection event
 */
class User extends EventEmitter {
    constructor(ws) {
        super();
        this.ws = ws;
    }

    /**
     * Send data to a client
     * @param {string} msg - The message content
     */
    send(msg) {
        this.ws.send(msg);
    }
}


/**
 * The Server class
 * @constructor
 * @param {number} port - Create a new server that listens to an event
 */
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


/**
 * The Client class
 * @constructor
 * @param {string} url - Connect to a socketry server
 */
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
    /**
     * Send data to the server
     * @param {object} msg - The message content
     */
    send(msg) {
        if (typeof msg !== 'object') throw new Error('Expected type: object');
        this.client.send(JSON.stringify(msg));
    }

    /**
     * End the client connection
     */
    end() {
        this.client.close();
    }
}

module.exports = { Server, Client };