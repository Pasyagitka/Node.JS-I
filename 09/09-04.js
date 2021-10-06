const http = require('http');


const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/09-04',
  method: 'POST',
  headers: {
    'Content-Type' : 'application/json',
    'Accept' : 'application/json'
  }
}

const request = http.request(options, response => {
  console.log(response.statusCode);
  response.on('data', (data) => { console.log(`${data}`); });
})

request.on('error', error => { console.error(error)})

request.end(JSON.stringify({
    "__comment": "Запрос. Лабораторная работа 9",
    "x": 1,
    "y": 2,
    "s": "Сообщение",
    "m": ["a", "b", "c", "d"],
    "o": {"surname": "Иванов", "name": "Иван"}
}));