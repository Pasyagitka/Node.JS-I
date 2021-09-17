const http = require('http');
const url = require('url');
const fs = require('fs');

let fact = (n) => { return (n <= 1 ? n : n * fact(n-1));}
//38
//21 28
//59 79 75

http.createServer(function (request, response) 
{
    let urlpath = url.parse(request.url, true);
    if (urlpath.pathname === '/fact') 
    {
        if (urlpath.query.k !== null) 
        {   
            let k = Number(urlpath.query.k);
            if (Number.isInteger(k)) 
            {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ k:k, fact: fact(k) }));
            }
        }
    }
    else if (urlpath.pathname === '/') 
    {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(fs.readFileSync('./03-03.html'));
    }
}).listen(5000);
