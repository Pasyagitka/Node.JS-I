const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/09-03',
  method: 'POST'
}

const request = http.request(options, response => {
  console.log(response.statusCode);
  response.on('data', (data) => { console.log(`${data}`); });
})

request.on('error', error => { console.error(error)})

request.end(JSON.stringify({
    x: 'xparm',
    y: 'yparm',
    s: 'sparm'
}));