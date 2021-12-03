const http = require('http');
const fs = require('fs');
const url = require('url');
const sql = require('mssql');

const config = {user: 'Node.JS', password: 'node', server: 'localhost', database: 'Node.js14',  options: {trustServerCertificate: true }};
const htmlFilename = '14.html';

const pool = new sql.ConnectionPool(config, err => {
    if (err) console.log('Ошибка соединения с БД: ', err.code + '--' + err.message);
    else  console.log('Соединение с БД установлено');
});
const poolConnect = pool.connect();

let InsertFaculty = (pool, faculty, faculty_name, _cb) => {
    const cb = _cb?_cb:(err, result)=> {console.log('default cb')};
    let ps = new sql.PreparedStatement(pool);
    ps.input('faculty', sql.VarChar(10));
    ps.input('faculty_name', sql.VarChar(50));
    ps.prepare('INSERT INTO FACULTY (FACULTY, FACULTY_NAME ) VALUES (@faculty, @faculty_name)', err => {
        if (err) cb(err, null);
        else    ps.execute({faculty: faculty, faculty_name: faculty_name}, (err, result) => {
                    if (err) cb(err, null);
                    else cb(null, result, JSON.stringify({faculty: faculty, faculty_name: faculty_name}));
                });
    })
};

let InsertPulpit = (pool, pulpit, pulpit_name, faculty, _cb) => {
    const cb = _cb?_cb:(err, result)=> {console.log('default cb')};
    let ps = new sql.PreparedStatement(pool);
    ps.input('pulpit', sql.NVarChar(20));
    ps.input('pulpit_name', sql.NVarChar(100));
    ps.input('faculty', sql.NVarChar(10));
    ps.prepare('INSERT INTO PULPIT(PULPIT, PULPIT_NAME, FACULTY) values(@pulpit, @pulpit_name, @faculty)', err => {
        if (err) cb(err, null);
        else    ps.execute({pulpit: pulpit, pulpit_name: pulpit_name, faculty: faculty}, (err, result) => {
                    if (err) cb(err, null);
                    else cb(null, result, JSON.stringify({pulpit: pulpit, pulpit_name: pulpit_name, faculty: faculty}));
                });
    })
};

let InsertSubjects = (pool, subject, subject_name, pulpit, _cb) => {
    const cb = _cb?_cb:(err, result)=> {console.log('default cb')};
    let ps = new sql.PreparedStatement(pool);
    ps.input('subject', sql.NVarChar(10));
    ps.input('subject_name', sql.NVarChar(100));
    ps.input('pulpit', sql.NVarChar(20));
    ps.prepare('INSERT INTO SUBJECT(SUBJECT, SUBJECT_NAME, PULPIT) values(@subject, @subject_name, @pulpit)', err => {
        if (err) cb(err, null);
        else ps.execute({subject: subject, subject_name: subject_name, pulpit: pulpit}, (err, result) => {
                    if (err) cb(err, null);
                    else cb(null, result, JSON.stringify({subject: subject, subject_name: subject_name, pulpit: pulpit}));
            });
    })
};

let InsertAuditorium = (pool, aud, type, capacity, _cb) => {
    const cb = _cb?_cb:(err, result)=> {console.log('default cb')};
    let ps = new sql.PreparedStatement(pool);
    ps.input('aud', sql.VarChar(20));
    ps.input('type', sql.VarChar(10));
    ps.input('capacity', sql.Int);
    ps.prepare('insert into auditorium(auditorium, auditorium_type, auditorium_capacity) values (@aud, @type, @capacity)', err => {
        if (err) cb(err, null);
        else    ps.execute({aud: aud, type: type, capacity: capacity}, (err, result) => {
                    if (err) cb(err, null);
                    else cb(null, result, JSON.stringify({aud: aud, type: type, capacity: capacity}));
                });
    })
};

let InsertAuditoriumTypes = (pool, type, typename, _cb) => {
    const cb = _cb?_cb:(err, result)=> {console.log('default cb')};
    let ps = new sql.PreparedStatement(pool);
    ps.input('type', sql.NVarChar(10));
    ps.input('typename', sql.NVarChar(30));
    ps.prepare('INSERT INTO AUDITORIUM_TYPE(AUDITORIUM_TYPE, AUDITORIUM_TYPENAME) values(@type, @typename)', err => {
        if (err) cb(err, null);
        else ps.execute({type: type, typename: typename}, (err, result) => {
                    if (err) cb(err, null);
                    else cb(null, result, JSON.stringify({type: type, typename: typename}));
            });
    })
};

