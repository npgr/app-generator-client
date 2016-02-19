
/** GET Command Line Arguments **/

  if (process.argv.length < 3)
  {
	command_help()
	process.exit()
  }

  var file_path = process.argv[2]

/** Get License Information **/
const http = require('http'); 

var options = {
    host: 'localhost',
    port: 9797,
	path: '/generate_model',
    method: 'POST',
    //headers: {
    //    accept: 'application/json'
    //}
};

var request = http.request(options,function(res){
		res.on('data',function(data_stream){
			var data = data_stream.toString()
			var obj = JSON.parse(decrypt(data))

			console.log(obj)
		});
	});
	
	request.on('error', function(err) {
		console.log('Cannot Get License Information')
	})
	
	request.end();

/** Functions **/

function generate () {
  switch (process.argv[1])
  {
	case 'model':
		
		console.log('Generating Model...')
		var data = read_file(file_path)
		try { 
			var data_parsed = JSON.parse(data) 
		}
		catch(err) { 
			console.log('Error Parsing Data')
			process.exit()
		}
		var generate = require('./generate.js')
		console.log(generate.generate_model(data_parsed.app, data_parsed.model, data_parsed.attributes, data_parsed.app_path))
	break;
	case 'mfunction':
		console.log('Generating Model Function...')
		var data = read_file(file_path)
		try { 
			var data_parsed = JSON.parse(data) 
		}
		catch(err) { 
			console.log('Error Parsing Data')
			process.exit()
		}
		var generate = require('./generate.js')
		
		console.log(generate.generate_function_list(data_parsed.app, data_parsed.mfunction, data_parsed.attrs))
	break;
	default:
		command_help()
 }
}

function validate_key(key_data) {
	/*try {
		var key_data = require('fs').readFileSync('key','utf8')
	}
	catch(err) {
		console.log('Error opening Key File')
		process.exit()
	}*/
	var key_decrypt = decrypt(key_data)
	try { 
		var key = JSON.parse(key_decrypt)
	} catch(err) {
		console.log('Key data invalid')
		return false
	}
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	
	if (dd < 10) dd = '0' + dd
	if (mm < 10) mm = '0' + mm
	
	today = yyyy + '/' + mm + '/' + dd
	
	console.log('Today: ', today)
	console.log('Licensed Date: ', key.endDate)
	
	if (today > key.endDate) {
	   console.log('License Expired')
	   return false
	}
	
	/** KEY Valid **/
	return true

	/*var machine = get_machine()
	if (machine.cores != key.machine.cores || machine.cpu != key.machine.cpu || 
	    machine.speed != key.machine.speed || machine.net != key.machine.net ||
		machine.mac != key.machine.mac || machine.scope_id != key.machine.scope_id) 
	{
		console.log('Error MATCH on key')
		console.log('key machine', key.machine)
		console.log('machine', machine)
		process.exit()
	}*/	
}

/** Not Used **/
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
		mac: net[keys[0]][0].mac,
		scope_id: net[keys[0]][0].scopeid	
	}
	return machine
}

function decrypt(text){
  var crypto = require('crypto')
  var decipher = crypto.createDecipher('aes-256-cbc','iydc9i376cdp06dcop862dxo%/#OIGC23864LUCD795')
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}	

function command_help() {
	console.log('Usage: Generate [ model | mfunction ] <data_file>')
}

function read_file(file_path) {
	var fs = require('fs')
	
	if (!fs.existsSync(file_path))
		return 'file does not exist'
		
	return fs.readFileSync(file_path, 'utf8')
}
