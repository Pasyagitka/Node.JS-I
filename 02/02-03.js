var http = require('http');

http.createServer(function (request, response) {
    if(request.url === "/api/name"){
        let text = 'Зинович Елизавета Игоревна';
        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end(text);
    }
}).listen(5000);

console.log('Server running: 02-03');