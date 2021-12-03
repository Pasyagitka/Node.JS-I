const http = require('http');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;

client = new MongoClient('mongodb+srv://pasyagitka:nodejs@nodejs.prtpp.mongodb.net/BSTU?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
connection = client.connect().then(connection => {console.log('Connection is established'); return connection.db('BSTU')});


GetCollection = (collection) =>  connection.then(db => {  return db.collection(collection).find({}).toArray()})

GetFacultyById = (id) =>  connection.then(db => { return db.collection('faculty').findOne({_id: id })})
GetPulpitById = (id) =>  connection.then(db => { return db.collection('pulpit').findOne({_id: id })})

InsertFaculty = (faculty, faculty_name) => connection.then(async db => { 
    return db.collection('faculty').insertOne({faculty: faculty, faculty_name: faculty_name });
});
InsertPulpit = (pulpit, pulpit_name, faculty) => connection.then(async db => { 
    return  db.collection('pulpit').insertOne({pulpit: pulpit, pulpit_name: pulpit_name, faculty: faculty})
});

UpdateFaculty = (faculty, faculty_name) => connection.then(async db => { 
    return db.collection('faculty').findOneAndUpdate({faculty: faculty}, {$set: {faculty_name: faculty_name}}, {returnDocument: 'after'})
});
UpdatePulpit = (pulpit, pulpit_name, faculty) => connection.then(async db => { 
    return db.collection('pulpit').findOneAndUpdate({pulpit: pulpit}, {$set: {pulpit_name: pulpit_name, faculty: faculty}}, {returnDocument: 'after'})
});


DeleteFaculty = (faculty) => connection.then(async db => { return db.collection('faculty').findOneAndDelete({faculty: faculty})});
DeletePulpit = (pulpit) => connection.then(async db => { return db.collection('pulpit').findOneAndDelete({pulpit: pulpit})});


http.createServer(function(request, response) {

    let requestUrl =  decodeURI(url.parse(request.url, true).pathname);

    function successCallback(records) {
        response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        response.end(JSON.stringify(records))
    }
    function successUpdateDeleteCallback(records) {
        response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        response.end(records.value != null? JSON.stringify(records.value) : JSON.stringify({message: "no data updated or deleted"}))
    }
    function failureCallback(err) {
        response.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
        response.end(JSON.stringify({error: err.code, message: err.message}))
    }

    if (request.method == 'GET' && requestUrl == '/api/faculties'){
        GetCollection('faculty').then(successCallback, failureCallback)
    }
    else if (request.method == 'GET' && requestUrl == '/api/pulpits'){
        GetCollection('pulpit').then(successCallback, failureCallback)
    }

    else if (request.method == 'POST' && requestUrl == '/api/faculties'){
        request.on('data',  data => {
            let newFaculty = JSON.parse(data); 
            InsertFaculty(newFaculty.faculty, newFaculty.faculty_name)
            .then(result => {GetFacultyById(result.insertedId).then(successCallback, failureCallback)}, failureCallback)  
        })
    }
    else if (request.method == 'POST' && requestUrl == '/api/pulpits'){
        request.on('data',  data => {
            let newPulpit = JSON.parse(data); 
            InsertPulpit(newPulpit.pulpit, newPulpit.pulpit_name, newPulpit.faculty)
            .then(result => {GetPulpitById(result.insertedId).then(successCallback, failureCallback)}, failureCallback)
        });
    }

    else if (request.method == 'PUT' && requestUrl == '/api/faculties'){
        request.on('data',  data => {
            let newFaculty = JSON.parse(data); 
            UpdateFaculty(newFaculty.faculty, newFaculty.faculty_name).then(successUpdateDeleteCallback, failureCallback)
        })
    }
    else if (request.method == 'PUT' && requestUrl == '/api/pulpits'){
        request.on('data',  data => {
            let newPulpit = JSON.parse(data); 
            UpdatePulpit(newPulpit.pulpit, newPulpit.pulpit_name, newPulpit.faculty).then(successUpdateDeleteCallback, failureCallback)
        });
    }

    else if (request.method == 'DELETE' && (/\/api\/faculties\/[А-Яа-яA-Za-z]/).test(requestUrl)){
        let id = url.parse(requestUrl, true).pathname.split('/')[3];
        DeleteFaculty(id).then(successUpdateDeleteCallback, failureCallback)   
    }
    else if (request.method == 'DELETE' && (/\/api\/pulpits\/[А-Яа-яA-Za-z]/).test(requestUrl)){
        let id = url.parse(requestUrl, true).pathname.split('/')[3];
        DeletePulpit(id).then(successUpdateDeleteCallback, failureCallback) 
    }

    else {
        response.writeHead(404, {'Content-Type': 'application/json;'});
        response.end(JSON.stringify({'error': '404 Not found'}));
    }

}).listen(3000);