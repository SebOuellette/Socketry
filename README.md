<img src='./docs/images/Words.png'><br/>
<img src='https://travis-ci.org/PlayBy/Socketry.svg?branch=master'>
<img src='https://ci.appveyor.com/api/projects/status/lkhnwcrii036fphh?svg=true'>

## [Docs](https://playby.github.io/Socketry/)

## About

Socketry allows for an easy way to set up websocket servers and clients. It is built to allow anybody to easily set up websockets without any hastle. 
# 
## Use
Socketry has an easy way to access all of the clients connected to the server.<br/>
```js
const Socket = require('./index.js');
const server = new Socket.Server(8080);

console.log(server.clients); // array
```
You can filter through these clients to target the current client as well, since each client has their own unique id. You can find it by just using `client.id`.<br/>
# 
### Basic server file
To start using socketry, you will need a server file. <br/>
```js
const Socket = require('./index.js');
// Create a new server on port `8080`
const server = new Socket.Server(8080);

// Fires when a client connects to the server
server.on('connect', usr => {
    console.log('User connected!');
    
    // Fires when the client closes or disconnects from the server
    usr.on('end', extUsr => {
        console.log('User Disconnected');
    });
    
    // fires when a message is sent to the server
    usr.on('message', (data, from) => {
        // Parse the data so that you can use each part
        data = JSON.parse(data);
        console.log(data);
        // Sends the message back to every client
        server.clients.forEach(c => {
            c.send(`${data.usr}: ${data.msg}`);
        });
    });
});
```
This is just the barebones of a server. It just receives the websockets, and sends them out again to each client.
# 
### Basic client file
You will also need a way to communicate to the server. You can do this in node by using another barebones file.
```js
const Socket = require('./index.js');
// Create a client that connects to localhost, on port `8080`
const socket = new Socket.Client('ws://localhost:8080');

// Fires when connected to a server
socket.on('open', usr => {
    console.log('Connected!');

    // Fires when server sends a message to the client
    socket.on('message', (msg) => {
        console.log(msg);
    });

    // Send a message to the server in object form.
    socket.send({msg: 'Message', usr: 'SharkFin'});

    // Close the websocket connection
    socket.end();
});
```

### .send()
When sending with the client, you send an object. You can have any property inside the object, as long as the server will accept it. 