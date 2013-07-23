var net = require('net');
var server = net.createServer(function(c) { //'connection' listener
	console.log('server connected');
	c.on('end', function() {
		console.log('server disconnected');
	});
	c.on('data', function(data) {
		if(data.toString().indexOf("heat") !== -1){
		value = parseInt(data.toString().substring(4));
		console.log(value);
		c.write('on\n');
	}
	});
});

server.listen(8124, function() { //'listening' listener
	console.log('server bound');
});