var cv = require('opencv');
var ardrone = require('ar-drone');
var PNG = require('png.js');

var client = ardrone.createClient({ip: '192.168.1.1'});
var pngStream = client.getPngStream();


//(B)lue, (G)reen, (R)ed
var targetColor = [103, 61, 36];
var targetTreshold = 10;
var targetWhiteBalance = 135.68;

var lowThresh = 0;
var highThresh = 100;
var nIters = 1;
var maxArea = 500;
var lower_threshold = [0, 0, 0];
var upper_threshold = [0, 0, 0];

var GREEN = [0, 255, 0]; //B, G, R
var BLUE = [255, 0, 0]; //B, G, R
var WHITE = [255, 255, 255]; //B, G, R

pngStream.on('data', readImage);


function readImage(data){
	var reader = new PNG(data);
	reader.parse(function(err, png){
		if (err) throw err;
		var whiteBalance = 0;	
		calculateWhiteBalance(png, whiteBalance);
		cv.readImage(data, cvProcess);
	});
};

function calculateWhiteBalance(png, whiteBalance){
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
	lower_threshold = [(targetColor[0] * whiteBalanceAdjust) - targetTreshold,
	                   (targetColor[1] * whiteBalanceAdjust) - targetTreshold,
	                   (targetColor[2] * whiteBalanceAdjust) - targetTreshold];
	upper_threshold = [(targetColor[0] * whiteBalanceAdjust) + targetTreshold,
	                   (targetColor[1] * whiteBalanceAdjust) + targetTreshold,
	                   (targetColor[2] * whiteBalanceAdjust) + targetTreshold];

	//console.log(lower_threshold);
	//console.log(upper_threshold);
};

function cvProcess(err, im_orig) {
	var big = im_orig;
	var im = im_orig;
	if (saveFiles){
		im.save('./matrix.png');
	}
	im.inRange(lower_threshold, upper_threshold);
	im.canny(lowThresh, highThresh);
	im.dilate(nIters);
	if (saveFiles){
		im.save('./canny.png');
	}
	var contours = im.findContours();
	var largest_blob = 0;
	for(i = 0; i < contours.size(); i++) {
		if(contours.area(i) >contours.area(largest_blob)) {
			largest_blob=i;
		}
	}

	var current = contours.boundingRect(largest_blob);

	console.log(current.x + ', ' +current.y);
};

function getCenter(x, y, width, height) {
	var center_x = x + width/2;
	var center_y = y + height/2;
	return [center_x, center_y];
};