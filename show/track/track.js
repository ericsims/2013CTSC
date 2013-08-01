require('js-yaml');
var detection = require('./components/detection');
var ardrone = require('ar-drone');
var settings = require('./config/settings.yaml');
var server = require('./components/mjpeg-stream');
var sys = require("sys");

var stdin = process.openStdin();
var target = -1;
var tracking = false;

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

pngStream.on('data', function(data){
	var XYZ = detection.readImage(data, settings, target);
	if (tracking){
		if(XYZ){
			if(settings.debug){
				console.log(XYZ);
			}
			centerTarget(XYZ);
		} else {
			console.log('stop');
			client.stop();
		}
	}
});

stdin.addListener("data", function(data) {
	data = data.toString().substring(0, data.length-1);
	console.log("you entered: [" + data + "]");
	if(data == 'takeoff'){
		takeoff();
	} else if (data == 'start track') {
		tracking = true;
	} else if (data == 'stop track') {
		tracking = false;
	} else if (data == 'exit') {
		process.exit();
	}
});

function takeoff(){
	client.takeoff();
}
function exit(){
	client.stop();
	client.land()
}

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