var arDrone = require('ar-drone');
var client = arDrone.createClient();
client.config('control:altitude_max', 1500);
client.config('');
client.on('navdata', navdata);

var alt;
var yaw;
function navdata(data){
	var datastr = JSON.stringify(data);
	
	var split2 = (datastr.substring(datastr.indexOf('demo'), datastr.indexOf('detection'))).split(',');
	for(var j=0; j<split2.length; j++){
		console.log(split2[j]);
	}
	
	
	var split = datastr.split(',');
	for(var i=0; i<split.length; i++){
		var current = split[i];
		if (current.indexOf('\"z\"') != -1 && current.indexOf('}}}}') != -1){
			alt = -parse(current);
		}
		if (current.indexOf('yaw') != -1){
			yaw = -parse(current);
		}
	}
	if(go){
		//setAlt(1000);
		setYaw(0);
	}	
	//process.exit(0);
}

function setAlt(setalt){
	if(setalt > alt){
		client.up(0.1);
	} else {
		client.down(0.1);
	}
}
function setYaw(setyaw){
	setyaw = Math.abs(setyaw - yaw);
	if(yaw > setyaw){
		client.clockwise(0.05);
		console.log(yaw + "\tcw");
	} else {
		client.counterClockwise(0.05);
		console.log(yaw + "\tccw");
	}
}

function parse(current){
	return parseFloat(current.substring(current.indexOf(':') + 1, current.length));
}

var go = false;
client.takeoff();
client
.after(5000, function() {
	go = true;
})
.after(15000, function() {
	go = false;
	this.stop();
	this.land();
})
.after(5000, function() {
	process.exit(0);
});
