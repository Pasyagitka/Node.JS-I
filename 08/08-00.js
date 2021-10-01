const http = require('http');
const url = require('url');

let server = http.createServer(function (request, response) {

    switch (url.parse(request.url).pathname)
    {
        case '/connection':   {
            if(!url.parse(request.url, true).query.set) {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.end(`<h1>KeepAliveTimeout: ${server.keepAliveTimeout}</h1>`);
            } else {
                server.keepAliveTimeout = +url.parse(request.url, true).query.set;
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.end(`<h1>New value of KeepAliveTimeout: ${server.keepAliveTimeout}</h1>`);
            }
            break;
        }
        case '/headers': {
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8 ','UserHeader': 'ZinovichLiza'});
            response.end(`<h2>${JSON.stringify(request.headers)}</h2>`);
            break;
        }
        case '/parameter':  {
            break;
        }
        case '/close':  {
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8 '});
            response.end(`<h2>Сервер остановится через 10 секунд</h2>`);
            sd_timer = setTimeout( () =>  { server.close(); console.log('Сервер остановлен'); }, 10*1000);
            break;
        }
        case '/socket': {
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8 '});
            response.end(`<h2>Клиент: IP-адрес ${request.socket.localAddress}, порт ${request.socket.localPort}; Сервер: IP-адрес ${request.socket.remoteAddress}, порт ${request.socket.remotePort};</h2>`);
            break;
        }
        case '/req-data': {
           
            break;
        } 
        case '/resp-status':{
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8 '});
            response.statusCode = parseInt(url.parse(request.url, true).query.code);
            response.statusMessage = url.parse(request.url, true).query.mess;
            response.end(`Статус: ${response.statusCode}, пояснение: ${response.statusMessage}`);
            break;
        } 
        case '/formparameter': {

            break;
        } 
        case '/json': {
            break;
        }
        case '/xml': {
            break;
        } 
        case '/files': {
            break;
        }
        case '/files/filename':{
            break;
        }
        case '/upload': {
            break;
        }
    }
}).listen(5000);