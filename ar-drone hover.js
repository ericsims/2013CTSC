var arDrone = require('ar-drone');
var client = arDrone.createClient({ip: '192.168.1.11'});

client.config('control:altitude_max', 1000);

client.on('navdata', console.log);

client.takeoff();
client
.after(90000, function() {
	this.stop();
	this.land();
})
.after(1000, function() {
	process.exit();
});
