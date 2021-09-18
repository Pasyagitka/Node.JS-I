const http = require('http');
const url = require('url');

let data = require('./DB.js');
let db = new data.DB();

db.on('GET', async (request, response) => {
	console.log("GET");
    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    await response.end(JSON.stringify(db.select()));
});

db.on('POST', async (request, response) => {
    console.log('POST');
    let createPerson = JSON.parse(url.parse(request.url, true).query.createperson);
    let r = {
        id: db.getIndex(),
        name: createPerson.name,
        dbay: createPerson.bday
    };
    //todo проверка считанных параметров????
    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    await response.end(JSON.stringify(db.insert(r)));
});

db.on('PUT', async (request, response) => {
	console.log('PUT');
    let updatePerson = JSON.parse(url.parse(request.url, true).query.updateperson);
    console.log(updatePerson);
    let r = {
        id: updatePerson.id,
        name: updatePerson.name,
        bday: updatePerson.bday
    };
    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    await response.end(JSON.stringify(db.update(r)));
});

db.on('DELETE', async (request, response) => {
	console.log('DELETE');
	let id = +url.parse(request.url, true).query.id;
    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    await response.end(JSON.stringify(db.delete(id)));
});

http.createServer(function (request, response) {
	if(url.parse(request.url).pathname === '/api/db') {
        db.emit(request.method, request, response);
    }
}).listen(5000);