const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/09-01',
  method: 'GET'
}

const request = http.request(options, response => {
  console.log(response.statusCode);
  console.log(response.statusMessage);
  console.log(response.socket.remoteAddress);
  console.log(response.socket.remotePort);
  response.on('data', (data) => { console.log(`${data}`); });
})

request.on('error', error => {  console.error(error)})
request.end()