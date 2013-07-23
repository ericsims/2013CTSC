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
		var ardronepos = detection.readImage(data, settings, settings.ardrone.color);
		var targetpos = detection.readImage(data, settings, settings.target1.color);
		if(ardronepos){
			setARDronePos(ardronepos, settings.opencv.width / 2);
			console.log("ar: " + ardronepos + "trgt: " + targetpos);
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

function setARDronePos(pos, targetpos){
	LR = pos[0] - targetpos;
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