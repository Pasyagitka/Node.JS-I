const http = require('http');
const fs = require('fs');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/09-08',
  method: 'GET',
}
 
const request = http.request(options, response => {
  response.pipe(fs.createWriteStream('./static/MyFileGET.txt'));
  console.log("Success");
});

request.on('error', error => { console.error(error)})

request.end();