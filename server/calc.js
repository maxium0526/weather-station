function gamma(T, RH){
	let a = 17.27;
	let b = 237.7;

	return (a*T) / (b + T) + Math.log(RH/100);
}

function dewPoint(T, RH){
	let a = 17.27;
	let b = 237.7;

	return (b*gamma(T, RH)) / (a - gamma(T, RH));
}

function c2f(c){
	return c*9/5 + 32;
}

function f2c(f){
	return (f - 32) * 5/9;
}

function heatIndex(TC, R){
	let c1 = -42.379;
	let c2 = 2.04901523;
	let c3 = 10.14333127;
	let c4 = -0.22475541;
	let c5 = -6.83783e-3;
	let c6 = -5.481717e-2;
	let c7 = 1.22874e-3;
	let c8 = 8.5282e-4;
	let c9 = -1.99e-6;

	let tf = c2f(TC);

	let hif =  c1 + c2*tf + c3*R + c4*tf*R + c5*tf*tf + c6*R*R + c7*tf*tf*R + c8*tf*R*R + c9*tf*tf*R*R;
	let hic = f2c(hif);
	return hic;
}

module.exports = {
	c2f, f2c, dewPoint, heatIndex
}