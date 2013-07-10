var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.config('control:altitude_max', 500);

client.on('navdata', console.log);

client.takeoff();
client
.after(10000, function() {
	this.stop();
	this.land();
});