let UpdateFaculty = (pool, faculty, faculty_name, _cb) => {
    const cb = _cb?_cb:(err, result)=> {console.log('default cb')};
    let ps = new sql.PreparedStatement(pool);
    ps.input('faculty', sql.VarChar(10));
    ps.input('faculty_name', sql.VarChar(50));
    ps.prepare('update faculty set faculty_name = @faculty_name  where faculty = @faculty', err => {
        if (err) cb(err, null);
        else    ps.execute({faculty: faculty, faculty_name: faculty_name}, (err, result) => {
                    if (err) cb(err, null);
                    else cb(null, result, JSON.stringify({faculty: faculty, faculty_name: faculty_name}));
                });
    })
};

let UpdatePulpit = (pool, pulpit, pulpit_name, faculty, _cb) => {
    const cb = _cb?_cb:(err, result)=> {console.log('default cb')};
    let ps = new sql.PreparedStatement(pool);
    ps.input('pulpit', sql.NVarChar(20));
    ps.input('pulpit_name', sql.NVarChar(100));
    ps.input('faculty', sql.NVarChar(10));
    ps.prepare('update pulpit set pulpit_name = @pulpit_name, faculty = @faculty where pulpit = @pulpit', err => {
        if (err) cb(err, null);
        else    ps.execute({pulpit: pulpit, pulpit_name: pulpit_name, faculty: faculty}, (err, result) => {
                    if (err) cb(err, null);
                    else cb(null, result, JSON.stringify({pulpit: pulpit, pulpit_name: pulpit_name, faculty: faculty}));
                });
    })
};

let UpdateSubjects = (pool, subject, subject_name, pulpit, _cb) => {
    const cb = _cb?_cb:(err, result)=> {console.log('default cb')};
    let ps = new sql.PreparedStatement(pool);
    ps.input('subject', sql.NVarChar(10));
    ps.input('subject_name', sql.NVarChar(100));
    ps.input('pulpit', sql.NVarChar(20));
    ps.prepare('update subject set subject_name = @subject_name, pulpit = @pulpit where subject = @subject', err => {
        if (err) cb(err, null);
        else ps.execute({subject: subject, subject_name: subject_name, pulpit: pulpit}, (err, result) => {
                    if (err) cb(err, null);
                    else cb(null, result, JSON.stringify({subject: subject, subject_name: subject_name, pulpit: pulpit}));
            });
    })
};

let UpdateAuditorium = (pool, aud, type, capacity, _cb) => {
    const cb = _cb?_cb:(err, result)=> {console.log('default cb')};
    let ps = new sql.PreparedStatement(pool);
    ps.input('aud', sql.VarChar(20));
    ps.input('type', sql.VarChar(10));
    ps.input('capacity', sql.Int);
    ps.prepare('update auditorium set auditorium_type = @type, AUDITORIUM_CAPACITY = @capacity where auditorium = @aud', err => {
        if (err) cb(err, null);
        else    ps.execute({aud: aud, type: type, capacity: capacity}, (err, result) => {
                    if (err) cb(err, null);
                    else cb(null, result, JSON.stringify({aud: aud, type: type, capacity: capacity}));
                });
    })
};

let UpdateAuditoriumTypes = (pool, type, typename, _cb) => {
    const cb = _cb?_cb:(err, result)=> {console.log('default cb')};
    let ps = new sql.PreparedStatement(pool);
    ps.input('type', sql.NVarChar(10));
    ps.input('typename', sql.NVarChar(30));
    ps.prepare('update AUDITORIUM_TYPE set AUDITORIUM_TYPENAME = @typename where AUDITORIUM_TYPE = @type', err => {
        if (err) cb(err, null);
        else ps.execute({type: type, typename: typename}, (err, result) => {
                    if (err) cb(err, null);
                    else cb(null, result, JSON.stringify({type: type, typename: typename}));
            });
    })
};


