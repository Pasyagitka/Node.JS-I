const WebSocketClient =  require('rpc-websockets').Client;
let client = new WebSocketClient('ws://localhost:4000');

client.on('open', () => {
    client.login({username: 'liza', password: 'liza'}).then(async() => {
        console.log(
        await client.call('sum', 
            [
                await client.call('square', [3]), 
                await client.call('square', [5, 4]), 
                await client.call('mul', [3, 5, 7, 9, 11, 13])
            ])
        + (await client.call('fib', 7)).reduce((a, b) => a + b, 0)
        * await client.call('mul', [2, 4, 6])
        );
    })
});
