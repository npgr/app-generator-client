exports.set_port = function(app, port)
{
	var fs = require('fs')

	fs.writeFileSync('./'+app+'/start.sh', 'PORT='+port+' npm start', 'utf8')

	return 'Success'
}

exports.set_view_layout = function(app, app_title) {
	var fs = require('fs')
	
	var data_raw = fs.readFileSync('./'+app+'/views/layout.ejs', 'utf8')
			
	var data = data_raw.toString()
			
	data = data.replace(/#app_title/g, app_title)
			
	fs.writeFileSync('./'+app+'/views/layout.ejs', data, 'utf8')
	
	return 'Success'
}

exports.set_session_secret = function(app)
{
	var fs = require('fs')

	var data_raw = fs.readFileSync('./'+app+'/config/session.js')
	
	var data = data_raw.toString()

	var crypto = require('crypto')
	
	var secret = crypto.randomBytes(20).toString('hex');
	
	data = data.replace(/#secret/g, secret)
			
	fs.writeFileSync('./'+app+'/config/session.js', data)

	return 'Success'
}

exports.set_package_json = function(pkg)
{ 
	var fs = require('fs')

	var data_raw = fs.readFileSync('./'+pkg.app+'/package.json')
			
	var data = data_raw.toString()
			
	data = data.replace(/#app/g, pkg.app)
	data = data.replace(/#ap_des/g, pkg.app_des)
	data = data.replace(/#ver/g, pkg.ver)
	data = data.replace(/#repo/g, pkg.repo)
	data = data.replace(/#author/g, pkg.author)
	data = data.replace(/#license/g, pkg.license)
	
	fs.writeFileSync('./'+pkg.app+'/package.json', data)
	
	return 'Success'
}