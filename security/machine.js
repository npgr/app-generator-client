
function get_machine_id(cb) {
	var spawn = require('child_process').spawn;

	child = spawn('wmic',['csproduct', 'get', 'UUID'])
	
	child.stdout.on('data', function(data) {
		cb(false, data.toString().split('\n')[1].toString())
	});
	
	child.stderr.on('data', function (data) {
		cb(true, 'Message: '+ data.toString())
	});
}

function get_disk_id(cb) {
	var spawn = require('child_process').spawn;

	child = spawn('wmic',['DISKDRIVE', 'get', 'SerialNumber'])
	
	child.stdout.on('data', function(data) {
		cb(false, data.toString().split('\n')[1].toString())
	});
	
	child.stderr.on('data', function (data) {
		cb(true, 'Message: '+ data.toString())
	});
}


get_machine_id(function(err, data) {
	if (err) {
		console.log('Error', data)
		return
	}
	console.log('UUID:'+data)
	pos= data.indexOf(' ')
	console.log('UUID2:'+data.substr(0,pos)+'x')

	get_disk_id(function(err, data2) {
		if (err) {
			console.log('Error', data2)
			return
		}
		console.log('Disk:'+data2)
	})
})


