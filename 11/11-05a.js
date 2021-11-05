const WebSocketClient =  require('rpc-websockets').Client;
let client = new WebSocketClient('ws://localhost:4000');

client.on('open', () => {
    client.call('square', [3]).then((result)=>{console.log(`Площадь круга = ${result}`);});
    client.call('square', [5, 4]).then((result)=>{console.log(`Площадь прямоугольника = ${result}`);});
    
    client.call('sum', [2]).then((result)=>{console.log(`Сумма переданных параметров = ${result}`);});
    client.call('sum', [2, 4, 6, 8, 10]).then((result)=>{console.log(`Сумма переданных параметров = ${result}`);});
    
    client.call('mul', [3]).then((result)=>{console.log(`Произведение переданных параметров = ${result}`);});
    client.call('mul', [3, 5, 7, 9, 11, 13]).then((result)=>{console.log(`Произведение переданных параметров = ${result}`);});


    client.login({key: 'liza'}).then(() => {
        client.call('fib', 1).then((result)=>{console.log(`Массив, содержащий 1 элемент последовательности Фибоначчи: ${result}`);});
        client.call('fib', 2).then((result)=>{console.log(`Массив, содержащий 2 элемента последовательности Фибоначчи: ${result}`);});
        client.call('fib', 7).then((result)=>{console.log(`Массив, содержащий 7 элементов последовательности Фибоначчи: ${result}`);});
        
        client.call('fact', 0).then((result)=>{console.log(`Факториал числа 0 = ${result}`);});
        client.call('fact', 5).then((result)=>{console.log(`Факториал числа 5 = ${result}`);});            
        client.call('fact', 10).then((result)=>{console.log(`Факториал числа 10 = ${result}`);});            
    })
});