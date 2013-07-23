var cv = require('opencv');
var PNG = require('png.js');
var draw = require('./draw');

var XY;
exports.readImage = function readImage(data, settings, color){
	cv.readImage(data, function(err, im){
		XY = exports.cvProcess(err, im, settings, color);
	});
	return XY;
};


exports.cvProcess = function cvProcess(err, im_orig, settings, color) {
	var big = im_orig;
	var im = im_orig;
	if(settings.opencv.saveFiles){
		im.save('./matrix.png');
		if(settings.debug){
			console.log('matrix.png saved');
		}
	}

	lower_threshold = [color[0] - settings.opencv.threshold,
	                   color[1] - settings.opencv.threshold,
	                   color[2] - settings.opencv.threshold];
	upper_threshold = [color[0] + settings.opencv.threshold,
	                   color[1] + settings.opencv.threshold,
	                   color[2] + settings.opencv.threshold];

	im.inRange(lower_threshold, upper_threshold);
	if(settings.opencv.saveFiles){
		im.save('./color.png');
		if(settings.debug){
			console.log('color.png saved');
		}
	}
	im.canny(settings.opencv.lowThresh, settings.opencv.highThresh);
	im.dilate(settings.opencv.nIters);
	if(settings.opencv.saveFiles){
		im.save('./canny.png');
		if(settings.debug){
			console.log('canny.png saved');
		}
	}
	var contours = im.findContours();
	if(settings.debug){
		console.log('found contours: ' + contours.size());
		console.log('settings.opencv.minArea: ' + settings.opencv.minArea);
	}
	var largest_blob = -1;
	if (contours.size() > 0){
		for(i = 0; i < contours.size(); i++) {
			var area = contours.area(i);
			if(area > settings.opencv.minArea){
				if(largest_blob != -1) {
					if(area > contours.area(largest_blob)) {
						largest_blob=i;
					}
				} else {
					largest_blob = i;
				}
			}
		}
		if(largest_blob != -1) {
			var current = contours.boundingRect(largest_blob);
			if(current.x == 1 || current.x == settings.opencv.width
					|| current.y == 1 || current.y == settings.opencv.height){
				largest_blob = -1;
			}
		}
	}
	if(settings.debug){
		if(largest_blob != -1) {
			console.log(current.x + ', ' + current.y);
		} else {
			console.log('no target found');
		}
	}

	if(settings.opencv.saveFiles){
		if(largest_blob != -1) {
			if (contours.size() > 0){
				big.drawAllContours(contours, settings.WHITE);
				draw.drawCenter(big, contours, largest_blob, settings.RED, getCenter);
			}
			big.save('./big.png');
			if(settings.debug){
				console.log('big.png saved');
			}
			big;
			return [current.x, current.y];
		} else {
			return;
		}
	}
};

function getCenter(x, y, width, height) {
	var center_x = x + width/2;
	var center_y = y + height/2;
	return [center_x, center_y];
};