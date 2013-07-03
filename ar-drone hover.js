var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.config('control:altitude_max', 10000);

//client.on('navdata', console.log);

client.takeoff();
client
.after(5000, function() {
	this.up(1);
})
.after(5000, function() {
	this.stop();
	this.land();
});
