var fs = require('fs'),
PNG = require('pngjs').PNG;
var cv = require('opencv');

var RG = 0.621;
var RB = 0.364;
var GB = 0.586;

var thres = 0.05;

fs.createReadStream('matrix.png')
.pipe(new PNG({
	filterType: 4
}))
.on('parsed', function() {

	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			var idx = (this.width * y + x) << 2;

			var R = this.data[idx];
			var G = this.data[idx+1];
			var B = this.data[idx+2];

			this.data[idx] = 0;
			this.data[idx+1] = 0;
			this.data[idx+2] = 0;

			if((Math.abs(R/G - RG) < thres*RG)&
					(Math.abs(R/B - RB) < thres*RB)&
					(Math.abs(G/B - GB) < thres*GB)){
				this.data[idx] = 255;
				this.data[idx+1] = 255;
				this.data[idx+2] = 255;
			}
		}
	}

	this.pack().pipe(fs.createWriteStream('out.png'));
});