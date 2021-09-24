const http = require('http');
const url = require('url');
const fs = require('fs');

const nodemailer = require('nodemailer');
const testEmailAccount = require('./Credentials');

const {parse} = require('querystring');

let transporter = nodemailer.createTransport({
    service: "Yandex",
    auth: {
        user: testEmailAccount.user,
        pass: testEmailAccount.pass
    },
})

http.createServer(function (request, response) {

    response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
    if(url.parse(request.url).pathname === '/' && request.method == 'GET')
    {
        response.end(fs.readFileSync('./06-02.html'));
    }
    else if(url.parse(request.url).pathname === '/'  && request.method == 'POST') 
    {
        let body = '';
        request.on('data', chunk => {body += chunk.toString();});
        request.on('end', ()=> {
            let parm = parse(body);

            transporter.sendMail({
                from: 'pasyagitka@yandex.by',
                to: parm.receiverEmail,
                subject: '06-02',
                html: '<h1>' + parm.message + '</h1>',
            }, function(error, info) {
                error ? console.log(error) : console.log('Success: ' + info.response);}
            );
            response.end(`<h1>OK: ${parm.receiverEmail}, ${parm.senderEmail}, ${parm.message}</h1>`);
        })
    }
    else response.end('<h1>Not support</h1>');

}).listen(5000);