let DeleteFaculties = (pool, faculty, _cb) => {
    console.log('DeleteFaculties');
    const cb = _cb?_cb:(err, result)=> {console.log('default cb')};
    let ps = new sql.PreparedStatement(pool);
    ps.input('faculty', sql.NVarChar(10));
    ps.prepare(`update pulpit set faculty = null where faculty = @faculty; 
                delete from faculty where faculty = @faculty`, err => {
        if (err) cb(err, null);
        else ps.execute({faculty: faculty}, (err, result) => {
                    if (err) cb(err, null);
                    else {
                        console.log(result);
                        result.rowsAffected[1] > 0 ? 
                        cb(null, result, JSON.stringify({faculty: faculty,'Pulpits removed': result.rowsAffected[0], 'Faculties deleted': result.rowsAffected[1]}))
                        :
                        cb(null, result, JSON.stringify({faculty: 'none', message: 'no faculty deleted'}));
                    }
            });
    })
};


let DeletePulpits = (pool, pulpit, _cb) => {
    const cb = _cb?_cb:(err, result)=> {console.log('default cb')};
    let ps = new sql.PreparedStatement(pool);
    ps.input('pulpit', sql.NVarChar(20));
    ps.prepare(`update subject set pulpit = null where pulpit = @pulpit;
                update teacher set pulpit = null where pulpit = @pulpit; 
                delete from pulpit where pulpit = @pulpit`, err => {
        if (err) cb(err, null);
        else ps.execute({pulpit: pulpit}, (err, result) => {
            if (err) cb(err, null);
            else {
                result.rowsAffected[2] > 0 ? 
                cb(null, result, JSON.stringify({pulpit: pulpit, 'subjects removed': result.rowsAffected[0], 'teachers removed': result.rowsAffected[1], 'pulpits deleted': result.rowsAffected[2]}))
                :
                cb(null, result, JSON.stringify({pulpit: 'none', message: 'no pulpit deleted'}));
            }
        });
    })
};

let DeleteSubjects = (pool, subject, _cb) => {
    const cb = _cb?_cb:(err, result)=> {console.log('default cb')};
    let ps = new sql.PreparedStatement(pool);
    ps.input('subject', sql.NVarChar(10));
    ps.prepare('delete from subject where subject = @subject', err => {
        if (err) cb(err, null);
        else ps.execute({subject: subject}, (err, result) => {
                    if (err) cb(err, null);
                    else {
                        result.rowsAffected > 0 ? 
                        cb(null, result, JSON.stringify({subject: subject, rowsAffected: result.rowsAffected[0]}))
                        :
                        cb(null, result, JSON.stringify({subject: 'none', message: 'no subject deleted'}));
                    }
            });
    })
};

let DeleteAuditoriums = (pool, aud, _cb) => {
    const cb = _cb?_cb:(err, result)=> {console.log('default cb')};
    let ps = new sql.PreparedStatement(pool);
    ps.input('aud', sql.VarChar(20));
    ps.prepare('delete from auditorium where auditorium = @aud', err => {
        if (err) cb(err, null);
        else    ps.execute({aud: aud}, (err, result) => {
                    if (err) cb(err, null);
                    else {
                        result.rowsAffected > 0 ? 
                        cb(null, result, JSON.stringify({aud: aud, rowsAffected: result.rowsAffected[0]}))
                        :
                        cb(null, result, JSON.stringify({aud: 'none', message: 'no auditorium deleted'}));
                    }
                });
    })
};

let DeleteAuditoriumTypes = (pool, type, _cb) => {
    const cb = _cb?_cb:(err, result)=> {console.log('default cb')};
    let ps = new sql.PreparedStatement(pool);
    ps.input('type', sql.NVarChar(10));
    ps.prepare(`update auditorium set AUDITORIUM_TYPE = null where AUDITORIUM_TYPE = @type; 
                delete from AUDITORIUM_TYPE where AUDITORIUM_TYPE = @type`, err => {
        if (err) cb(err, null);
        else ps.execute({type: type}, (err, result) => {
                    if (err) cb(err, null);
                    else{
                        result.rowsAffected[1] > 0 ? 
                        cb(null, result, JSON.stringify({type: type, 'auditoriums removed': result.rowsAffected[0], 'types deleted': result.rowsAffected[1]}))
                        :
                        cb(null, result, JSON.stringify({type: 'none', message: 'no type deleted'}));
                    } 
            });
    })
};

