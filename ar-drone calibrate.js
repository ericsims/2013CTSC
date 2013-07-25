var arDrone = require('ar-drone');
var client = arDrone.createClient({ip: '192.168.1.10'});

client.config('control:altitude_max', 500);

client.takeoff();
client
.after(5000, function() {
	this.calibrate(0);
})
.after(5000, function() {
	this.stop();
	this.land();
})
.after(1000, function() {
	process.exit();
});
