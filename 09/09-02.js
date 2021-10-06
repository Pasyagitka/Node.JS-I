const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/09-02?x=4&y=7',
  method: 'GET'
}

const request = http.request(options, response => {
  console.log(response.statusCode);
  response.on('data', (data) => { console.log(`${data}`); });
})

request.on('error', error => { console.error(error)})
request.end()