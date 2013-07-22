var vapix = require('vapix');
var net = require('net');
var cv = require('opencv');
var http = require('http');
var fs = require('fs');

start();

function start(options) {
	tcpStart();
}

function tcpStart() {
	var server = net.createServer(function(socket) {
		console.log('tcp: connected');

		this.on('data', function(data) {
			self.sendValue(data, socket);
		});

		socket.on('end', function() {
			console.log('tcp: disconneced');
		});

		socket.on('error', function() {
			console.log('tcp: Socket error occured');
		});
	});

	var port = 8080;

	server.listen(port, function() {
		console.log('tcp: bound to port ' + port);
	});
}

function sendValue(data, socket) {
	var self = this;

	if (0) {

	} else {

		socket.write('not found');
	}
}

function sleep(milliSeconds) {
	var startTime = new Date().getTime();
	while (new Date().getTime() < startTime + milliSeconds);
}

exports.start = start;