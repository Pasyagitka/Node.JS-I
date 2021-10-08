const http = require('http');
const url = require('url');
const fs = require('fs');
const ws = require('ws');
const server = new ws.WebSocket.Server({port: 4000, host: 'localhost'});

http.createServer(function (request, response) {
    if (request.method == 'GET' && url.parse(request.url, true).pathname == '/start') {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(fs.readFileSync('10-01.html'));        
    }
    else {
        response.writeHead(400, {'Content-Type': 'text/html'});
        response.end('400: Error');
    }
}).listen(3000);

server.on('connection', (wsClient) => {
    console.log('Server: Новый пользователь подключился');
    let n = 0;
    let k = 0;
    setInterval(()=> {wsClient.send(`10-01-server: ${n}->${++k}`)}, 5*1000);

    wsClient.on('message', (message) => {
        ++n;
        console.log(`Server: Сообщение от клиента: ${message}`);
    });

    wsClient.on('close', () => {
      console.log('Server: Пользователь отключился');
    });
});