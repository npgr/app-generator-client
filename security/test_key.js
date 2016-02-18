console.log('Usage:')
console.log('       test_key <host> <port> <path>\n')

//console.log ('parameters: ', process.argv)

host = process.argv[2]
port = process.argv[3]

option = '/'+process.argv[4] 

//console.log('host: ', host)
//console.log('port: ', port)
//console.log('option: ', option)

console.log('\n Result:\n')

const http = require('http'); 
var options = {
    host: host,
    port: port,
	path: option,
    method: 'POST',
    //headers: {
    //    accept: 'application/json'
    //}
};


/*switch (option)
{
	case 'key': 
		options.path = '/key'
	break;
}*/

	var request = http.request(options,function(res){
		res.on('data',function(data_stream){
			var data = data_stream.toString()
			//var obj = JSON.parse(decrypt(key))
			//console.log('Key ', key)
			console.log(JSON.parse(data))
			/*switch (option)
			{
				case 'key':
					console.log(JSON.parse(data))
				break;
			}*/
		});
	});
	
	request.on('error', function(err) {
		console.log('Cannot Get License Information')
	})
	
	request.end();


function decrypt(text){
  var crypto = require('crypto')
  var decipher = crypto.createDecipher('aes-256-cbc','iydc9i376cdp06dcop862dxo%/#OIGC23864LUCD795')
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}


/* **** prueba2 


http = require('http')

http.get('http://localhost:5845/key', function(res) {
	console.log("Connected");
  //console.log('respuesta',res.resume());
  // consume response body
  //res.resume();
   res.on('data',function(data){
        console.log(data);
    });
}).on('error', function(e) {
  console.log('error: ',e.message);
});
*/


/* ***** prueba 3
	const http = require('http');
	// get url of server
  var options2 = {
	host: 'www.google.com',
  }
  var options = {
    host: '127.0.0.1',
	hostname: 'localhost',
	port: 5845,
	path: '/key',
	method: 'GET'
  };

  callback = function(res) {
   str = '';

  //another chunk of data has been recieved, so append it to `str`
  res.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  res.on('end', function () {
    console.log(str);
  });
  }
  
  var req = http.request(options, callback);
  req.end(); */
 
