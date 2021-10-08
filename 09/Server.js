const http = require('http');
const url = require('url');
const fs = require('fs');
const mp = require('multiparty');
const xmlbuilder = require('xmlbuilder');
const parseString = require('xml2js').parseString;

http.createServer(function (request, response) {
    if (request.method == 'GET' && url.parse(request.url).pathname == '/09-01') {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end('Response 09-01');        
    }
    if (request.method == 'GET' && url.parse(request.url).pathname == '/09-02') {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(`x = ${url.parse(request.url, true).query.x},  y = ${url.parse(request.url, true).query.y}`);        
    }
    if (request.method == 'POST' && url.parse(request.url).pathname == '/09-03') {
        response.writeHead(200, {'Content-Type': 'application/json'});
        request.on('data', data =>
        {
            console.log(`data ${data}`);
            let body = JSON.parse(data);
            response.end(`x = ${body.x}, y = ${body.y}, s = ${body.s}`);
        });
    }
    if (request.method == 'POST' && url.parse(request.url).pathname == '/09-04') {
        let data ='';
        request.on('data', (chunk) => { data += chunk; });
        request.on('end', () => {
            response.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
            console.log(data);
            data = JSON.parse(data);
            let jsonResponse = {};
            jsonResponse.__comment = 'Ответ. ' + (data.__comment).substring(8);
            jsonResponse.x_plus_y = data.x + data.y;
            jsonResponse.Concatenation_s_o = data.s + ': ' + data.o.surname + ', ' + data.o.name;
            jsonResponse.Length_m = data.m.length;
            response.end(JSON.stringify(jsonResponse));
        });
    }
    if (request.method == 'POST' && url.parse(request.url).pathname == '/09-05') {
        let data ='';
        request.on('data', (chunk) => { data += chunk; });
        request.on('end', () => {
            parseString(data, function(err, result) {
                if (err) {
                    response.writeHead(400, {'Content-Type': 'text/xml; charset=utf-8'});
                    response.end('Ошибка разбора XML');
                } 
                else {
                    response.writeHead(200, {'Content-Type': 'text/xml; charset=utf-8'});
                    
                    let id = result.request.$.id;
                    let xmlDoc = xmlbuilder.create('response');
                    xmlDoc.att('id', id);

                    let xSum = 0;
                    let mConcat = '';
                    result.request.x.forEach((p) => { xSum += parseInt(p.$.value); });
                    result.request.m.forEach((p) => { mConcat += p.$.value; });
                    
                    xmlDoc.ele('sum').att('element', 'x').att('result', xSum).up()
                            .ele('concat').att('element', 'm').att('result', mConcat).up();
                    response.end(xmlDoc.toString({pretty:true}));
                }
            });
        });
    }
    if (request.method == 'POST' && url.parse(request.url).pathname == '/09-06'){
        let form = new mp.Form({uploadDir:'./static'});
        form.on('file', (name, file) => { 
            console.log(name, file); 
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.write(fs.readFileSync(file.path)) 
        });
        form.on('error', (err)=>{console.log(err); response.end('Ошибка! Файл не сохранен')});
        form.on('close', () => {
            response.end("Файл сохранен");
        });
        form.parse(request);        
    }
    if (request.method == 'POST' && url.parse(request.url).pathname == '/09-07'){
        let form = new mp.Form({uploadDir:'./static'});
        form.on('file', (name, file) => { 
            console.log(name, file); 
            response.writeHead(200, {'Content-Type': 'image/png; charset=utf-8'});
            response.write(fs.readFileSync(file.path));
        });
        form.on('error', (err)=>{console.log(err); response.end('Ошибка! Файл не сохранен')});
        form.on('close', () => {
            response.end("Файл сохранен");
        });
        form.parse(request);        
    }
    if (request.method == 'GET' && url.parse(request.url).pathname == '/09-08'){
        response.writeHead(200, {'Content-Type': 'text/xml; charset=utf-8'});
        response.end(fs.readFileSync('MyFile.txt'));
    }
}
).listen(5000);