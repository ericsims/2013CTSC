
var express = require('express');
var fs = require('fs');

var app = express();

var content, content2;

app.get('/', function(request, response) {
	response.send('This page has an mjpeg embedded in it:<br/><img src=im.mjpeg><br/> Click here to <a href=im.mjpeg>view the image by itself</a>. <p><b>Update:</b> This page was created to demo a bug in Chrome 20/21 where an mpjeg stream viewed directly did not animate (<a href=http://crbug.com/135337>chrome bug 135337</a>). The issue has been fixed in versions >= 22. I\'ll leave this page up for anyone else trying to test mjpeg functionality.</p><p>Souce code for this mjpeg server can be found at <a href="https://github.com/psanford/node-mjpeg-test-server">https://github.com/psanford/node-mjpeg-test-server</a>.<p>');
});

app.get('/im.mjpeg', function(request, res) {
	res.writeHead(200, {
		'Content-Type': 'multipart/x-mixed-replace; boundary=myboundary',
		'Cache-Control': 'no-cache',
		'Connection': 'close',
		'Pragma': 'no-cache'
	});

	var i = 0;
	var stop = false;

	res.connection.on('close', function() { stop = true; });

	var send_next = function() {
		if (stop || !content)
			return;
		res.write("--myboundary\r\n");
		res.write("Content-Type: image/jpeg\r\n");
		res.write("Content-Length: " + content.length + "\r\n");
		res.write("\r\n");
		res.write(content, 'binary');
		res.write("\r\n");
		setTimeout(send_next, 250);
	};
	send_next();
});

exports.update = function update(img){
	content = img;
};

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});