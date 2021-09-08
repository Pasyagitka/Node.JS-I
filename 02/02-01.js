var http = require('http');
var fs = require('fs');

http.createServer(function (request, response) {
    if(request.url === "/html"){
        let html = fs.readFileSync('./index.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }
   
}).listen(5000);

console.log('Server running: 02-01');