const http = require('http');
const fs = require('fs');
const url = require('url');

const jsonFilePath = 'StudentList.json';

http.createServer(function (request, response) {
    let requestUrl = url.parse(request.url, true).pathname;

    if (request.method == 'GET' && requestUrl == '/') {
        response.writeHead(200, {"Content-Type" : "application/json"});
        fs.createReadStream(jsonFilePath).pipe(response);
    }

    if (request.method == 'GET' && (/\d/).test(requestUrl)) {
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
            response.end('No student');
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
                    response.end('Student already exists');
                    exists = 1;
                }
            }); 
            if (exists == 0) {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                jsondata.push(tempStudent);
                fs.writeFile(jsonFilePath, JSON.stringify(jsondata, null, 4), (e) => {
                    if (e) throw e;
                    console.log("Add student", JSON.stringify(tempStudent));
                    response.end(JSON.stringify(tempStudent));
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
                    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    jsondata.splice(jsondata.indexOf(student), 1, tempStudent);
                    fs.writeFile(jsonFilePath, JSON.stringify(jsondata, null, 4), (e) => {
                        if (e) throw e;
                        console.log("Updated student", JSON.stringify(tempStudent));
                        response.end(JSON.stringify(tempStudent));
                    });    
                    exists = 1;
                }
            }); 
            if (exists == 0) {
                response.writeHead(400, {"Content-Type" : "application/json"});
                response.end('No student');
            }
        });
    }

    if (request.method == 'DELETE' && (/\d/).test(requestUrl)) {
        let id = url.parse(requestUrl, true).pathname.split('/')[1];
        let jsondata = JSON.parse(fs.readFileSync(jsonFilePath));  
        let exists = 0;
        jsondata.forEach(student => {
            if (student.id == id) {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                let tempStudent = jsondata.splice(jsondata.indexOf(student), 1); //removed 3rd param
                fs.writeFile(jsonFilePath, JSON.stringify(jsondata, null, 4), (e) => {
                    if (e) throw e;
                    console.log("Deleted student", JSON.stringify(tempStudent));
                    response.end(JSON.stringify(tempStudent));
                });    
                exists = 1;
            }
        }); 
        if (exists == 0) {
            response.writeHead(400, {"Content-Type" : "application/json"});
            response.end('No student');
        }
    }

    if (request.method == 'POST' && requestUrl == '/backup') {
        let currentDate = new Date();
        let formattedDate = '' + currentDate.getFullYear() + (currentDate.getMonth()+1) +
        currentDate.getDate()+ currentDate.getHours() +currentDate.getMinutes();

        setTimeout(() => {
            fs.copyFile(jsonFilePath, formattedDate + '_' + jsonFilePath, (e) => {
                if (e) throw e;
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                response.end('Copied.');
            });
        }, 2*1000);
    }

    if (request.method == 'DELETE' && (/\/backup\/\d{8}/).test(requestUrl)) {
        let requestDate = url.parse(requestUrl, true).pathname.split('/')[2];
        fs.readdir('.', {withFileTypes: false}, (err, files) => {
            if (err) throw err;
            files.forEach(file => {
                let filedate = file.slice(0,8);
                if ((/\d{7,}\w+/).test(filedate) && filedate < requestDate) {
                    fs.unlink(file, (e) => {
                        if (e) throw e;
                        console.log(`File ${file} deleted`);
                    });
                }
            });
            //response.end("Success");
        });
        //resp end
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