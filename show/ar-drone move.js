var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.config('control:altitude_max', 1220);

client.takeoff();
client
.after(5000, function() {
	this.front(0.25);
})
.after(1000, function() {
	this.stop();
})

.after(2500, function() {
	this.right(0.25);
})
.after(1000, function() {
	this.stop();
})

.after(2500, function() {
	this.back(0.25);
})
.after(1000, function() {
	this.stop();
})

.after(2500, function() {
	this.left(0.25);
})
.after(1000, function() {
	this.stop();
})
.after(10000, function() {
	this.land();
	process.exit(1);
})
.after(1000, function() {
	process.exit(0);
});
