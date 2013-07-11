var cv = require('opencv');
var ardrone = require('ar-drone');

var s = new cv.ImageStream();

s.on('data', function(matrix){
	//matrix.save('./matrix.png');
	console.log('saving...');
},1000);
ardrone.createClient().getPngStream().pipe(s);