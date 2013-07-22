var serialport = require("serialport").SerialPort;
var sys = require("sys");

console.log('test');

var sp = new serialport().SerialPort("/dev/ttyO3", {
	baud: 9600
});

setInterval(function (){
	serial_port.write("B");

}, 1000);