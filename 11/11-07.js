const WebSocketServer = require('rpc-websockets').Server;
const server = new WebSocketServer({port: 4000, host: 'localhost'});

server.register('A', () => {console.log('Уведомление A')});
server.register('B', () => {console.log('Уведомление B')});
server.register('C', () => {console.log('Уведомление C')});