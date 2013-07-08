var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.config('control:altitude_max', 2700);

client.on('navdata', console.log);

client.takeoff();
client
.after(100, function() {
	this.up(1);
})
.after(10000, function() {
	this.stop();
	this.land();
});
