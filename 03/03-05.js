const http = require('http');
const fs = require('fs');
const url = require('url');

let fact = (n) => { return (n <= 1 ? n : n * fact(n-1));}
//24
//24 21
//54 75 71

function Fact(n, cb) {
    this.ffact = fact;
    this.num = n;
    this.cb = cb;
    this.calc = () => {
        setImmediate(() => {
            this.cb(null, this.ffact(this.num));
        });
    }
}

http.createServer(function (request, response) 
{
    let urlpath = url.parse(request.url, true);
    if (urlpath.pathname === '/fact') {
        if (urlpath.query.k !== null) 
        {
            let k = Number(urlpath.query.k);
            if (Number.isInteger(k)) 
            {
                response.writeHead(200, {'Content-Type' : 'application/json'});
                let fact = new Fact(k, (error, result) => {
                    response.end( JSON.stringify({ k: k , fact: result }) );
                });
                fact.calc();
            }
        }
    }
    else if (urlpath.pathname === '/') 
    {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(fs.readFileSync('./03-03.html'));
    }
}).listen(5000);