http.createServer(function(request, response) {
	
    let requestUrl = decodeURI(url.parse(request.url, true).pathname);
    
    let SelectRequestCallback = (err, result) => {
        if (err) {
            response.writeHead(400, {'Content-Type': 'application/json;charset=utf-8'});
            response.end(JSON.stringify({error_code: err.code, message: err.message}));
        }
        else {
            response.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
            response.end(JSON.stringify(result.recordset));
        }
    }
    let ReturnJSONCallback = (err, result, data) => {
        if (err) {
            response.writeHead(400, {'Content-Type': 'application/json;charset=utf-8'});
            response.end(JSON.stringify({error_code: err.code, message: err.message}));
        }
        else {
            response.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
            response.end(data);
        }
    }
  
    if (request.method == 'GET' && requestUrl == '/'){
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(fs.readFileSync(htmlFilename));
    }
    else if (request.method == 'GET' && requestUrl == '/api/faculties'){
        poolConnect.then((pool) => { pool.request().query('select * from faculty', SelectRequestCallback)});
    }
    else if (request.method == 'GET' && requestUrl == '/api/pulpits'){
        poolConnect.then((pool) => { pool.request().query('select pulpit, pulpit_name, faculty from pulpit', SelectRequestCallback)});
    }
    else if (request.method == 'GET' && requestUrl == '/api/subjects'){
        poolConnect.then((pool) => { pool.request().query('select * from subject', SelectRequestCallback)});
    }
    else if (request.method == 'GET' && requestUrl == '/api/auditoriumtypes'){
        poolConnect.then((pool) => { pool.request().query('select * from auditorium_type', SelectRequestCallback)});
    }
    else if (request.method == 'GET' && requestUrl == '/api/auditoriums'){
        poolConnect.then((pool) => { pool.request().query('select * from auditorium', SelectRequestCallback)});
    }


    else if (request.method == 'POST' && requestUrl == '/api/faculties'){
        request.on('data',  data => {
            let newFaculty = JSON.parse(data); 
            poolConnect.then((pool) => {InsertFaculty(pool, newFaculty.faculty, newFaculty.faculty_name, ReturnJSONCallback)})
        })
    }
    else if (request.method == 'POST' && requestUrl == '/api/pulpits'){
        request.on('data',  data => {
            let newPulpit = JSON.parse(data); 
            poolConnect.then((pool) => {InsertPulpit(pool, newPulpit.pulpit, newPulpit.pulpit_name, newPulpit.faculty, ReturnJSONCallback)})   
        });
    }
    else if (request.method == 'POST' && requestUrl == '/api/subjects'){
        request.on('data',  data => {
            let newSubject = JSON.parse(data);
            poolConnect.then((pool) => {InsertSubjects(pool, newSubject.subject, newSubject.subject_name, newSubject.pulpit, ReturnJSONCallback)})   
        })
    }
    else if (request.method == 'POST' && requestUrl == '/api/auditoriumtypes'){
        request.on('data',  data => {
            let newType = JSON.parse(data);
            poolConnect.then((pool) => {InsertAuditoriumTypes(pool, newType.type, newType.typename, ReturnJSONCallback)}) 
        })  
    }
    else if (request.method == 'POST' && requestUrl == '/api/auditoriums'){
        request.on('data',  data => {
            let newAuditorium = JSON.parse(data);
            poolConnect.then((pool) => {InsertAuditorium(pool, newAuditorium.auditorium, newAuditorium.auditorium_type, newAuditorium.capacity, ReturnJSONCallback)})
        })
    }


    else if (request.method == 'PUT' && requestUrl == '/api/faculties'){
        request.on('data',  data => {
            let newFaculty = JSON.parse(data);
            poolConnect.then((pool) => {UpdateFaculty(pool, newFaculty.faculty, newFaculty.faculty_name, ReturnJSONCallback)})
        })
    }
    else if (request.method == 'PUT' && requestUrl == '/api/pulpits'){
        request.on('data',  data => {
            let newPulpit = JSON.parse(data); 
            poolConnect.then((pool) => {UpdatePulpit(pool, newPulpit.pulpit, newPulpit.pulpit_name, newPulpit.faculty, ReturnJSONCallback)})   
        });
    }
    else if (request.method == 'PUT' && requestUrl == '/api/subjects'){
        request.on('data',  data => {
            let newSubject = JSON.parse(data);
            poolConnect.then((pool) => {UpdateSubjects(pool, newSubject.subject, newSubject.subject_name, newSubject.pulpit, ReturnJSONCallback)})   
        })
    }
    else if (request.method == 'PUT' && requestUrl == '/api/auditoriumtypes'){
        request.on('data',  data => {
            let newType = JSON.parse(data);
            poolConnect.then((pool) => {UpdateAuditoriumTypes(pool, newType.type, newType.typename, ReturnJSONCallback)}) 
        })  
    }
    else if (request.method == 'PUT' && requestUrl == '/api/auditoriums'){
        request.on('data',  data => {
            let newAuditorium = JSON.parse(data);
            poolConnect.then((pool) => {UpdateAuditorium(pool, newAuditorium.auditorium, newAuditorium.auditorium_type, newAuditorium.capacity, ReturnJSONCallback)})
        })
    }


    else if (request.method == 'DELETE' && (/\/api\/faculties\/[А-Яа-яA-Za-z]/).test(requestUrl)){
        let id = url.parse(requestUrl, true).pathname.split('/')[3];
        poolConnect.then((pool) => {DeleteFaculties(pool, id, ReturnJSONCallback)})
    }
    else if (request.method == 'DELETE' && (/\/api\/pulpits\/[А-Яа-яA-Za-z]/).test(requestUrl)){
        let id = url.parse(requestUrl, true).pathname.split('/')[3];
        poolConnect.then((pool) => {DeletePulpits(pool, id, ReturnJSONCallback)})
    }
    else if (request.method == 'DELETE' && (/\/api\/subjects\/[А-Яа-яA-Za-z]/).test(requestUrl)){
        let id = url.parse(requestUrl, true).pathname.split('/')[3];
        poolConnect.then((pool) => {DeleteSubjects(pool, id, ReturnJSONCallback)})
    }
    else if (request.method == 'DELETE' && (/\/api\/auditoriumtypes\/[А-Яа-яA-Za-z]/).test(requestUrl)){
        let id = url.parse(requestUrl, true).pathname.split('/')[3];
        poolConnect.then((pool) => {DeleteAuditoriumTypes(pool, id, ReturnJSONCallback)})
    }
    else if (request.method == 'DELETE' && (/\/api\/auditoriums\/[А-Яа-яA-Za-z]/).test(requestUrl)){
        let id = url.parse(requestUrl, true).pathname.split('/')[3];
        poolConnect.then((pool) => {DeleteAuditoriums(pool, id, ReturnJSONCallback)})
    }

    else {
        response.writeHead(404, {'Content-Type': 'application/json;'});
        response.end('404 Not found');
    }
}).listen(3000);


// let processing_result = (err, result) => {
//     if (err) console.log('Processing result error', err.code, err.originalError.info.message);
//     else {
//         console.log('Количество строк: ', result.rowsAffected[0]);
//         for (let i = 0; i < result.rowsAffected[0]; i++) {
//             let str = '---';
//             for (key in result.recordset[i]) {
//                 str += `${key} = ${result.recordset[i][key]}`;
//             }
//             console.log(str);
//         }
//     }
// }


// let GetPulpit =  (pool, pulpit) => {
//     const cb = (err, result)=> {
//         if (err) { return(JSON.stringify({error_code: err.code, message: err.message})); }
//         else { return(JSON.stringify(result)); }
//     };
//     let ps = new sql.PreparedStatement(pool);
//     ps.input('pulpit', sql.NVarChar(20));
//     ps.prepare('select * from pulpit where pulpit = @pulpit', err => {
//         if (err) cb(err, null);
//         else ps.execute({pulpit: pulpit}, (err, result) => {
//             if (err) cb(err, null);
//             else {
//                 console.log('result1', result.recordset);
//                 cb(null, result.recordset);
//             }
//         })
//     });
// }
