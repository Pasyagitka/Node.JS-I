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
    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    request.on('data', data => 
    {
        let tempHuman = JSON.parse(data);
        newHuman.name = tempHuman.name;
        newHuman.bday = tempHuman.bday;
    });
    request.on('end', () => 
    {
        newHuman.id =  db.getIndex();
        response.end(JSON.stringify(db.insert(newHuman)));
    })
});

db.on('PUT', async (request, response) => {
	console.log('PUT');
    let newHuman = new data.Person();
    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    request.on('data', data =>
    {
        newHuman = JSON.parse(data);
    });
    request.on('end', () => 
    {
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

db.on('COMMIT', async (request, response) => {
    await db.commit();
});

var server = http.createServer(function (request, response) {
	if(url.parse(request.url).pathname === '/api/db') 
    {
        db.emit(request.method, request, response);
        server.emit('requestCounting');
    }
    if(url.parse(request.url).pathname === '/')
    {
        response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        response.end(fs.readFileSync('./05-01.html'));
    }
    if(url.parse(request.url).pathname === '/api/ss')
    {
        response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        response.end(JSON.stringify(statistics));
    }
}).listen(5000);


var sd_timer = null;
var sc_timer = null;
var ss_timer = null;
let ss_enabled = false;
let statistics = new data.Statistics();


process.stdin.setEncoding('utf-8');
process.stdin.unref(); //чтоб на самом деле останавливался
process.stdin.on('readable', () => {
    let input = "";
    while ((input = process.stdin.read()) != null) 
    {
        let time = input.trim().substring(2).trim();
        let command = input.trim().substring(0,2).trim();
        switch (command){
            case 'sd': {
                if(time == '') {clearTimeout(sd_timer); sd_timer = null; console.log('Отменить остановку сервера');}
                else {
                    if (sd_timer != null) { clearTimeout(sd_timer); console.log('Отсчет начат заново');}
                    console.log(`Сервер остановится через ${time} секунд(ы)`);
                    sd_timer = setTimeout( () =>  { server.close(); console.log('Сервер остановлен'); }, Number(time)*1000);
                }//иначе будет всегда "отсчет начат заново тк cleartimeout не делает нал"
                break;
            }
            case 'sc' : {
                if(time == '') {clearInterval(sc_timer); sc_timer = null; console.log('Остановить периодическое выполнение commit');}
                else {
                    if (sc_timer != null) { console.log('Функция фиксации уже запущена');}
                    else {
                        sc_timer = setInterval( () => { db.commit();}, Number(time)*1000); 
                        sc_timer.unref();
                    }
                }
                break;
            }
            case 'ss' : {
                if(time == '') {
                    if (ss_timer != null){
                        console.log('Остановить сбор статистики');
                        statistics.finish = new Date(Date.now()).toLocaleDateString();
                        clearTimeout(ss_timer);
                        ss_enabled = false;
                        ss_timer = null;
                    }
                }
                else if (ss_timer == null && !ss_enabled) {
                    ss_enabled = true;

                    statistics = new data.Statistics();
                    statistics.start = new Date(Date.now()).toLocaleDateString();

                    console.log(`Сбор статистики активирован на ${time} секунд(ы)`);
                    ss_timer = setTimeout(()=> {
                        console.log('Сбор статистики завершен');            
                        statistics.finish = new Date(Date.now()).toLocaleDateString();
                        clearTimeout(ss_timer);
                        ss_enabled = false;
                        ss_timer = null;
                    }, Number(time)*1000);
                    ss_timer.unref();
                }
                break;
            }
            default : console.log('Wrong command');
        }
    }
});

server.on('requestCounting',    () => {if(ss_enabled) statistics.requestsCount += 1});
server.on('commitCounting',     () => {if(ss_enabled) statistics.commitsCount += 1});

module.exports.server = server;