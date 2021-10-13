const ws = require('ws');
const fs = require('fs');
const server = new ws.WebSocket.Server({port: 4000, host: 'localhost'});

server.on('connection', (wsClient) => {
    console.log('Server: Новый пользователь подключился');

    const wss = ws.WebSocket.createWebSocketStream(wsClient, {encoding: 'utf8'});
    wss.pipe(fs.createWriteStream(`./upload/file.txt`));

    wsClient.on('close', () => {   console.log('Server: Пользователь отключился');   });
});