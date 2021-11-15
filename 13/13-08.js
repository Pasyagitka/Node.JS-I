const net = require('net');

let HOST = '127.0.0.1';
let PORT = process.argv[2];

let client = new net.Socket();
let buf = new Buffer.alloc(4); 

client.connect(PORT, HOST, ()=> {
    console.log('Client CONNECTED: ', client.remoteAddress + ' ' + client.remotePort);
    let x = process.argv[3];
    let k = 0;
    setInterval(() => {
        console.log(`Client sending X=${x}(№${++k})`);
        client.write((buf.writeInt32LE(x, 0), buf));
    }, 1*1000);
});

client.on('data', (data)=> {console.log('Client received: ', data.toString()); });
client.on('close', ()=> {console.log('Closing client...');});
client.on('error', ()=> {console.log('Client ERROR');});