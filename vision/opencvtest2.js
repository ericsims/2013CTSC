var cv = require('opencv');
var ardrone = require('ar-drone');

var s = new cv.ImageStream();

//(B)lue, (G)reen, (R)ed
var lower_threshold = [80, 0, 0];
var upper_threshold = [100, 50, 20];

var lowThresh = 0;
var highThresh = 100;
var nIters = 10;
var maxArea = 500;

var GREEN = [0, 255, 0]; //B, G, R
var BLUE = [255, 0, 0]; //B, G, R
var WHITE = [255, 255, 255]; //B, G, R

ardrone.createClient().getPngStream().pipe(s);

s.on('data', function(matrix){
	matrix.save('./matrix.png');
	var big = matrix;
	var im_orig = matrix; 
	im_orig.inRange(lower_threshold, upper_threshold);
	//im_orig.save('./color.png');
	im_orig.canny(lowThresh, highThresh);
	im_orig.dilate(nIters);
	im_orig.save('./canny.png');

	contours = im_orig.findContours();
	var largest_blob = 0;
	for(i = 0; i < contours.size(); i++) {
		if(contours.area(i) >contours.area(largest_blob)) {
			largest_blob=i;
		}
	}

	if(largest_blob != 0){
		current = contours.boundingRect(largest_blob);
		console.log(current.x +', '+current.y);
	}

	//big.save('./big.png');
	//process.exit(0);
});