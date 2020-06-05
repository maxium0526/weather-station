var express = require('express');
var app = express();
app.set('view engine', 'hbs');

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

var mysql = require('mysql');
var connection_info = require('./mysql_connection.js')

var HTRecord = require('./HTRecord.js');

records = [];
histRecords = [];

server.on('listening', function(){
	let address = server.address();
	console.log('Server started.');
	console.log('Listening to: ' + address.address + ':' + address.port+ '.');
});

server.on('message', function(msg, rinfo){
	let [deviceId, temp, humi] = msg.toString().split(',')
	records.push(new HTRecord(deviceId, temp, humi, Date.now()));
});

server.bind(52677);

//
setInterval(function(){
	if(records.length >= 1000){
		let query = 'INSERT INTO `HT_record` VALUES ';
		let temp = records;//take away all the records
		histRecords = histRecords.concat(records);//store current record to history
		records = [];
		temp = temp.map(r=>r.getQuery());
		query += temp.join(', ')
		
		query += ';';
		console.log(query);

		let mysql_connection = mysql.createConnection(connection_info);
		mysql_connection.connect();
		mysql_connection.query(query, function(err){
			if(err) throw err;
			mysql_connection.end();
		});
	}
}, 1000 * 60 * 60)

app.get('/', function(req, res){
	res.render('index', {});
})

app.get('/getRecord', function(req, res){
	let now = Date.now()
	let split = now - 86400 * 1000;
	let out = histRecords.concat(records).filter(r=>r.date>=split);
	res.json(out);
})

app.listen(52678);

let now = Date.now()
let split = now - 86400 * 1000;
let mysql_connection = mysql.createConnection(connection_info);
mysql_connection.connect();
mysql_connection.query('SELECT * FROM `HT_record` WHERE `date_js`>=?;',[split], function(err, rows){
	if(err) throw err;
	histRecords = rows.map(r=>{ return new HTRecord(r.device_id, r.temp, r.humi, r.date_js)})
	mysql_connection.end();
	
});