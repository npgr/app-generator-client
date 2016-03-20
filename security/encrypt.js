//var machine = get_machine()
var prompt = require('prompt');
prompt.start();
 
  prompt.get(
    [{
	description: 'Customer Code',
	 name: 'code',
	 type: 'string',
	 required: true,
	 message: 'Value required'
	}, {
	description: 'Customer Name',
	 name: 'customer',
	 type: 'string',
	 required: true,
	 message: 'Value required',
	}, {
	description: 'End Date',
      name: 'endDate',
	  type: 'string',
      required: true,
	  message: 'Value Required',
    }, {
	description: 'Users',
      name: 'users',
	  type: 'integer',
	  required: true,
      conform: function (value) {
        if (value <= 0) return false
	   return true;
      },
	  message: 'Value must be Greater Than cero'
    }, {
	description: 'Apps',
      name: 'apps',
	  type: 'integer',
	  required: true,
      conform: function (value) {
        if (value < 3) return false
	   return true;
      },
	  message: 'Value must be Greater Than 2'
    }, {
	description: 'Models',
	 default: 500,
	 name: 'models',
	 type: 'integer',
	 conform: function (value) {
        if (value < 3) return false
	   return true;
      },
	  message: 'Value must be Greater Than 2'
	}, {
	description: 'Model Functions',
	 name: 'mfunctions',
	 type: 'integer',
	 default: 500,
	 conform: function (value) {
        if (value < 3) return false
	   return true;
      },
	  message: 'Value must be Greater Than 2'
	}, {
	description: 'Google Analytics [ y | n ]',
	 name: 'ga',
	 type: 'string',
	 default: 'y',
	 conform: function(value) {
		if (value != 'y' && value != 'n') return false
		return true
	 },
	  message: 'Valid values are \'y\' or \'n\''
	 }, {
	description: 'Download [ y | n ]',
	 name: 'download',
	 type: 'string',
	 default: 'y',
	 conform: function(value) {
		if (value != 'y' && value != 'n') return false
		return true
	 },
	  message: 'Valid values are \'y\' or \'n\''
	 }, {
	 description: 'Print [ y | n ]',
	 name: 'print',
	 type: 'string',
	 default: 'y',
	 conform: function(value) {
		if (value != 'y' && value != 'n') return false
		return true
	 },
	  message: 'Valid values are \'y\' or \'n\''
	}, {
	 description: 'Help [ y | n ]',
	 name: 'help',
	 type: 'string',
	 default: 'y',
	 conform: function(value) {
		if (value != 'y' && value != 'n') return false
		return true
	 },
	  message: 'Valid values are \'y\' or \'n\''
	}], function (err, result) {
    // 
    // Log the results. 
    // 
	console.log('Command-line input received:');
	//result.machine = machine
	result.generated_apps = 0
	result.generated_models = 0
	result.generated_mfunctions = 0
	
	get_machine_id(function(err, uuid) {
		if (err) {
			console.log('Error', uuid)
			return
		}
		get_disk_id(function(err, disk_id) {
			if (err) {
				console.log('Error', disk_id)
				return
			}
			result.uuid = uuid
			result.disk_id = disk_id
			
			console.log('result: ', result)
	
			var encryptedPassword = encrypt(JSON.stringify(result))
	
			console.log('encrypted :', encryptedPassword);
	
			fs = require('fs')
			fs.writeFile('key',encryptedPassword,'utf8')
		})
	})
	
	
  });
  
function get_machine_id(cb) {
	var spawn = require('child_process').spawn;

	child = spawn('wmic',['csproduct', 'get', 'UUID'])
	
	child.stdout.on('data', function(data) {
		var dat = data.toString().split('\n')[1].toString()
		pos= dat.indexOf(' ')
		cb(false, dat.substr(0,pos))
	});
	
	child.stderr.on('data', function (data) {
		cb(true, 'Message: '+ data.toString())
	});
}

function get_disk_id(cb) {
	var spawn = require('child_process').spawn;

	child = spawn('wmic',['DISKDRIVE', 'get', 'SerialNumber'])
	
	child.stdout.on('data', function(data) {
		var dat = data.toString().split('\n')[1].toString()
		pos= dat.indexOf(' ')
		cb(false, dat.substr(0,pos))
	});
	
	child.stderr.on('data', function (data) {
		cb(true, 'Message: '+ data.toString())
	});
}

/** Deprecated **/
function get_machine() {
	var os = require('os')

	var cpus = os.cpus()
	var net = os.networkInterfaces()
	var keys = Object.keys(net)

	var machine = {
		cores: cpus.length,
		cpu: cpus[0].model,
		speed: cpus[0].speed,
		net: keys[0],
		address: net[keys[0]][0].address
		//mac: net[keys[0]][0].mac,
		//scope_id: net[keys[0]][0].scopeid	
	}
	return machine
  }
  
  function encrypt(text){
	var crypto = require('crypto')
	var cipher = crypto.createCipher('aes-256-cbc','iydc9i376cdp06dcop862dxo%/#OIGC23864LUCD795')
	var crypted = cipher.update(text,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}