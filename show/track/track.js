require('js-yaml');
var settings = require('./config/settings.yaml');
var detection = require('./components/detection');
var server = require('./components/mjpeg-stream');
var actions = require('./components/actions');

var ardrone = require('ar-drone');
var vapix = require('vapix');
var sys = require("sys");

var stdin = process.openStdin();
var target = -1;
var follow = false;
var localize = false;
var streamSource = 'ardrone';

process.argv.forEach(function (val, index, array) {
	if( index == 2 ){
		target = val;
	}
});
if(target < 0){
	console.log('Please set a target number!');
}

if(settings.debug){
	console.log('settings.ardrone.ip1: ' + settings.ardrone.ip1);
}

var client = ardrone.createClient({ip: settings.ardrone.ip1});
client.config('control:altitude_max', 1000);
var pngStream = client.getPngStream();
var camera = new vapix.Camera({
	address: settings.camera.ip,
	port: settings.camera.port,
	username: settings.camera.username,
	password: settings.camera.password
});
var mjpg = camera.createVideoStream({
	resolution: settings.camera.resolution,
	compression: settings.camera.compression,
	fps: settings.camera.fps
});


pngStream.on('data', function(data){
	if(streamSource == 'ardrone'){
		if(target > -1){
			var XYZIMG = detection.readImage(data, settings, target);
			if(XYZIMG){ 
				server.update(XYZIMG[3]);
				var XYZ = [XYZIMG[0], XYZIMG[1], XYZIMG[2]];
				if(follow) {
					if(XYZ[0] != -1 && XYZ[1] != -1 && XYZ[2] != -1){
						if(settings.debug){
							console.log(XYZ);
						}
						actions.centerTarget(XYZ, settings, client);
					} else {
						console.log('stop');
						client.stop();
					}
				}
			}
		} else {
			server.update(data);
		}
	}
}
});


mjpg.on('data', function(data) {
	if(streamSource == 'vapix'){
		if(target > -1){
			var XYZIMG = detection.readImage(data, settings, target);
			if(XYZIMG){ 
				server.update(XYZIMG[3]);
				var XYZ = [XYZIMG[0], XYZIMG[1], XYZIMG[2]];
				if(follow) {
					if(XYZ[0] != -1 && XYZ[1] != -1 && XYZ[2] != -1){
						if(settings.debug){
							console.log(XYZ);
						}
						actions.centerTarget(XYZ, settings, client);
					} else {
						console.log('stop');
						client.stop();
					}
				}
			}
		} else {
			server.update(data);
		}
	}
});

stdin.addListener("data", function(data) {
	data = data.toString().substring(0, data.length-1);
	console.log("you entered: [" + data + "]");
	if(data == 'takeoff'){
		takeoff();
	} else if (data.indexOf('set streamSource') != -1) {
		streamSource = data.substring(16);
	} else if (data.indexOf('set target') != -1) {
		target = parseInt(data.substring(10))
	} else if (data == 'start track') {
		if (target > -1){
			follow = true;
		} else {
			console.log('target not defined!');
		}
	} else if (data == 'stop track') {
		follow = false;
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

