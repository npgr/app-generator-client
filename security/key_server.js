//key = read_key()
key = read_key()

//Lets require/import the HTTP module
var http = require('http');

PORT = 0
process.argv.forEach(function(el, i) {
  var pos = el.indexOf('--port=') 
  if ( pos > -1) PORT = el.substring(pos+7)
})

//console.log('port = ',process.env.PORT)

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

function handleRequest(req, res){
	if (req.method == 'POST')
	{
		console.log('request for: ', req.url) 
		var response = ''
		switch (req.url)
		{
			case '/key':
				var response = JSON.stringify(key)
				res.end(encrypt(response))
			break;
			case '/can_generate_app':
				can_generate_app(res)
			break;
			case '/can_generate_model':
				can_generate_model(res)
			break;
			case '/can_generate_mfunction':
				can_generate_mfunction(res)
			break;
			case '/generate_app':
				generate_app(res)
			break;
			case '/generate_model':
				generate_model(res)
			break;
			case '/generate_mfunction':
				generate_mfunction(res)
			break;
		}
		/**console.log('response: ', response)**/
	}
	else {
		res.end('Invalid Request: ' + req.url);
		console.log('Invalid Request: ' + req.url)
	}
}

function generate_app(res) {
	key.generated_apps++
	
	//key.generated_apps= 1
	
	write_key()
	
	var response_obj = {
		generated_apps: key.generated_apps,
		remains: key.apps - key.generated_apps		
	}
	var response = JSON.stringify(response_obj)
	res.end(encrypt(response))
}

function generate_model(res) {
	//if (key.generated_model)
	//	key.generated_model = 1
	//else
		key.generated_models++
		
	write_key()
	
	var response_obj = {
		generated_models: key.generated_models,
		remains: key.models - key.generated_models		
	}
	
	var response = JSON.stringify(response_obj)
	res.end(encrypt(response))
}

function generate_mfunction(res) {
	//key.generated_mfunctions = 1
	key.generated_mfunctions++
	
	write_key()
	
	var response_obj = {
		generated_mfunctions: key.generated_mfunctions,
		remains: key.mfunctions - key.generated_mfunctions		
	}
	var response = JSON.stringify(response_obj)
	res.end(encrypt(response))
}

function can_generate_app(res) {
	var response_obj = {
			generate: true,
			generated_apps: key.generated_apps,
			remains: key.apps - key.generated_apps
	}
	
	/** Missing Check Date **/
	
	if (key.apps <= key.generated_apps)	response_obj.can = false 
			
	var response = JSON.stringify(response_obj)
	res.end(encrypt(response))
}

function can_generate_model(res) {
	var response_obj = {	
			generate: true,
			generated_models: key.generated_models,
			remains: key.models - key.generated_models
	}
	
	/** Missing Check Date **/
	
	if (key.models <= key.generated_models)	response_obj.can = false
	
	var response = JSON.stringify(response_obj)
	res.end(encrypt(response))
}

function can_generate_mfunction(res) {
	var machine = get_machine()

	if ((machine.cores != key.machine.cores) || (machine.cpu != key.machine.cpu) ||
	    (machine.speed != key.machine.speed) || (machine.address != key.machine.address))
	{
		var response_obj =
			{
				generate: false,
				key_machine: key.machine,
				machine: machine,
				msg: 'Server Does not correspond with License'
			}
		
		var response = JSON.stringify(response_obj)
		res.end(encrypt(response))
		return
	} 

	get_today(function(err, date) {
		if (err) {
			console.log('Error Getting Date')
			
			var response_err = { msg: 'error'}
			var resp_err = JSON.stringify(response_err)
			res.end(encrypt(resp_err))
			return
		}
		var response_obj = {	
			generate: true,
			licensed_users: key.users,
			endDate: key.endDate,
			today: date,
			generated_mfunctions: key.generated_mfunctions,
			remains: key.mfunctions - key.generated_mfunctions,
			ga: key.ga,
			download: key.download,
			print: key.print,
			help: key.help,
			msg: 'Licensed Until '+ key.endDate
		}
	
		if (key.mfunctions <= key.generated_mfunctions) {
			response_obj.generate = false
			response_obj.msg = 'Exceded Number of Generated Model Functions Licensed'
		}
		
		if (response_obj.endDate < response_obj.today) {
			response_obj.generate = false
			response_obj.msg = 'License Date Expired'
		}
		
		if (!response_obj.generate)
		{
			var response = JSON.stringify(response_obj)
			res.end(encrypt(response))
			return
		}

		/** Validate Number of Users Licensed **/ 
		get_users(function(err, users) {
			response_obj.created_users = users
			
			if (users > key.users) {
				response_obj.generate = false
				response_obj.msg = 'Exceded Number of Users Licensed'
			}
			
			var response = JSON.stringify(response_obj)
			res.end(encrypt(response))
		})
	})
}

function get_users(cb) {
	const http = require('http'); 
	var options = {
		host: 'localhost',
		port: PORT - 333,
		path: '/User',
		method: 'GET',
		headers: {
		//    accept: 'application/json'
			my_key: 'abc'
		}
	};
	
	var request = http.request(options,function(res){
		data = ''
		res.on('data',function(data_stream){
			data += data_stream.toString()
			//console.log('data: ', data)
		});
		res.on('end', function() {
			var data_obj = JSON.parse(data)
			//console.log('data final: ', data)
			//cb(false, data_obj.length)
			cb(false, data_obj.length)
		})
	});
	
	request.on('error', function(err) {
		console.log('Cannot Get License Information')
		console.log('Error: ', err)
	})
	
	request.end();
	
	//cb(false, 3)
}

function get_today(cb) {
	var Sntp = require('sntp');
 	// All options are optional 
	var options = {
		//host: 'nist1-sj.ustiming.org',  // Defaults to pool.ntp.org 
		//port: 123,                      // Defaults to 123 (NTP) 
		//resolveReference: true,         // Default to false (not resolving) 
		timeout: 2000                   // Defaults to zero (no timeout) 
	};
 	// Request server time
	
	Sntp.time(options, function (err, time) {
		if (err) {
			console.log('Failed on get Current Date: ' + err.message);
			cb(true, { msg: 'Cannot Get Current Date'}, '')
		} 
		else 
		{
			var today = new Date(time.receiveTimestamp)
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();
		
			if (dd < 10) dd = '0' + dd
			if (mm < 10) mm = '0' + mm
			
			var todayy = yyyy + '/' + mm + '/' + dd
		
			cb(false, todayy)
		}
	})
}

function read_key() {
	
	var key_encrypt = require('fs').readFileSync('./license/key', 'utf8')
	
	return JSON.parse(decrypt(key_encrypt))
}

function write_key() {
	
	var key_encrypt = encrypt(JSON.stringify(key))

	require('fs').writeFileSync('./license/key',key_encrypt, 'utf8')
}

function decrypt(text){
  var crypto = require('crypto')
  var decipher = crypto.createDecipher('aes-256-cbc','iydc9i376cdp06dcop862dxo%/#OIGC23864LUCD795')
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

function encrypt(text){
	var crypto = require('crypto')
	var cipher = crypto.createCipher('aes-256-cbc','iydc9i376cdp06dcop862dxo%/#OIGC23864LUCD795')
	var crypted = cipher.update(text,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}

function get_machine() {
	var os = require('os')

	var cpus = os.cpus()
	var net = os.networkInterfaces()
	var keys = Object.keys(net)

	//console.log('Net Info: ', net)
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