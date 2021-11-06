const net = require('net');

let HOST = '127.0.0.1';
let PORT = 2000;

net.createServer((sock) => {
    console.log('Server: ' + sock.remoteAddress + ':' + sock.remotePort);

    sock.on('data', (data) => {
        console.log('Server DATA: ' + data);
        sock.write('ECHO: ' + data);
    });
    sock.on('close', ()=> {console.log('Closing server...');});
}).listen(PORT, HOST);