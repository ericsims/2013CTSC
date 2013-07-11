var arDrone = require('ar-drone');
var client = arDrone.createClient();
var udpNavdata = require('ar-drone/lib/navdata/UdpNavdataStream');

client.config('control:altitude_max', 2700);

client.on('navdata', console.log);

//client.takeoff();
client
.after(1000, function() {
	this.stop();
	this.land();
})
.after(1000, function() {
	//process.exit(1);
});
