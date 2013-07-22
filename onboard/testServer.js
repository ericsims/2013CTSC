var io = require('socket.io').listen(8000);
io.sockets.on('connection', function (socket) {
	socket.on('my event', function (msg) {
		console.log("DATA!!!");
	});
});