var navdata = require('ar-drone/lib/navdata/parseNavdata');
var udpNavdata = require('ar-drone/lib/navdata/UdpNavdataStream');
var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.on('navdata', navdata);
client
.after(1000, function() {
	console.log(navdata.altitude);
})
.after(1000, function() {
	console.log(navdata.altitude);
})
.after(1000, function() {
	console.log(navdata.altitude);
})
.after(1000, function() {
	console.log(navdata.altitude);
})
.after(1000, function() {
	console.log(navdata.altitude);
})
.after(1000, function() {
	console.log(navdata.altitude);
	process.exit(1);
});