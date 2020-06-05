const calc = require('./calc.js');

class HTRecord{
	constructor(deviceId, temp, humi, date){
		this.deviceId = parseInt(deviceId);
		this.temp = Math.floor(parseFloat(temp) * 100) / 100;
		this.humi = Math.floor(parseFloat(humi) * 100) / 100;
		this.date = date;

		this.hi = Math.floor(calc.heatIndex(this.temp, this.humi) * 100) / 100;
		this.dp = Math.floor(calc.dewPoint(this.temp, this.humi) * 100) / 100;
	}

	getQuery(){
		return `(${this.deviceId}, ${this.temp}, ${this.humi}, ${this.date})`;
	}
}

module.exports = HTRecord;