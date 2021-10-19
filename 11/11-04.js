const ws = require('ws');
const server = new ws.WebSocket.Server({port: 4000, host: 'localhost'});

let n = 0;
server.on('connection', (wsClient) => {
    console.log('Server: Новый пользователь подключился');

    wsClient.on('message', (message) => {
        let stringMessage = JSON.parse(message);
        console.log(`Server: Сообщение от клиента: ${message}`);
        wsClient.send(JSON.stringify({
            "server": ++n,
            "client": stringMessage.client,
            "timestamp": Date.now()
        }));
    });

    wsClient.on('close', () => {   console.log('Server: Пользователь отключился');   });
});