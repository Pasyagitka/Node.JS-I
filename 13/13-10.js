const udp = require('dgram');
const client = udp.createSocket('udp4');

let HOST = '127.0.0.1';
let PORT = 2000;

client.connect(PORT, HOST, (err)=> {
    client.send(Buffer.from('Hello from Node.js UDP client\0'));
});

client.on('message', (msg, info) =>{
    console.log(`Client received: ${msg.toString()}`);
})