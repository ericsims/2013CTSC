var cv = require('opencv');
cv.readImage('./matrix.png', function(err, im_orig) {
	var big = cv.cvtColor(im_orig, cv.CV_BGR2HSV);
	big.save('./big.png');
});