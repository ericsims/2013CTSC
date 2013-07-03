var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.config('control:altitude_max', 10000);

client.on('navdata', console.log);

client.stop();
client.takeoff();
client
.after(5000, function() {
this.animate('flipLeft', 1500);
})
//.after(5000, function() {
//this.animate('flipRight', 1500);
//})
.after(1000, function() {
	this.stop();
	this.land();
});
