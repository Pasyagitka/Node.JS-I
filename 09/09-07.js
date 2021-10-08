const http = require('http');
const fs = require('fs');
const FormData = require('form-data');


const form = new FormData();
form.append('myfile', fs.createReadStream('./pic.png'));

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/09-07',
  method: 'POST',
  headers: form.getHeaders(),
}

const request = http.request(options, response => {
  console.log(response.statusCode);
  response.on('data', (data) => { console.log(`${data}`); });
});

request.on('error', error => { console.error(error)})

form.pipe(request);