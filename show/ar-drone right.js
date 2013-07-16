var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.config('control:altitude_max', 2000);

client.on('navdata', console.log);


client.takeoff();
client
.after(5000, function() {
	this.up(1);
	this.left(0.15);
})
.after(5000, function() {
	this.animate('flipAhead', 100);
})
.after(1000, function() {
	this.left(0.1);
})
.after(5000, function() {
	this.stop();
	this.land();
})
.after(1000, function() {
	process.exit(1);
});
