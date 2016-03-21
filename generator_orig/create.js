
/** GET Command Line Arguments **/

  if (process.argv.length < 3)
  {
	command_help()
	process.exit()
  }

  generate()


/** Functions **/

/** Get License Information **/
function can_generate_mfunction(cb) {
	log('Can Generate mfunction')
	
	get_machine_id(function(err, machine) {
		if (err) 
		{
			console.log('Error getting ioma')
			return
		}
		machine_crypt = encrypt2(machine)
	
		get_disk_id(function(err, disk_id) {
			if (err) 
			{
				console.log('Error getting doma')
				return
			}
			var disk_crypt = encrypt2(disk_id)
		
			key_server2('/can_generate_mfunction', machine_crypt, disk_crypt, function(obj) {
				if (obj) 
				{
					console.log(' ', obj.msg)
					//console.log('Licensed until: ', obj.endDate)
					//console.log('Model Functions Generated: ',obj.generated_mfunctions)
					//console.log('Generations Remained: ', obj.remains)
					cb(obj.generate)
				}
				else cb(false)	
			})
		})
	}) 
}

function generated_mfunction(cb) {
	key_server('/generate_mfunction', function(obj) {
		return true
	})
}

function key_server2(option, machine_crypt, disk_crypt, cb) {

	var data = require('fs').readFileSync('./config.json','utf8')
	var data_obj = JSON.parse(data)
	var arr = data_obj.url.split(':')

	const http = require('http'); 

	var options = {
		host: arr[1].substring(2),
		port: Number(arr[2])+333,
		path: option,
		method: 'POST',
		headers: {
		//    accept: 'application/json'
			ioma_data: machine_crypt,
			doma_data: disk_crypt
		}
	}
	//console.log('Options: ',options)
	//process.exit()

	var request = http.request(options,function(res){
		res.on('data',function(data_stream){
			var data = data_stream.toString()
			var obj = JSON.parse(decrypt(data))

			//console.log(obj)
			cb(obj)
		});
	});
	
	request.on('error', function(err) {
		log('key_server2 - request error')
		console.log('Cannot Get License Information')
		cb(false)
	})
	
	request.end();
}

function key_server(option, cb) {

	var data = require('fs').readFileSync('./config.json','utf8')
	var data_obj = JSON.parse(data)
	var arr = data_obj.url.split(':')

	const http = require('http'); 

	var options = {
		host: arr[1].substring(2),
		port: Number(arr[2])+333,
		path: option,
		method: 'POST'
		//headers: {
		//    accept: 'application/json'
		//}
	}
	//console.log('Options: ',options)
	//process.exit()

	var request = http.request(options,function(res){
		res.on('data',function(data_stream){
			var data = data_stream.toString()
			var obj = JSON.parse(decrypt(data))

			//console.log(obj)
			cb(obj)
		});
	});
	
	request.on('error', function(err) {
		log('key_server - request error')
		console.log('Cannot Get License Information')
		cb(false)
	})
	
	request.end();
}

function generate () {
	var file_path = process.argv[2]

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
		can_generate_mfunction(function(generate) {
			if (generate)
				generate_mfunction(file_path)
			else
			{
				console.log('Cannot Generate Model Function')
				process.exit()
			}
		})
	break;
	default:
		command_help()
 }
}

function generate_mfunction(file_path) {
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
	
	//console.log('data_parsed: ', data_parsed)
	console.log(generate.generate_function_list(data_parsed.app, data_parsed.mfunction, data_parsed.attrs))
	
	/** if generated Function is true **/
	generated_mfunction()
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

function encrypt2(text){
	var crypto = require('crypto')
	var cipher = crypto.createCipher('aes-256-cbc','ujhdhuegd(/&GS)(/GSK))??jiuiiuh&6568CD795')
	var crypted = cipher.update(text,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}

function get_machine_id(cb) {
	dat1 = ''
	var spawn = require('child_process').spawn;

	child = spawn('wmic',['csproduct', 'get', 'UUID'])
	
	child.stdout.on('data', function(data) {
		dat1 += data.toString()
	});
	
	child.stderr.on('data', function (data) {
		cb(true, 'Message: '+ data.toString())
	});
	
	child.on('close', function(code) {
		//console.log('uuid: ',dat1)
		var dat = dat1.split('\n')[1].toString()
		var pos = dat.indexOf(' ')
		cb(false, dat.substr(0,pos))
	});
}

function get_disk_id(cb) {
	dat2 = ''
	var spawn = require('child_process').spawn;

	child = spawn('wmic',['DISKDRIVE', 'get', 'SerialNumber'])
	
	child.stdout.on('data', function(data) {
		dat2 += data.toString()
	});
	
	child.stderr.on('data', function (data) {
		cb(true, 'Message: '+ data.toString())
	});
	
	child.on('close', function(code) {
		//console.log('disk_id: ',dat2)
		var dat = dat2.split('\n')[1].toString()
		var pos = dat.indexOf(' ')
		cb(false, dat.substr(0,pos))
	});
}

function log(txt) {
	fs = require('fs')
	
	fs.appendFileSync(__dirname+'/log.txt', txt+'\n', 'utf8')
}
