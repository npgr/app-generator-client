//key = read_key()
key = read_key()

//Lets require/import the HTTP module
var http = require('http');

var PORT = 0
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
	var response_obj = {	
		generate: true,
		endDate: key.endDate,
		today: get_today(),
		generated_mfunctions: key.generated_mfunctions,
		remains: key.mfunctions - key.generated_mfunctions,
		ga: key.ga,
		download: key.download,
		print: key.print,
		help: key.help
	}
	
	/** Missing Check Date **/
	
	if (key.mfunctions <= key.generated_mfunctions) response_obj.generate = false
	
	if (key.endDate < key.today) response_obj.generate = false
	
	var response = JSON.stringify(response_obj)
	res.end(encrypt(response))
}

function get_today() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	
	return yyyy + '/' + mm + '/' + dd
}

function read_key() {
	
	var key_encrypt = require('fs').readFileSync('./security/key', 'utf8')
	
	return JSON.parse(decrypt(key_encrypt))
}

function write_key() {
	
	var key_encrypt = encrypt(JSON.stringify(key))

	require('fs').writeFileSync('./security/key',key_encrypt, 'utf8')
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