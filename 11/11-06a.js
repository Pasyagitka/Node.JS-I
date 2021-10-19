const WebSocketClient = require('rpc-websockets').Client;
let client = new WebSocketClient('ws://localhost:4000');

client.on('open', () => {
    client.subscribe('A');
    client.on('A', () => console.log('Событие A наступило'));
});