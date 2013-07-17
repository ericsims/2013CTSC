require('js-yaml');
var detection = require('./components/detection');
var ardrone = require('ar-drone');
var settings = require('./config/settings.yaml');

if(settings.debug){
	console.log('settings.ardrone.ip1: ' + settings.ardrone.ip1);
}

var client = ardrone.createClient({ip: settings.ardrone.ip1});
var pngStream = client.getPngStream();

pngStream.on('data', function(data){
	detection.readImage(data, settings);
});