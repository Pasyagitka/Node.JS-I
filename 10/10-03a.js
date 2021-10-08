const ws = require('ws');
let client = new ws.WebSocket('ws://localhost:4000');

client.onopen = () => {
    console.log('Подключен к серверу');
    setInterval(() => {client.send(`${Math.floor(Math.random()*10)}`)}, 5*1000);
};
client.onmessage = (message) =>{ 
    console.log(`Сообщение от сервера: ${message.data}`);
};
