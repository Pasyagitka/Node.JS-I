const fs = require('fs');
const ws = require('ws');

const client = new ws.WebSocket('ws://localhost:4000');

client.onopen = () => {
    const wss = ws.WebSocket.createWebSocketStream(client, {encoding: 'utf8'});
    fs.createReadStream(`./File.txt`).pipe(wss);
};