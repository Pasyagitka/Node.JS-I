const udp = require('dgram');
let server = udp.createSocket('udp4');

let PORT = 2000;
server.bind(PORT);

server.on('message', (msg, info) => {
    console.log(`Server MESSAGE: ${msg.toString()}`);

    server.send(`ECHO: ${msg}`, info.port, info.address, (err)=> {
        if(err) { server.close();}
        else {console.log('Sending data to client...');}
    });
});
server.on('close', ()=> {console.log('Closing server...');});