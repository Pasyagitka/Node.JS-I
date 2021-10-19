const ws = require('ws');
const client = new ws.WebSocket('ws://localhost:4000');

client.onmessage = (message) =>{ 
    console.log(`Сообщение от сервера: ${message.data}`);
};

client.on('ping', (data) => {
    console.log('--> ping: ', data.toString());
})
