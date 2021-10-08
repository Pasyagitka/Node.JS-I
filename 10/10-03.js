const ws = require('ws');
const server = new ws.WebSocket.Server({port: 4000, host: 'localhost'});

server.on('connection', (wsClient) => {
    console.log('Новый пользователь подключился');

    wsClient.on('message', (message) => {
        console.log(`Сообщение от клиента: ${message}`);
        server.clients.forEach(client => {
            client.send(`Сообщение от какого-то клиента пришло на сервер... ${message}`)
        });
    });

    wsClient.on('close', () => {      
        console.log('Пользователь отключился');    
    });
});