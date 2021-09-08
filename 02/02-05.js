var http = require('http');
var fs = require('fs');

http.createServer(function (request, response) {
    if(request.url === "/fetch"){
        let html = fs.readFileSync('./fetch.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }
    if(request.url === "/api/name"){
        let text = 'Зинович Елизавета Игоревна';
        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end(text);
    }
}).listen(5000);

console.log('Server running: 02-05');