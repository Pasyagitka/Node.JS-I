let http = require('http');
let fs = require('fs');
let path = require('path');

let static = require('./m07-01')('./static');

http.createServer((request, response) =>
{
    if(request.url == '/') {
        response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        response.end(fs.readFileSync('./index.html'));
    }
    else  
    {
        if (request.method=='GET') 
        {
            switch(path.extname(request.url)) 
            {
                case '.html':
                    static.sendFile(request, response, {'Content-Type':'text/html; charset=utf-8'});
                    break;
                case '.css':
                    static.sendFile(request, response, {'Content-Type':'text/css; charset=utf-8'});
                    break;
                case '.js':
                    static.sendFile(request, response, {'Content-Type':'text/javascript; charset=utf-8'});
                    break;
                case '.png':
                    static.sendFile(request, response, {'Content-Type':'image/png; charset=utf-8'});
                    break;
                case '.docx':
                    static.sendFile(request, response, {'Content-Type':'application/msword; charset=utf-8'});
                    break;
                case '.json':
                    static.sendFile(request, response, {'Content-Type':'application/json; charset=utf-8'});
                    break;
                case '.xml':
                    static.sendFile(request, response, {'Content-Type':'application/xml; charset=utf-8'});
                    break;
                case '.mp4':
                    static.sendFile(request, response, {'Content-Type':'video/mp4; charset=utf-8'});
                    break;
                default:
                    static.writeHTTP404(response);
                    break;
            }
        }
        else  {
            response.statusCode = 405;
            response.statusMessage = 'Invalid method';
            response.end("<h1 align='center' >HTTP ERROR 405: Invalid method<h1>");
        }
    }
}).listen(5000);