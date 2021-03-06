var cv = require('opencv');
var PNG = require('png.js');
var draw = require('./draw');

var lower_threshold = [0, 0, 0];
var upper_threshold = [0, 0, 0];

var XY;
exports.readImage = function readImage(data, settings){
	var reader = new PNG(data);
	reader.parse(function(err, png){
		if (err) throw err;
		var whiteBalance = 0;	
		calculateWhiteBalance(png, whiteBalance, settings);
		cv.readImage(data, function(err, im){
			XY = exports.cvProcess(err, im, settings);
		});
	});
	return XY;
};

function calculateWhiteBalance(png, whiteBalance, settings){
	if(settings.debug){
		console.log('png.width: ' + png. width);
		console.log('png.height: ' + png. height);
	}
	var totalPixels = png.width * png.height;
	for (var x = 0; x < png.width; x++){
		for (var y = 0; y < png.height; y++){
			var average = (png.getPixel(x,y)[0] + png.getPixel(x,y)[1] + png.getPixel(x,y)[2]) / 3;
			whiteBalance += average;
		}
	}
	whiteBalance = whiteBalance / totalPixels;
	var whiteBalanceAdjust = whiteBalance / settings.target1.whiteBalance;
	if(settings.debug){
		console.log('whiteBalance: ' + whiteBalance);
		console.log('settings.target1.color: ' + settings.target1.color);
		console.log('settings.opencv.threshold: ' + settings.opencv.threshold);
		console.log('whiteBalanceAdjust: ' + whiteBalanceAdjust);
	}
	lower_threshold = [(settings.target1.color[0] * whiteBalanceAdjust) - settings.opencv.threshold,
	                   (settings.target1.color[1] * whiteBalanceAdjust) - settings.opencv.threshold,
	                   (settings.target1.color[2] * whiteBalanceAdjust) - settings.opencv.threshold];
	upper_threshold = [(settings.target1.color[0] * whiteBalanceAdjust) + settings.opencv.threshold,
	                   (settings.target1.color[1] * whiteBalanceAdjust) + settings.opencv.threshold,
	                   (settings.target1.color[2] * whiteBalanceAdjust) + settings.opencv.threshold];

	if(settings.debug){
		console.log(lower_threshold);
		console.log(upper_threshold);
	}
};

exports.cvProcess = function cvProcess(err, im_orig, settings) {
	var big = im_orig;
	var im = im_orig;
	im.convertGrayscale();
	if(settings.opencv.saveFiles){
		im.save('./matrix.png');
		if(settings.debug){
			console.log('matrix.png saved');
		}
	}
	//im.inRange(lower_threshold, upper_threshold);
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