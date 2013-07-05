var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.config('control:altitude_max', 600);

client
.after(1000, function() {
	this.stop();
})
.after(1000, function() {
	this.land();
})
.after(1000, function() {
	process.exit(1);
});
