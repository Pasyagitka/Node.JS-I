let http = require('http');
let fs = require('fs');

let static = require('./m07-01')('./static');

http.createServer((request, response) =>
{
    if(request.url == '/') {
        response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        response.end(fs.readFileSync('./index.html'));
    }
    else  {
        if (request.method == 'GET')  {
            if      (static.isStatic('html', request.url))  static.sendFile(request, response, {'Content-Type':'text/html; charset=utf-8'});
            else if (static.isStatic('css', request.url))  static.sendFile(request, response, {'Content-Type':'text/css; charset=utf-8'})
            else if (static.isStatic('js', request.url))  static.sendFile(request, response, {'Content-Type':'text/javascript; charset=utf-8'})
            else if (static.isStatic('png', request.url))  static.sendFile(request, response, {'Content-Type':'image/png; charset=utf-8'})
            else if (static.isStatic('docx', request.url))  static.sendFile(request, response, {'Content-Type':'application/msword; charset=utf-8'})
            else if (static.isStatic('json', request.url))  static.sendFile(request, response, {'Content-Type':'application/json; charset=utf-8'})
            else if (static.isStatic('xml', request.url))  static.sendFile(request, response, {'Content-Type':'application/xml; charset=utf-8'})
            else if (static.isStatic('mp4', request.url))  static.sendFile(request, response, {'Content-Type':'video/mp4; charset=utf-8'})
            else static.writeHTTP404(response);
        }
        else  static.writeHTTP405(response);
    }
}).listen(5000);