const http = require('http');
const url = require('url');
const fs = require('fs');

let data = require('./DB.js');
let db = new data.DB();

db.on('GET', async (request, response) => {
	console.log("GET");
    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    await response.end(JSON.stringify(db.select()));
});

db.on('POST', async (request, response) => {
    console.log("POST");
    let newHuman = new data.Person();
    request.on('data', data =>
    {
        let tempHuman = JSON.parse(data);
        newHuman.name = tempHuman.name;
        newHuman.bday = tempHuman.bday;
    });
    request.on('end', () => {
        newHuman.id =  db.getIndex();
        response.end(JSON.stringify(db.insert(newHuman)));
    })
});

db.on('PUT', async (request, response) => {
	console.log('PUT');
    let newHuman = new data.Person();
    request.on('data', data =>
    {
        newHuman = JSON.parse(data);
    });
    request.on('end', () => {
        console.log('newHuman', newHuman);
        response.end(JSON.stringify(db.update(newHuman)));
    })
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
    if(url.parse(request.url).pathname === '/') {
        response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        response.end(fs.readFileSync('./04-02.html'));
    }
}).listen(5000);