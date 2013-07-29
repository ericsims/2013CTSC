var net = require('net');
var client = net.connect(23, '192.168.1.10', function(){
   client.on('data', function(data) {
     console.log('data:', data.toString());
   });

   client.on('error', function(err) {
     console.log('error:', err.message);
   });

   client.write('reboot\n');
   client.write('exit\n');
   process.exit();
});