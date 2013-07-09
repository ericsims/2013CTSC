var cv = require('opencv');
var ardrone = require('ar-drone');

var s = new cv.ImageStream();

//while(1){
	s.on('data', function(matrix){
		//matrix.save('./matrix.png');
		console.log('saving...');
	});
//}
ardrone.createClient().getPngStream().pipe(s);