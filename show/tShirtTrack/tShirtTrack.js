require('js-yaml');
var detection = require('./components/detection');
var ardrone = require('ar-drone');
var settings = require('./config/settings.yaml');
var server = require('./components/mjpeg-stream');
var target = -1;

if(settings.debug){
	console.log('settings.ardrone.ip1: ' + settings.ardrone.ip1);
}

process.argv.forEach(function (val, index, array) {
	if( index == 2 ){
		target = val;
	}
});

if(target < 0){
	console.log('Please pass a target number!');
	process.exit();
}

var client = ardrone.createClient({ip: settings.ardrone.ip1});
var pngStream = client.getPngStream();

client.config('control:altitude_max', 1000);

client
.after(5000, function() {
	//pngStream.on('data', function(data){
	//		server.update(data);
	//});
})
//.after(15000, function() {
//this.takeoff();
//})
.after(5000, function() {

	pngStream.on('data', function(data){
		var XYZ = detection.readImage(data, settings, settings['target'+target]);
		if(XYZ){
			if(settings.debug){
				console.log(XYZ);
			}
			centerTarget(XYZ);
		} else {
			console.log('stop');
			client.stop();
		}
	});
})
.after(60000, function() {
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
	if(FB > 2) {
		process.stdout.write('front\t\t');
		client.front(settings.ardrone.moveSpeed);
	} else if(FB < 1.5) {
		process.stdout.write('back\t\t');
		client.back(settings.ardrone.moveSpeed);
	} else {
		process.stdout.write('FB center\t\t');
		client.stop();
	}
	if(LR < -25) {
		console.log('left');
		client.counterClockwise(settings.ardrone.turnSpeed);
	} else if(LR > 25) {
		console.log('right');
		client.clockwise(settings.ardrone.turnSpeed);
	} else {
		console.log('LR center');
		client.stop();
	}
}