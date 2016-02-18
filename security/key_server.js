//key = read_key()
key = read_key()

//Lets require/import the HTTP module
var http = require('http');

var PORT = 0
process.argv.forEach(function(el, i) {
  var pos = el.indexOf('-port=') 
  if ( pos > -1) PORT = el.substring(pos+6)
})

//console.log('port = ',process.env.PORT)
console.log('port = ',PORT)

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
		/**console.log('request for: ', req.url) **/
		var response = ''
		switch (req.url)
		{
			case '/key':
				response = JSON.stringify(key)
				res.end(response)
			break;
			case '/generate_model':
				generate_model(res)
			break;
		}
		/**console.log('response: ', response)**/
	}
	else {
		res.end('Invalid Request: ' + req.url);
		console.log('Invalid Request: ' + req.url)
	}
}

function generate_model(res) {
	//if (key.generated_model)
	//	key.generated_model = 1
	//else
		key.generated_model++
		
	write_key()
	res.end(JSON.stringify(key))
}

function read_key() {
	
	var key_encrypt = require('fs').readFileSync('key', 'utf8')
	
	return JSON.parse(decrypt(key_encrypt))
}

function write_key() {
	
	var key_encrypt = encrypt(JSON.stringify(key))

	require('fs').writeFileSync('key',key_encrypt, 'utf8')
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