const http = require('http');
const fs = require('fs');
 
const request = http.request(
  {
    hostname: 'localhost',
    port: '5000',
    path: '/09-08',
    method: 'GET'
  },
  response => {
      response.pipe(fs.createWriteStream('./static/MyFileGET.txt'));
      console.log("Success");
  }
);
//errors
request.end();
