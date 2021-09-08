var http = require('http');

let h = (r) => {
    let rc = '';
    for (key in r.headers) rc += '<h3>' + key + ':' + r.headers[key] + '</h3>';
    return rc;
}

http.createServer(function (request, response) {
    let b = '';
    request.on('data', str=>{b+=str; console.log('data', b);})
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    request.on('end', ()=>response.end(
        '<!DOCTYPE html><html><head></head><body>' +
        '<h1>Структура запроса</h1>'+
        '<h2>Метод:' + request.method +
        '</h2><h2>URI:' + request.url + '</h2>'+
        '<h2>' + 'версия:' + request.httpVersion +'</h2>'+
        '<h2>ЗАГОЛОВКИ'+'</h2>'+ h(request)+
        '<h2>тело:' +  b+'</h2>' +
        '</body></html>'  )
    )
}).listen(3000);

console.log('01-03. Server running at http://localhost:3000/');