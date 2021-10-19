const async = require('async');
const WebSocketClient =  require('rpc-websockets').Client;
let client = new WebSocketClient('ws://localhost:4000');

client.on('open', () => async.parallel({
    "Площадь круга": (cb) => { client.call('square', [3]).then((result)=>{ cb(null, result)}); },
    "Площадь прямоугольника": (cb) => { client.call('square', [5, 4]).then((result)=>{ cb(null, result)}); },

    "Сумма переданных параметров (2)": (cb) => { client.call('sum', [2]).then((result)=>{ cb(null, result)}); },
    "Сумма переданных параметров (2, 4, 6, 8, 10)": (cb) => { client.call('sum', [2, 4, 6, 8, 10]).then((result)=>{ cb(null, result)}); },

    "Произведение переданных параметров (3)": (cb) => { client.call('mul', [3]).then((result)=>{ cb(null, result)}); },
    "Произведение переданных параметров (3, 5, 7, 9, 11, 13)": (cb) => { client.call('mul', [3, 5, 7, 9, 11, 13]).then((result)=>{ cb(null, result)}); },

    "Массив, содержащий 1 элемент последовательности Фибоначчи": (cb) => {
        client.login({username: 'liza', password: 'liza'}).then(() => {
            client.call('fib', 1).then((result)=>{cb(null, result);});
        })
    },
    "Массив, содержащий 2 элемента последовательности Фибоначчи": (cb) => {
        client.login({username: 'liza', password: 'liza'}).then(() => {
            client.call('fib', 2).then((result)=>{cb(null, result);});
        })
    },
    "Массив, содержащий 7 элементов последовательности Фибоначчи": (cb) => {
        client.login({username: 'liza', password: 'liza'}).then(() => {
            client.call('fib', 7).then((result)=>{cb(null, result);});
        })
    },
    "Факториал числа 0": (cb) => {
        client.login({username: 'liza', password: 'liza'}).then(() => {
            client.call('fact', 0).then((result)=>{cb(null, result);});            
        })
    },
    "Факториал числа 5": (cb) => {
        client.login({username: 'liza', password: 'liza'}).then(() => {
            client.call('fact', 5).then((result)=>{cb(null, result);});            
        })
    },
    "Факториал числа 10": (cb) => {
        client.login({username: 'liza', password: 'liza'}).then(() => {
            client.call('fact', 10).then((result)=>{cb(null, result);});            
        })
    }
},
(error, result) => {
    if(error) console.log('error = ', error);
    else console.log('result = ', result);
    client.close();
}
));
