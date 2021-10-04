const http = require('http');
const url = require('url');
const fs = require('fs');
const mp = require('multiparty');
const xmlbuilder = require('xmlbuilder');
const parseString = require('xml2js').parseString;

let staticPath = './static';
let server = http.createServer(function (request, response) {

    let requestUrl = url.parse(request.url, true).pathname;

    if (request.method == 'GET')
    {
        if (requestUrl == '/connection'){ //;todo chto eto?
            if(!url.parse(request.url, true).query.set) {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.end(`KeepAliveTimeout: ${server.keepAliveTimeout}`);
            } else {
                server.keepAliveTimeout = +url.parse(request.url, true).query.set;
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.end(`Новое значение параметра KeepAliveTimeout установлено: ${server.keepAliveTimeout}`);
            }
        }
        else if (requestUrl == '/headers'){
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/html; charset=utf-8'); //network channel 
            response.setHeader('UserHeader', 'ZinovichLiza');
            response.write(`Заголовки запроса: ${JSON.stringify(request.headers)}\n`);
            response.write(`Заголовки ответа: \n${JSON.stringify(response.getHeaders())}\n`);
            response.end();
        }
        else if (requestUrl == '/parameter'){
            let x = parseInt(url.parse(request.url, true).query.x);
            let y = parseInt(url.parse(request.url, true).query.y);
            if(Number.isInteger(x) && Number.isInteger(y))  {
                response.end(`Сумма: ${(x+y)}, разность: ${(x-y)}, произведение: ${(x*y)}, частное: ${(x/y)}`);
            }
            else  response.end('Ошибка! Параметры должны иметь числовые значения.');
        }
        else if ((/\/parameter\/\w+\/\w+/).test(requestUrl)) {   //parameter/что-то/что-то
            let result = url.parse(request.url, true).pathname.split("/");
            let x = parseInt(result[2]);
            let y = parseInt(result[3]);
            if(Number.isInteger(x) && Number.isInteger(y))  {
                response.end(`Сумма: ${(x+y)}, разность: ${(x-y)}, произведение: ${(x*y)}, частное: ${(x/y)}`);
            }
            else response.end(`URI: ${request.url}`);
        }
        else if (requestUrl == '/close'){ //остановится когда запросы закончатся?
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8 '});
            response.end(`Сервер остановится через 10 секунд`);
            sd_timer = setTimeout( () =>  { server.close(); console.log('Сервер остановлен'); }, 10*1000);
        }
        else if (requestUrl == '/socket'){
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8 '});
            response.end(`Клиент: IP-адрес ${request.socket.localAddress}, порт ${request.socket.localPort}; Сервер: IP-адрес ${request.socket.remoteAddress}, порт ${request.socket.remotePort}`);
        }
        else if (requestUrl == '/req-data'){ //???????????????
            console.log('req-data');
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            request.on('data', chunk =>  {  console.log(`data: \n ${chunk} \n`);});
            request.on('end', () => { console.log('end'); });
            response.end();
        }
        else if (requestUrl == '/resp-status'){
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.statusCode = parseInt(url.parse(request.url, true).query.code);
            response.statusMessage = url.parse(request.url, true).query.mess;
            response.end(`Статус: ${response.statusCode}, сообщение: ${response.statusMessage}`);
        }
        else if (requestUrl == '/formparameter'){
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.end(fs.readFileSync('formparameter.html'));
        }
        else if (requestUrl == '/files'){
            fs.readdir(staticPath, (err, files) => {
                response.writeHead(200, {"Content-Type" : "text/html; charset=utf-8", "X-static-files-count": files.length});
                response.end('Ответ в заголовке');
            });
        }
        else if ((/\/files\/\w+/).test(requestUrl)) {        //files/что-то
            let result = url.parse(request.url, true).pathname.split("/");
            fs.access(`${staticPath}/${result[2]}`, fs.constants.R_OK, err => {
                if(err) {
                    response.writeHead(404, {"Content-Type" : "application/json; charset=utf-8"});
                    response.end(`Файл ${result[2]} не найден в ${staticPath}`);
                }
                else {
                    response.writeHead(404);
                    fs.createReadStream(`./static/${result[2]}`).pipe(response);
                }
            });
        }
        else if (requestUrl == '/upload'){
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8 '});
            response.end('<form method="POST" action="/upload" enctype="multipart/form-data">' +
                            '<input type="file" name="file"/>' +
                            '<input type="submit"/>' +
                        '</form>');
        }
        else {
            console.log(404);
            response.statusCode = 404;
            response.end('404');
        }
    }

    else if (request.method == 'POST') 
    {
        if (requestUrl == '/formparameter') {
            response.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
            let data = '';
            request.on('data', chunk => { data += chunk; });
            request.on('end', () => { response.end(data); });
        }
        else if (requestUrl == '/json') {
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
        else if (requestUrl == '/xml') {
            let data ='';
            request.on('data', (chunk) => { data += chunk; });
            request.on('end', () => {
                parseString(data, function(err, result) {
                    if (err) {
                        response.writeHead(400, {'Content-Type': 'application/xml; charset=utf-8'});
                        response.end('Ошибка разбора XML');

                    } 
                    else {
                        response.writeHead(200, {'Content-Type': 'application/xml; charset=utf-8'});
                        
                        let id = result.request.$.id;
                        let xmlDoc = xmlbuilder.create('response');
                        xmlDoc.att('id', id);


                        let xSum = 0;
                        let mConcat = '';
                        result.request.x.forEach((p) => { xSum += parseInt(p.$.value); });
                        result.request.m.forEach((p) => { mConcat += p.$.value; });
                       
                        xmlDoc.ele('sum').att('element', 'x').att('result', xSum).up()
                              .ele('concat').att('element', 'm').att('result', mConcat).up();
                        response.end(xmlDoc.toString());
                    }
                });
            });
        }
        else if (requestUrl == '/upload') {
            let form = new mp.Form({uploadDir: staticPath});
            form.on('file', (name, file) => { });
            form.on('error', (err)=>{response.end('Ошибка! Файл не сохранен')});
            form.on('close', () => {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.end("Файл сохранен");
            });
            form.parse(request);
        }
        else {
            console.log(404);
            response.statusCode = 404;
            response.end('404');
        }
    }
}).listen(5000);