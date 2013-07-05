var arDrone = require('ar-drone');
var client = arDrone.createClient();

console.log('Recovering from emergency mode if there was one...');
ref.emergency = true;
console.log('Stopping...');
client.stop();
console.log('Landing...');
client.land();
console.log('Safety!');