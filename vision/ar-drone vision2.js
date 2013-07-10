var arDrone = require('ar-drone');
var cv = require('opencv');

var video = arDrone.createClient().getVideoStream();
var camera = new cv.VideoCapture(0);

setInterval(function() {
	camera.read(function(err, im) {

		im.save('/tmp/cam.png');
	});

}, 1000);

video.pipe(camera);