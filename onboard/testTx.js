var com = require("serialport");

var serialPort = new com.SerialPort("/dev/ttyO3", {
	baudrate: 9600,
	parser: com.parsers.readline('\r\n')
});

serialPort.on('open',function() {
	console.log('Port open');
	var last = 0;
	setInterval(function (){
		if(last > 0){
			serialPort.write("0\n");
			console.log("0");
			last = 0;
		} else {
			serialPort.write("100\n");
			console.log("100");
			last = 10;
		}
	}, 1000);
});

serialPort.on('data', function(data) {
	console.log(data);
});