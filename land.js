var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.config('control:altitude_max', 600);

client
.after(50, function() {
	console.log('stopping');
	this.stop();
})
.after(500, function() {
	console.log('landing');
	this.land();
})
.after(1000, function() {
	console.log('DONE!');
	process.exit(1);
});
