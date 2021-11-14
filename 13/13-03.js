const net = require('net');

let HOST = '127.0.0.1';
let PORT = 2000;

let sum = 0;
net.createServer((sock) => {
    console.log('Server: ' + sock.remoteAddress + ':' + sock.remotePort);

    sock.on('data', (data) => {
        console.log('Server DATA: ' + data);
        sum  += data.readInt32LE();
    });
    
    let buf = Buffer.alloc(4);
    setInterval(() => {buf.writeInt32LE(sum, 0); sock.write(buf)}, 5*1000)
    sock.on('close', ()=> {console.log('Closing server...');});
}).listen(PORT, HOST);