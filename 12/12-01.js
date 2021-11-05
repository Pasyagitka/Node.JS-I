const http = require('http');
const fs = require('fs');
const url = require('url');

const jsonFilePath = 'StudentList.json';

function Student(){
    this.id = -1;
    this.name="Anonymous";
    this.bday="0000-00-00";
    this.spec="ПОИТ";
}


let server = http.createServer(function (request, response) {
    let requestUrl = url.parse(request.url, true).pathname;

    if (request.method == 'GET' && requestUrl == '/') {
        response.writeHead(200, {"Content-Type" : "application/json"});
        fs.createReadStream(jsonFilePath).pipe(response);
    }

    if (request.method == 'GET' && (/\d/).test(requestUrl)) {
        let id = url.parse(requestUrl, true).pathname.split('/')[1];
        let data = JSON.parse(fs.readFileSync(jsonFilePath));
        data.forEach(student => {
            if (student.id == id) {
                response.writeHead(200, {"Content-Type" : "application/json"});
                response.end(JSON.stringify(student));
            }
        });
        response.writeHead(400, {"Content-Type" : "application/json"});
        response.end('No student');
    }

    if (request.method == 'POST' && requestUrl == '/') {
        let newStudent = new Student();

        request.on('data', data => 
        {
            let tempStudent = JSON.parse(data);
            newStudent.id = tempStudent.id;
        });
        console.log(newStudent.id);    


        let jsondata = JSON.parse(fs.readFileSync(jsonFilePath));   
        jsondata.forEach(student => {
            if (student.id == newStudent.id) {
                console.log('exists');
                response.writeHead(400, {"Content-Type" : "application/json"});
                response.end('Student already exists');
            }
        });

        response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        console.log('new');    


        //fs.appendFile(jsonFilePath, newStudent);     
        // response.writeHead(400, {"Content-Type" : "application/json"});
        // response.end('No student');
    }
   
}).listen(5000);