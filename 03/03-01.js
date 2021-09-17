const http = require('http');
let state = 'norm';

http.createServer(function(request, response) {
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.end('<h1>' + state + '</h1>');
}).listen(5000);

process.stdin.setEncoding('utf-8');
process.stdout.write(state + '->');

process.stdin.on('readable', () => {
  let newstate = null;
  while ((newstate = process.stdin.read()) != null) 
  {
    let trimmed = newstate.trim();
  	if (trimmed === 'norm' || 
        trimmed === 'test' || 
        trimmed === 'stop' || 
        trimmed === 'idle') 
    {
      process.stdout.write('reg = ' + state + '--> ' + trimmed +'\n');
      state = trimmed;
      process.stdout.write(state + '->');
    }
    else if (trimmed === 'exit')   
    { 	
      process.exit(0);    
    }
    else 
    {  
      process.stderr.write(state + '->');   
    }
  }
});