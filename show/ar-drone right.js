var arDrone = require('ar-drone');
var client = arDrone.creaeteClient();

client.config('control:altitude_max', 1000);

client.on('navdata', console.log);


client.takeoff();
client
.after(5000, function() {
	this.up(1);
})
.after(5000, function() {
	this.animate('flipRight', 100);
})
.after(1000, function() {
	this.left(0.5);
})
.after(2000, function() {
	this.stop();
	this.land();
})
.after(1000, function() {
	process.exit(1);
});
