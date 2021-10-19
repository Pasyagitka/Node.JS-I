const WebSocketServer = require('rpc-websockets').Server;
const server = new WebSocketServer({port: 4000, host: 'localhost'});
server.setAuth(credentials => credentials.username === 'liza' && credentials.password === 'liza');

server.register('square', (parameters) => {
    switch(parameters.length) {
        case 1: return Math.PI * Math.pow(parameters[0], 2);
        case 2: return parameters[0] * parameters[1];
        default: return "Parameter error";
    }
})

server.register('sum', (parameters) => {
    return parameters.reduce((prev, curr) => prev + curr);
})

server.register('mul', (parameters) => {
    return parameters.reduce((prev, curr) => prev * curr);
})

server.register('fib', (length) => {
    return Array.from({ length }, ((a, b) => _ => ([b, a] = [a + b, b, a])[2])(0, 1));
}).protected()

server.register('fact', (length) => {
    return factorial(length);
}).protected()

function factorial(n) { return (n <= 1 ? 1 : n * factorial(n-1));}