const async = require('async');
const WebSocketClient =  require('rpc-websockets').Client;
let client = new WebSocketClient('ws://localhost:4000');


client.on('open', () => {
    client.login({key: 'liza'}).then(() => async.waterfall([
            function(cb) { 
                let sum = 0;
                client.call('square', [3]).then((result)=>{ sum += result; })
                client.call('square', [5, 4]).then((result)=>{ sum += result; })
                client.call('mul', [3, 5, 7, 9, 11, 13]).then((result)=>{ sum += result;  cb(null, sum);})
            },
            function(sum, cb) { 
                let fib, mul;
                client.call('fib', 7).then((result)=>{ fib = result.reduce((a, b) => a + b, 0);});
                client.call('mul', [2, 4, 6]).then((result)=>{ mul = result;  cb(null, sum + fib * mul);});
            },
        ],
        function (err, result) {
            console.log(result);
            client.close();
        }        
    )
    )
});

