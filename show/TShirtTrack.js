require('js-yaml');
var detection = require('./components/detection');
var ardrone = require('ar-drone');
var settings = require('./config/settings.yaml');

if(settings.debug){
	console.log('settings.ardrone.ip1: ' + settings.ardrone.ip1);
}

var client = ardrone.createClient({ip: settings.ardrone.ip1});
var pngStream = client.getPngStream();

client.config('control:altitude_max', 500);


pngStream.on('data', function(data){
	console.log(detection.readImage(data, settings));
});


//client.takeoff();
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

function centerTarget(){
	
}