const net = require('net');

let HOST = '127.0.0.1';
let PORT = 2000;

let client = new net.Socket();
client.connect(PORT, HOST, ()=> {
    console.log('Client CONNECTED: ', client.remoteAddress + ' ' + client.remotePort);
    setInterval(() => {}, 5*1000);
    setTimeout(() => {client.destroy();}, 20*1000);
})

client.write(1);
client.on('data', (data)=> {console.log('Client received: ', data.toString()); });

client.on('close', ()=> {console.log('Closing client...');});
client.on('error', ()=> {console.log('Client ERROR');});