exports.npm_install = function()
{
	//return 'Npm Install on dir '
	var spawn = require('child_process').spawn;
	
	var child2 = spawn('cp',['-R', '-v', '../server/node_modules/*', 'apps/app01/node_modules/']);
	//var execFile = require('child_process').execFile;
	
	//var child2 = execFile('npm',['install'], {cwd: 'apps/app01'} );
	
	child2.stdout.on('data', function(data) {
		console.log(data.toString())
	})
	
	child2.stderr.on('data', function (data) {
		console.log('stderr: ', data.toString());
	});
	
	child2.on('close', function (code, signal) {
		if (code == 0)
			console.log('Applicaction Installed. For start Server, run node app')
		  else 
			console.log('Process End with code: ', code)
	})
}

exports.set_port = function(app, port)
{
	var fs = require('fs')
	
	var file = fs.readFileSync('./apps/'+app+'/config/env/development.js', 'utf8')
	
	var start = file.indexOf('port:')
	var end = file.indexOf('\n',start+4)
	
	var file2 = file.substring(0, start) + 'port: ' + port + file.substring(end)
	
	fs.writeFileSync('./apps/'+app+'/config/env/development.js', file2, 'utf8')
	
	return 'Success'
}