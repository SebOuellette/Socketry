const { Server } = require('../index.js');
const server = new Server(8080);
const room = new server.Room('foo');
const room1 = new server.Room('bar');

server.on('connection', usr => {
    console.log('User connected!');
    
    usr.on('end', extUsr => {
        console.log('User Diconnected');
    });

    usr.on('message', (data, room) => {
        data = JSON.parse(data);
        console.log(data);
        room.clients.forEach(c => {
            c.send(data.msg);
        });
    });
});