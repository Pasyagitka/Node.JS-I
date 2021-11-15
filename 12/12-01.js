const http = require('http');
const fs = require('fs');
const url = require('url');
const WebSocketServer = require('rpc-websockets').Server;
const server = new WebSocketServer({port: 4000, host: 'localhost'});

const jsonFilePath = 'StudentList.json';
server.event('StudentListChanged');

var watching = false;
fs.watch('.', (eventType, filename) => {
    if(filename.endsWith("StudentList.json") && eventType === 'change') {
        if(watching) return;
        watching = true;
        console.log(`Event emmited on file ${filename}`);
        server.emit('StudentListChanged', filename);
    }
    setTimeout(() => { watching = false; }, 100);
});


http.createServer(function (request, response) {
    let requestUrl = url.parse(request.url, true).pathname;

    if (request.method == 'GET' && requestUrl == '/') {
        response.writeHead(200, {"Content-Type" : "application/json"});
        fs.createReadStream(jsonFilePath).pipe(response);
    }

    if (request.method == 'GET' && (/^\/\d+/).test(requestUrl)) {
        let id = url.parse(requestUrl, true).pathname.split('/')[1];
        let data = JSON.parse(fs.readFileSync(jsonFilePath));
        let exists = 0;
        data.forEach(student => {
            if (student.id == id) {
                response.writeHead(200, {"Content-Type" : "application/json"});
                response.end(JSON.stringify(student));
                exists = 1;
            }
        });
        if (exists == 0) {
            response.writeHead(400, {"Content-Type" : "application/json"});
            response.end(JSON.stringify({"error": 1,  "message": "Не найден студент с заданным id"}));
        }
    }

    if (request.method == 'POST' && requestUrl == '/') {
        request.on('data', data => {
            let tempStudent = JSON.parse(data); 
            let jsondata = JSON.parse(fs.readFileSync(jsonFilePath));  
            let exists = 0;
            jsondata.forEach(student => {
                if (student.id == tempStudent.id) {
                    response.writeHead(400, {"Content-Type" : "application/json"});
                    response.end(JSON.stringify({"error": 2,  "message": "Студент с заданным id уже существует"}));
                    exists = 1;
                }
            }); 
            if (exists == 0) {
                response.writeHead(200, {'Content-Type': 'application/json'});
                jsondata.push(tempStudent);
                fs.writeFile(jsonFilePath, JSON.stringify(jsondata, null, 4), (e) => {
                    if (e) {
                        response.writeHead(400, {"Content-Type" : "application/json"});
                        response.end(JSON.stringify({"error": 3,  "message": "Ошибка при записи в файл"}));    
                    }
                    else {
                    console.log("Add student", JSON.stringify(tempStudent));
                    response.end(JSON.stringify(tempStudent));
                    }
                });
            }
        });
    }

    if (request.method == 'PUT' && requestUrl == '/') {
        request.on('data', data => {
            let tempStudent = JSON.parse(data); 
            let jsondata = JSON.parse(fs.readFileSync(jsonFilePath));  
            let exists = 0;
            jsondata.forEach(student => {
                if (student.id == tempStudent.id) {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    jsondata.splice(jsondata.indexOf(student), 1, tempStudent);
                    fs.writeFile(jsonFilePath, JSON.stringify(jsondata, null, 4), (e) => {
                        if (e) {
                            response.writeHead(400, {"Content-Type" : "application/json"});
                            response.end(JSON.stringify({"error": 3,  "message": "Ошибка при записи в файл"}));        
                        }
                        else {
                        console.log("Updated student", JSON.stringify(tempStudent));
                        response.end(JSON.stringify(tempStudent));
                        }
                    });    
                    exists = 1;
                }
            }); 
            if (exists == 0) {
                response.writeHead(400, {"Content-Type" : "application/json"});
                response.end(JSON.stringify({"error": 1,  "message": "Не найден студент с заданным id"}));
            }
        });
    }

    
    if (request.method == 'DELETE' && (/^\/\d+/).test(requestUrl)) {
        let id = url.parse(requestUrl, true).pathname.split('/')[1];
        let jsondata = JSON.parse(fs.readFileSync(jsonFilePath));  
        let exists = 0;
        jsondata.forEach(student => {
            if (student.id == id) {
                response.writeHead(200, {'Content-Type': 'application/json'});
                let tempStudent = jsondata.splice(jsondata.indexOf(student), 1);
                fs.writeFile(jsonFilePath, JSON.stringify(jsondata, null, 4), (e) => {
                    if (e) {
                        response.writeHead(400, {"Content-Type" : "application/json"});
                        response.end(JSON.stringify({"error": 3,  "message": "Ошибка при записи в файл"}));        
                    }
                    else {
                        console.log("Deleted student", JSON.stringify(tempStudent));
                        response.end(JSON.stringify(tempStudent));
                    }
                });    
                exists = 1;
            }
        }); 
        if (exists == 0) {
            response.writeHead(400, {"Content-Type" : "application/json"});
            response.end(JSON.stringify({"error": 1,  "message": "Не найден студент с заданным id"}));
        }
    }

    if (request.method == 'POST' && requestUrl == '/backup') {
        let currentDate = new Date();
        let formattedDate = '' + currentDate.getFullYear() + (currentDate.getMonth()+1) +
        currentDate.getDate()+ currentDate.getHours() +currentDate.getMinutes();

        setTimeout(() => {
            fs.copyFile(jsonFilePath, formattedDate + '_' + jsonFilePath, (e) => {
                if (e) {
                    response.writeHead(400, {"Content-Type" : "application/json"});
                    response.end(JSON.stringify({"error": 4,  "message": "Ошибка при создании копии файла"}));
                }
                else {
                    console.log(`Копия StudentList.json создана`);
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end('Copied.');
                }
            });
        }, 2*1000);
    }

    if (request.method == 'DELETE' && (/\/backup\/\d{8}/).test(requestUrl)) {
        let requestDate = url.parse(requestUrl, true).pathname.split('/')[2];

        fs.readdir('.', {withFileTypes: false}, (e, files) => {
            if (e) {
                response.writeHead(400, {"Content-Type" : "application/json"});
                response.write(JSON.stringify({"error": 5,  "message": "Ошибка при чтении директории"}));
            }
            else {
                files.forEach(file => {
                    let filedate = file.slice(0,8);
                    if ((/\d{7,}\w+/).test(filedate) && filedate < requestDate) {
                        fs.unlink(file, (e) => {
                            if (e) {
                                response.writeHead(400, {"Content-Type" : "application/json"});
                                response.write(JSON.stringify({"error": 6,  "message": `Ошибка удалении файла ${file}`}));
                            }
                            else {
                                console.log(`Файл ${file} удален`);
                            }
                        });
                    }
                });
            }
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(JSON.stringify({"success": true, "message": "Удаление файлов завершено"}));                
            response.end();
        })
    }

    if (request.method == 'GET' && requestUrl == '/backup') {
        fs.readdir('.', {withFileTypes: false}, (err, files) => {
            response.setHeader('Content-Type', 'application/json');
            let json = [];
            files.forEach(file => {
                let filedate = file.slice(0,8);
                if ((/\d{7,}\w+/).test(filedate)) json.push(file);
            });
            response.end(JSON.stringify(json));
        });
    }

}).listen(5000);