const http = require('http');
const {readFileSync} = require('fs');
const {graphql, buildSchema} = require('graphql');
const schema = buildSchema(readFileSync('./schema.gql').toString());
const { DB, resolver } = require('./m16.js');

const context = DB((err) => {
    if (err) console.log('Ошибка соединения с БД: ', err.code + '--' + err.message);
    else  console.log('Соединение с БД установлено');
});

http.createServer(function(request, response) {
    if (request.method === 'POST') {
        let result = '';
        request.on('data', (data) => { result += data; });
        request.on('end', () => {
            try {
                let obj = JSON.parse(result);
                if (obj.mutation) {
                    graphql(schema, obj.mutation, resolver.Mutation, context, obj.variables)
                    .then((records) => {
                            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            response.end(JSON.stringify(records))
                        }, 
                        (err)=> {
                            response.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                            response.end(JSON.stringify({error: err.code, message: err.message}))
                        }
                    );
                }
                if (obj.query) {
                    graphql(schema, obj.query, resolver.Query, context, obj.variables)
                    .then((records) => {
                        response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        response.end(JSON.stringify(records))
                    }, 
                    (err)=> {
                        response.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                        response.end(JSON.stringify({error: err.code, message: err.message}))
                    }
                );
                }
            }
            catch (err) {
                response.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
                response.end(JSON.stringify({error: err.code, message: err.message}))
            }
        })
    }
    else {
        response.writeHead(405, {'Content-Type': 'application/json; charset=utf-8'});
        response.end('405 Not Allowed');
    }
}).listen(3000);
