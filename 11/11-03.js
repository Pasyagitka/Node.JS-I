const ws = require('ws');
const server = new ws.WebSocket.Server({port: 4000, host: 'localhost'});

let n = 0;
server.on('connection', (wsClient) => {

    console.log('Server: Новый пользователь подключился');

    wsClient.on('pong', (data)=> {
        console.log('<-- pong: ', data.toString());
    });

    setInterval(() => { 
        ++n;
        server.clients.forEach(client => {
            client.send(`11-03-server: ${n}`); 
        });
        console.log(`Клиентам разослано сообщение, n=${n}`);  
    }, 15*1000);

    setInterval(() => {
        wsClient.ping('ping from server');
        console.log(`Количество работоспособных соединений: ${server.clients.size}`);     
    }, 5*1000);

    wsClient.on('close', () => {console.log('Server: Пользователь отключился');   });
});