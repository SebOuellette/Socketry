const Socket = require('../index.js');
const socket = new Socket.Client('ws://localtest.com:8080');

socket.on('open', () => {
    console.log('Connected!');

    socket.on('message', (msg) => {
        console.log(msg);
    });

    socket.send({msg: 'Message'});
    socket.end();
});