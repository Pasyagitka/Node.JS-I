const WebSocketClient = require('rpc-websockets').Client;
let client = new WebSocketClient('ws://localhost:4000');

client.on('open', () => {  
    client.subscribe('StudentListChanged');
    client.on('StudentListChanged', (filename) => console.log(`Student list (${filename}) changed`));
});