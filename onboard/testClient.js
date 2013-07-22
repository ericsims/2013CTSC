var net = require('net');
var client = net.connect({port: 8124},
		function() { //'connect' listener
	console.log('client connected');
	client.write('ready');
});
client.on('data', function(data) {
	console.log(data.toString());
	//client.end();
});
client.on('end', function() {
	console.log('client disconnected');
});
var on = false;
setInterval(function(){
	if(!on) {
		client.write('heat99');
		on = true;
	} else {
		client.write('heat0');
		on = false;
	}
},3000);