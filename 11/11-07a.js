const WebSocketClient = require('rpc-websockets').Client;
let client = new WebSocketClient('ws://localhost:4000');

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
    while ((input = process.stdin.read()) != null) 
    {
        let event = input.trim().substring(0,1).trim();
        if (event === "A" || event === "B" || event === "C") {
            console.log(`Сгенерировано событие ${event}`)
            client.notify(event);
        }
    }
});