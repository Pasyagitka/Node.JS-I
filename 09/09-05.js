const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/09-05',
  method: 'POST',
  headers: {
    'Content-Type' : 'text/xml',
    'Accept' : 'text/xml'
  }
}

const request = http.request(options, response => {
  console.log(response.statusCode);
  response.on('data', (data) => { console.log(`${data}`); });
})

request.on('error', error => { console.error(error)})

request.end(`
    <request id="28">
        <x value = "1"/>
        <x value = "2"/>
        <m value = "a"/>
        <m value = "b"/>
        <m value = "c"/>
    </request>`
);