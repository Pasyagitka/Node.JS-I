let fs = require('fs');
let http = require('http');

function Stat(rootDirectory)
{
    let pathStatic = (fn) => { return `${rootDirectory}${fn}`;}

    this.writeHTTP404 = (response) =>  {
        response.writeHead(404, {'Content-Type':'application/json; charset=utf-8'});
        response.end("404 Not Found");
    }

    this.writeHTTP405 = (response) =>  {
        response.writeHead(405, {'Content-Type':'application/json; charset=utf-8'});
        response.end("405 Method Not Allowed");
    }

    this.pipeFile  = (request, response, headers) =>  {
        response.writeHead(200, headers);
        fs.createReadStream(pathStatic(request.url)).pipe(response);
    }

    this.isStatic = (ext, fn) => {let reg = new RegExp(`^\/.+\.${ext}$`); return reg.test(fn);}

    this.sendFile = (request, response, headers) =>  {
        fs.access(pathStatic(request.url), fs.constants.R_OK, err => {
            if(err) this.writeHTTP404(response);
            else this.pipeFile(request, response, headers);
        });
    }
}
module.exports = (parm) => {return new Stat(parm);}