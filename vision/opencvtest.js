var cv = require('opencv');
var draw = require('./draw');

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

exports.getCenter = function getCenter(x, y, width, height) {
	var center_x = x + width/2;
	var center_y = y + height/2;
	return [center_x, center_y];
}

cv.readImage('out.png', function(err, im_orig) {
	var big = im_orig;
	//im_orig.inRange(lower_threshold, upper_threshold);
	im_orig.save('./color.png');
	im_orig.canny(lowThresh, highThresh);
	im_orig.dilate(nIters);
	im_orig.save('./canny.png');

	var contours = im_orig.findContours();
	var largest_blob = 0;
	for(i = 0; i < contours.size(); i++) {
		if(contours.area(i) >contours.area(largest_blob)) {
			largest_blob=i;
		}
	}

	var current = contours.boundingRect(largest_blob);
	console.log(current.x +', '+current.y);
	//draw.drawBoundingRect(big, contours, i, GREEN);
	draw.drawCenter(big, contours, largest_blob, BLUE, exports.getCenter);


	big.save('./big.png');
});