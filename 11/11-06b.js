const WebSocketClient = require('rpc-websockets').Client;
let client = new WebSocketClient('ws://localhost:4000');

client.on('open', () => {
    client.subscribe('B');
    client.on('B', () => console.log('Событие B наступило'));
});