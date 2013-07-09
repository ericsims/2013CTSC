var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.config('control:altitude_max', 2000);

//client.on('navdata', console.log);

client.takeoff();
client
.after(100, function() {
	this.up(1);
})
.after(25000, function() {
	this.stop();
	this.land();
});
