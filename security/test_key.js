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
		
		send_request(machine_crypt, disk_crypt)
	
	})
}) 

/** Functions **/

function send_request(machine_crypt, disk_crypt)
{
	
	const http = require('http'); 
	var options = {
		host: host,
		port: port,
		path: option,
		method: 'POST',
		headers: {
			//  accept: 'application/json'
			ioma_data: machine_crypt,
			doma_data: disk_crypt
		}
	};


	var request = http.request(options,function(res){
		res.on('data',function(data_stream){
			var data = data_stream.toString()
			var obj = JSON.parse(decrypt(data))
			//console.log('Key ', key)
			console.log(obj)
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
		console.log('Error: ', err)
	})
	
	request.end();
}

function decrypt(text){
  var crypto = require('crypto')
  var decipher = crypto.createDecipher('aes-256-cbc','iydc9i376cdp06dcop862dxo%/#OIGC23864LUCD795')
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
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
 
