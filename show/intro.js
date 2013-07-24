var arDrone = require('ar-drone');
var client = arDrone.createClient({ip: '192.168.1.10'});

client.config('control:altitude_max', 2000);

//client.on('navdata', console.log);

client.takeoff();
client
.after(5000, function() {
	this.up(0.25);
})
.after(5000, function() {
	this.animate('flipRight', 500);
})
.after(10000, function() {
	this.stop();
	this.land();
})
.after(1000, function() {
	process.exit(1);
});
