const ws = require('ws');
const fs = require('fs');
const server = new ws.WebSocket.Server({port: 4000, host: 'localhost'});

server.on('connection', (wsClient) => {
    console.log('Server: Новый пользователь подключился');

    const wss = ws.WebSocket.createWebSocketStream(wsClient, {encoding: 'utf8'});
    fs.createReadStream(`./upload/file.txt`).pipe(wss);

    wsClient.on('close', () => {   console.log('Server: Пользователь отключился');   });
});