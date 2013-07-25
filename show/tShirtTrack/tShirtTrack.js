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


client
.after(1000, function() {
	//this.takeoff();
})
.after(5000, function() {

	pngStream.on('data', function(data){
		var XYZ = detection.readImage(data, settings);
		if(XYZ){
			console.log(XYZ);
			centerTarget(XYZ);
		} else {
			console.log('stop');
			client.stop();
		}
	});
})
.after(100000000, function() {
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
	FB = cordinates[2];
	if(LR < -25) {
		console.log('left');
		client.counterClockwise(settings.speed);
	} else if(LR > 25) {
		console.log('right');
		client.clockwise(settings.speed);
	} else {
		console.log('LR center');
		client.stop();
	}
	if(FB > 4) {
		console.log('front');
		client.front(settings.speed);
	} else if(FB < 2) {
		console.log('back');
		client.back(settings.speed * 1.5);
	} else {
		console.log('FB center');
		client.stop();
	}
}