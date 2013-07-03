var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.config('control:altitude_max', 100);

//client.on('navdata', console.log);

client.stop();
client.takeoff();
client
.after(5000, function() {
	this.clockwise(1);
})
.after(4000, function() {
	this.stop();
})
//.after(3000, function() {
//this.animate('flipLeft', 15);
//})
.after(5000, function() {
	this.up(.5);
})
.after(10000, function() {
	this.stop();
})
.after(1000, function() {
	this.stop();
	this.land();
});
