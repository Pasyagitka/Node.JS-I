const ws = require('ws');
const client = new ws.WebSocket('ws://localhost:4000');

client.onmessage = (message) =>{ 
    console.log(`Сообщение от сервера: ${message.data}`);
};

client.onopen = () => {
   client.send(JSON.stringify({
        "client" : process.argv[2],
        "timestamp": Date.now()
   }));
};
