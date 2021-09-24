const util = require('util');
const events = require('events');

let dbData = [
	{id: 0, name: 'Зинович', bday: '2001-01-01'},
	{id: 1, name: 'Bbbbb', bday: '2001-01-02'},
	{id: 2, name: 'Ccccc.', bday: '2001-01-03'},
	{id: 3, name: 'Ddddd.', bday: '2001-01-04'},
	{id: 4, name: 'Rrrrrrr.', bday: '2001-01-05'}
];

class Person{
    constructor(){
        this.id = -1;
        this.name="Anonymous";
        this.bday="0000-00-00";
    }
}

function DB() {
	this.getIndex = () => { return dbData.length; };
    this.select = () => { return dbData; };
    this.insert = row => { dbData.push(row); return row;};
    this.update = row => {
        let upIndex = dbData.findIndex(element => element.id === row.id);
        if (upIndex !== -1) {
            dbData[upIndex] = row;
			return row;
        }
        else {
	    	return JSON.parse('{"Ошибка": "неверный индекс"}');
		}
    };
    this.delete = id => {
		console.log(id);
	    let delIndex = dbData.findIndex(element => element.id === id);
		console.log(delIndex);
	    if(delIndex !== -1) {
	        let deleted = dbData.splice(delIndex, 1);
			return deleted;
	    }
	    else {
	    	return JSON.parse('{"Ошибка": "неверный индекс"}');
		}
    };
}
util.inherits(DB, events.EventEmitter);
exports.DB = DB;
module.exports.Person = Person;