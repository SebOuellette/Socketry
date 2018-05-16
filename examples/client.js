const { Client } = require('../index.js');
const socket = new Client('ws://localtest.com:8080');

socket.on('open', () => {
    console.log('Connected!');
    socket.joinRoom('foo');
    socket.joinRoom('bar');

    socket.on('join', room => {
        room.on('message', (msg) => {
            console.log(msg);
        });

        room.send({msg: room.room.name});
        room.leave();
    });

    socket.on('leave', room => {
        console.log('left');
    });
});