var arDrone = require('ar-drone');
var navdata = require('./navdataParse');//require('ar-drone/lib/navdata/parseNavdata');
var client = arDrone.createClient();

client.on('navdata', navdata.data);

client
.after(1000, function() {
	console.log(data);
})/*
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
})*/
.after(1000, function() {
	//process.exit(1);
});