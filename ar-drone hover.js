var arDrone = require('ar-drone');
var client = arDrone.createClient({ip: '192.168.1.10'});

client.config('control:altitude_max', 1000);

client.on('navdata', console.log);

//client.takeoff();
client
.after(10000, function() {
	this.stop();
	this.land();
});
