const Socket = require('./index.js');
const server = new Socket.Server(8080);

server.on('connection', usr => {
    console.log('User connected!');
    
    usr.on('end', extUsr => {
        console.log('User Diconnected');
    });

    usr.on('message', (msg, from) => {
        console.log(msg);
        server.clients.forEach(c => {
            c.send(msg);
        });
    });
});