const WebSocketServer = require('rpc-websockets').Server;
const server = new WebSocketServer({port: 4000, host: 'localhost'});

server.event('A');
server.event('B');
server.event('C');

process.stdin.setEncoding('utf-8');
process.stdin.unref();
process.stdin.on('readable', () => {
    while ((input = process.stdin.read()) != null) 
    {
        let event = input.trim().substring(0,1).trim();
        if (event === "A" || event === "B" || event === "C") {
            console.log(`Сгенерировано событие ${event}`)
            server.emit(event);
        }
    }
});