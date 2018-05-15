const { Client } = require('../index.js');
const socket = new Client('ws://localtest.com:8080');

socket.on('open', () => {
    console.log('Connected!');
    socket.joinRoom('foo');

    socket.on('message', (msg) => {
        console.log(msg);
    });

    socket.send({msg: 'Message'});
    socket.end();
});