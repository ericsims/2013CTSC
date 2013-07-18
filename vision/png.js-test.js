var cv = require('opencv');
var fs = require('fs');
var draw = require('./components/draw');
var PNGReader = require('png.js');

//(B)lue, (G)reen, (R)ed
var targetColor = [103, 61, 36];
var targetTreshold = 10;
var targetWhiteBalance = 135.68;

var lowThresh = 0;
var highThresh = 100;
var nIters = 1;
var maxArea = 500;

var GREEN = [0, 255, 0]; //B, G, R
var BLUE = [255, 0, 0]; //B, G, R
var WHITE = [255, 255, 255]; //B, G, R

exports.getCenter = function getCenter(x, y, width, height) {
	var center_x = x + width/2;
	var center_y = y + height/2;
	return [center_x, center_y];
};

cv.readImage('matrix.png', function(err, im_orig) {
	var whiteBalance = 0;

	fs.readFile('matrix.png', function(err, bytes){
		var reader = new PNGReader(bytes);
		reader.parse(function(err, png){
			if (err) throw err;
			var totalPixels = png.width * png.height;
			for (var x = 0; x < png.width; x++){
				for (var y = 0; y < png.height; y++){
					var average = (png.getPixel(x,y)[0] + png.getPixel(x,y)[1] + png.getPixel(x,y)[2]) / 3;
					whiteBalance += average;
				}
			}
			whiteBalance = whiteBalance / totalPixels;
			console.log(whiteBalance);
			var whiteBalanceAdjust = whiteBalance / targetWhiteBalance;
			var lower_threshold = [(targetColor[0] * whiteBalanceAdjust) - targetTreshold,
			                       (targetColor[1] * whiteBalanceAdjust) - targetTreshold,
			                       (targetColor[2] * whiteBalanceAdjust) - targetTreshold];
			var upper_threshold = [(targetColor[0] * whiteBalanceAdjust) + targetTreshold,
			                       (targetColor[1] * whiteBalanceAdjust) + targetTreshold,
			                       (targetColor[2] * whiteBalanceAdjust) + targetTreshold];
			
			console.log(lower_threshold);
			console.log(upper_threshold);
			
			var big = im_orig;
			var im = im_orig;
			im.inRange(lower_threshold, upper_threshold);
			im.save('./color.png');
			im.canny(lowThresh, highThresh);
			im.dilate(nIters);
			im.save('./canny.png');

			var contours = im.findContours();
			console.log(contours.toString());
			
			var largest_blob = 0;
			for(i = 0; i < contours.size(); i++) {
				if(contours.area(i) >contours.area(largest_blob)) {
					largest_blob=i;
				}
			}

			big.drawAllContours(contours, BLUE);
			var current = contours.boundingRect(largest_blob);
			draw.drawCenter(big, contours, largest_blob, WHITE, exports.getCenter);

			console.log(current.x +', '+current.y);
			
			big.save('./big.png');
		});
	});
});