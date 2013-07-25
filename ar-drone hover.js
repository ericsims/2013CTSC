var arDrone = require('ar-drone');
var client = arDrone.createClient({ip: '192.168.1.10'});

client.config('control:altitude_max', 1000);

client.on('navdata', console.log);

client.config('control:ardrone_at_set_flat_trim', 1);
client
.after(10000, function() {

	process.exit();
	//client.takeoff();
})
.after(90000, function() {
	this.stop();
	this.land();
})
.after(1000, function() {
	process.exit();
});
