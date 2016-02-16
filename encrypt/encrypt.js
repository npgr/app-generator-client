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
	var decryptedPassword = decrypt(encryptedPassword)
	
	console.log('encrypted :', encryptedPassword);
	console.log('decrypted :', decryptedPassword);
	
	fs = require('fs')
	fs.writeFile('license.cfg',encryptedPassword,'utf8')
  });
  
  function encrypt(text){
  var crypto = require('crypto')
  var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var crypto = require('crypto')
  var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}