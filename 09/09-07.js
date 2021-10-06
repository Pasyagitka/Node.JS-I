const http = require('http');
const fs = require('fs');
const FormData = require('form-data');

const readStream = fs.createReadStream('./pic.png');
 
const form = new FormData();
form.append('myfile', readStream);
 
const req = http.request(
  {
    hostname: 'localhost',
    port: '5000',
    path: '/09-06',
    method: 'POST',
    headers: form.getHeaders(),
  },
  response => {
    console.log(response.statusCode);
    response.on('data', (data) => { console.log(`${data}`); });
}
);
 
form.pipe(req);

// request.on('error', error => { console.error(error)})
// //todo а респонс он еррор?
