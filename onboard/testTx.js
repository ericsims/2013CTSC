var serialport = require("serialport").SerialPort;
var sys = require("sys");

console.log('test');

var sp = new serialport().SerialPort("/dev/ttyS0", { // /dev/ttyO3
	baud: 9600
});

setInterval(function (){
	serial_port.write("10");
}, 1000);