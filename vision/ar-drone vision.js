var cv = require('opencv');
var ardrone = require('ar-drone');

var s = new cv.ImageStream();

var lowThresh = 0;
var highThresh = 100;
var nIters = 2;
var maxArea = 2500;

var GREEN = [0, 0, 0]; //B, G, R
var WHITE = [255, 255, 255]; //B, G, R

var lower_threshold = [46, 57, 83];
var upper_threshold = [80, 96, 115];

s.on('data', function(matrix){
	var big = matrix;
	var all = matrix;
	var color = matrix;

	all.convertGrayscale();
	im_canny = all.copy();

	im_canny.canny(lowThresh, highThresh);
	im_canny.dilate(nIters);

	contours = im_canny.findContours();

	for(i = 0; i < contours.size(); i++) {
		if(contours.area(i) > maxArea) {
			big.drawContour(contours, i, GREEN);
		}
	}
	
	color.inRange(lower_threshold, upper_threshold);
	color.save('./coin_detected.jpg');

	all.drawAllContours(contours, WHITE);


	big.save('./big.png');
	all.save('./all.png');
	process.exit(0);
});

ardrone.createClient().getPngStream().pipe(s);