var prompt = require('prompt');
prompt.start();
 
  prompt.get([{
	 description: 'End Date ? ',
      name: 'endDate',
	 type: 'string',
      required: true
    }, {
	 description: 'Generations ? ',
      name: 'generations',
	 type: 'integer',
      conform: function (value) {
        if (value < 3)
		{
			console.log('value must be greater than 2')
			return false
		}
			
	   return true;
      }
    }], function (err, result) {
    // 
    // Log the results. 
    // 
	console.log('Command-line input received:');
	console.log('result: ', result)
	
	var encryptedPassword = encrypt(JSON.stringify(result))
	
	console.log('encrypted :', encryptedPassword);
	
	fs = require('fs')
	fs.writeFile('key',encryptedPassword,'utf8')
  });
  
  function encrypt(text){
  var crypto = require('crypto')
  var cipher = crypto.createCipher('aes-256-cbc','iydc9i376cdp06dcop862dxo%/#OIGC23864LUCD795')
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}