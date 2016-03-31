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

exports.set_port = function(app, port, path)
{
	var fs = require('fs')
	
	fs.writeFileSync(path+'/'+app+'/start.sh', 'PORT='+port+' npm start', 'utf8')
	
	return 'Success'
}

exports.set_package_json = function(app, path, app_des, ver, repo, author, license) {
	
	var fs = require('fs')
		
	var data_raw = fs.readFileSync(path+'/'+app+'/package.json', 'utf8')
			
	var data = JSON.parse(data_raw)
			
	data.name = app
	data.description = app_des
	data.version = ver
	data.repository = repo
	data.author = author
	data.license = license
	
	var data_out = JSON.stringify(data, null, 4)
	
	fs.writeFileSync(path+'/'+app+'/package.json', data_out, 'utf8')
	
	return 'Success'
}

exports.set_view_layout = function(app, app_title, path) {
	
	var fs = require('fs')
		
	var data_raw = fs.readFileSync(path+'/'+app+'/views/layout.ejs', 'utf8')
			
	var data = data_raw.toString()
	
	var ini = data.indexOf('<title>')
	var end = data.indexOf('</title>')
			
	var data_out = data.substr(0,ini+7) + app_title + data.substr(end) 
			
	fs.writeFileSync(path+'/'+app+'/views/layout.ejs', data_out, 'utf8')
	
	return 'Success'
}

/** Not Used **/
exports.set_port_old = function(app, port, path)
{
	var fs = require('fs')
	
	var file = fs.readFileSync(path+'/'+app+'/config/env/development.js', 'utf8')
	
	var start = file.indexOf('port:')
	var end = file.indexOf('\n',start+4)
	
	var file2 = file.substring(0, start) + 'port: ' + port + file.substring(end)
	
	fs.writeFileSync(path+'/'+app+'/config/env/development.js', file2, 'utf8')
	
	var file = fs.readFileSync(path+'/'+app+'/config/env/production.js', 'utf8')
	
	var start = file.indexOf('port:')
	var end = file.indexOf('\n',start+4)
	
	var file2 = file.substring(0, start) + 'port: ' + port + file.substring(end)
	
	fs.writeFileSync(path+'/'+app+'/config/env/production.js', file2, 'utf8')
	
	return 'Success'
}