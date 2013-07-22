require('js-yaml');
var vapix = require('vapix');
var detection = require('./components/detection');
var ardrone = require('ar-drone');
var settings = require('./config/settings.yaml');

if(settings.debug){
	console.log('settings.ardrone.ip1: ' + settings.ardrone.ip1);
}


var camera = new vapix.Camera({
	address: settings.camera.ip,
	port: settings.camera.port,
	username: settings.camera.username,
	password: settings.camera.password
});

mjpg = camera.createVideoStream({
	resolution: settings.camera.resolution,
	compression: settings.camera.compression,
	fps: settings.camera.fps
});

var client = ardrone.createClient({ip: settings.ardrone.ip1});

client.config('control:altitude_max', 1000);

client
.after(5000, function() {
	//this.takeoff();
})
.after(5000, function() {

	mjpg.on('data', function(data) {
		var XY = detection.readImage(data, settings);
		if(XY){
			centerTarget(XY);
			//console.log(XY);
		} else {
			console.log('stop');
			client.stop();
		}
	});
})
.after(20000, function() {
	this.stop();
	this.land();
})
.after(1000, function() {
	process.exit(1);
});

function centerTarget(cordinates){
	x_center = settings.opencv.width / 2;
	y_center = settings.opencv.height / 2;

	LR = cordinates[0] - x_center;
	if(LR < -50) {
		console.log('left');
		client.left(settings.speed);
	} else if(LR > 50) {
		console.log('right');
		client.right(settings.speed);
	} else {
		console.log('center');
		client.stop();
	}
}