const WebSocketClient = require('rpc-websockets').Client;
let client = new WebSocketClient('ws://localhost:4000');

client.on('open', () => {
    client.subscribe('C');
    client.on('C', () => console.log('Событие С наступило'));
});