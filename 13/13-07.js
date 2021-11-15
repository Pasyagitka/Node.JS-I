const net = require('net');

let HOST = '127.0.0.1';
let PORT1 = 4000;
let PORT2 = 5000;

let connectionListener = (n) => { return (sock) => {
        console.log('${n} Server: ' + sock.remoteAddress + ':' + sock.remotePort);

        sock.on('data', (data) => {
            console.log(`${n} Server DATA: ${data.readInt32LE()}`);
            sock.write(`ECHO: ${data.readInt32LE()}`);
        });
   
        sock.on('${n} close', ()=> {console.log('Closing server...');});
    }
}

net.createServer(connectionListener(PORT1)).listen(PORT1, HOST).on('listening', ()=> { console.log(`TCP-server: ${HOST}:${PORT1}`)});
net.createServer(connectionListener(PORT2)).listen(PORT2, HOST).on('listening', ()=> { console.log(`TCP-server: ${HOST}:${PORT2}`)});