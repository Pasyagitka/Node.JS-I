const ws = require('ws');

let client = new ws.WebSocket('ws://localhost:4000');

client.onopen = () => {
    let n = 0;
    console.log('Клиент подключен к серверу');
    let timer = setInterval(() => {   client.send(`10-01-client: ${++n}`);   console.log(`На сервер отправлено сообщение, n=${n}`);    }, 3*1000);
    setTimeout(() => { console.log('25 секунд прошло. Клиент отключается');  clearInterval(timer);  client.close()    }, 25*1000);
};
client.onmessage = (message) =>{
    console.log(`Сообщение от сервера: ${message.data}`);
};
