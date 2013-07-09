var arDrone = require('ar-drone');
var PaVEParser = require('ar-drone/lib/video/PaVEParser');

var cv = require('opencv');

var video = arDrone.createClient().getVideoStream();
var parser = new PaVEParser();

parser
.on('data', function(data) {
	cv.readImage(data, function(err, im) {
		im.save('test.png');
	});
	console.log('foo');
})
.on('end', function() {
	console.log('bar');//output.end();
});

video.pipe(parser);