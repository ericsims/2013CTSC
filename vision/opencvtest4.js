var PNG = require('pngjs').PNG;
var cv = require('opencv');
var ardrone = require('ar-drone');
var fs = require('fs');

var s = new cv.ImageStream()

var RG = 0.621;
var RB = 0.364;
var GB = 0.586;

var thresh = 0.05;

var lowThresh = 0;
var highThresh = 100;
var nIters = 2;
var minArea = 1;

var GREEN = [0, 255, 0]; //B, G, R
var BLUE = [255, 0, 0]; //B, G, R
var WHITE = [255, 255, 255]; //B, G, R

ardrone.createClient().getPngStream().pipe(s);

s.on('data', function(matrix){

	for (var y = 0; y < matrix.height; y++) {
		for (var x = 0; x < matrix.width; x++) {
			var idx = (matrix.width * y + x) << 2;

			var R = matrix.data[idx];
			var G = matrix.data[idx+1];
			var B = matrix.data[idx+2];

			matrix.data[idx] = 0;
			matrix.data[idx+1] = 0;
			matrix.data[idx+2] = 0;

			if((Math.abs(R/G - RG) < thresh*RG)&
					(Math.abs(R/B - RB) < thresh*RB)&
					(Math.abs(G/B - GB) < thresh*GB)){
				matrix.data[idx] = 255;
				matrix.data[idx+1] = 255;
				matrix.data[idx+2] = 255;
			}
		}
	}
	
	
	
	matrix.save('./matrix.png');
	var big = matrix;
	var im_orig = matrix;
	im_orig.save('./color.png');
	im_orig.canny(lowThresh, highThresh);
	im_orig.dilate(nIters);
	im_orig.save('./canny.png');

	contours = im_orig.findContours();
	var largest_blob = 0;
	for(i = 0; i < contours.size(); i++) {
		var area = contours.area(i);
		if(area > contours.area(largest_blob) & area > minArea) {
			largest_blob=i;
		}
	}

	if(largest_blob != 0){
		current = contours.boundingRect(largest_blob);
		console.log(current.x +', '+current.y);
	}
	
	big.save('./big.png');
});