#!/usr/bin/env node
 
/**
 * Module dependencies.
 */
 
var program = require('commander');
var colors = require("cli-color");
var fs = require('fs');
 
program
  .version('0.1.0')
  .option('app [app_name]', 'Create Application', create_app)
  //.option('app [app_name]', 'Create Application', set_app)
  .option('crud [model_name]', 'Create Crud', generate_crud)
  .option('set [token]', 'Set Token', set_token)
  .option('--title [title]', 'Application Title')
  .option('--desc [app_desc]', 'Application Description')
  .option('--port <port>', 'Port Number')
  .option('--ver [version]', 'App version')
  .option('--repo [repo]', 'Url Source Repository')
  .option('--aut [author]', 'App Author')
  .option('--lic [license]', 'App type of License')
  //.option('--pwd [pwd]', 'Admin Password')
  
  .parse(process.argv);

/*if (program.app)
{	
	create_app(program.app)
}*/

process.on('exit', function () {
	if (program.crud & process.exitCode != 1)
	{
		if (gen_cruds) console.log(' Aut End: ', aut_end, ' Aut Cruds: ', aut_cruds, ' Gen Cruds: ', gen_cruds)
		console.log (colors.cyan('\n *** CRUD CREATED !!!'))
		console.log (colors.cyan('\n Browse http://ServerName:port/'+model_name+'/list'))
	}
})

/** Functions **/
function server_url() {
	var url= 'https://appgen2-npgr.rhcloud.com'
	if (process.env.LOCAL)
		//url= 'http://localhost:8080'
		url= 'http://localhost:8080'
	return url
}

function set_token(token) {
	var get = require('simple-get')
	var log = console.log
	
	var opts = {
			url: server_url()+'/Machine/set/'+token,
			headers: {
				//'content-type': 'text/plain; charset=utf-8',
				'appgen-token': token
			}
		}
	get.post(opts, function (err, res) {
		if (err) throw err
		res.setTimeout(10000)
		
			res.on('data', function(data) {
				//log('data', data.toString())
				// Check if Json
				try {
					var obj = JSON.parse(data.toString())
				} catch (e) {
					log('Invalid data received from server')
					process.exit(0)
				}
				if (obj.token)
				{
					var fs = require('fs')
	
					var config = {token: obj.token}
	
					fs.writeFileSync(__dirname+'/config.json', JSON.stringify(config), 'utf-8')
					log('Token Set')
				} else
					log(obj)
			})
		})
}
function set_app() {
	var ask = false
	var schema = { properties: {} }
	if (program.title)
		console.log(colors.yellow('> ')+colors.green('title: '), colors.cyan(program.title))
	else {
		ask = true
		schema.properties.title = { 
			description: colors.green('App Title: '), 
			type: 'string', 
			required: true,
			message: 'Value Required'
		}
	}
	if (program.desc)
		console.log(colors.yellow('> ')+colors.green('App Description: '), colors.cyan(program.desc))
	else {
		ask = true
		schema.properties.desc = { 
			description: colors.green('App Description: '), 
			type: 'string'
		}
	}
	if (program.port)
		console.log(colors.yellow('> ')+colors.green('App Description: '), colors.cyan(program.desc))
	else {
		ask = true
		schema.properties.port = { 
			description: colors.green('Port: '), 
			type: 'integer', 
			required: true,
			default: 3000,
			message: 'Port must be Numeric',
		}
	}
	if (program.ver)
		console.log(colors.yellow('> ')+colors.green('App Version: '), colors.cyan(program.ver))
	else {
		ask = true
		schema.properties.ver = { 
			description: colors.green('App Version: '), 
			pattern: /^(\d+\.)?(\d+\.)?(\*|\d+)$/,
			type: 'string', 
			default: '1.0.0',
			message: 'Invalid version number'
		}
	}
	if (program.repo)
		console.log(colors.yellow('> ')+colors.green('Url Source Repository: '), colors.cyan(program.repo))
	else {
		ask = true
		schema.properties.repo = { 
			description: colors.green('Url Source Repository: '), 
			type: 'string'
		}
	}
	if (program.aut)
		console.log(colors.yellow('> ')+colors.green('Author: '), colors.cyan(program.aut))
	else {
		ask = true
		schema.properties.aut = { 
			description: colors.green('Author: '), 
			type: 'string'
		}
	}
	if (program.lic)
		console.log(colors.yellow('> ')+colors.green('License: '), colors.cyan(program.lic))
	else {
		ask = true
		schema.properties.lic = { 
			description: colors.green('License: '), 
			type: 'string'
		}
	}
	/*if (program.pwd)
		console.log(colors.green('> Admin Password: '), colors.cyan(program.pwd))
	else {
		ask = true
		schema.properties.pwd = { 
			description: colors.green('Admin Password: '), 
			type: 'string',
			hidden: true,
			replace: '*',
			required: true,
			message: 'Password Required'
		}
		schema.properties.pwd2 = { 
			description: colors.green('Confirm Password: '), 
			type: 'string',
			hidden: true,
			replace: '*',
			required: true,
			message: 'Confirm Password Required',
			conform: function(pwd2) {
				if (prompt.history('pwd').value != pwd2)
				{
					console.log(colors.yellow('Confirm Password do not math, assigned Password = \'admin\''))
					return true
				}
				return true
			}
		}
	}*/
	if (ask)
	{
		console.log(colors.green('\n\n Configure App\n'))
		var prompt = require('prompt')
		prompt.message = colors.yellow('> ')
		prompt.delimiter = ''
		prompt.colors = false

		prompt.start()
		prompt.get(schema, function(err, result) {
			//if (result.pwd != result.pwd2)
				//result.pwd = 'admin'
			//console.log('result: ', result)
			Object.assign(program, result)
			//console.log('program: ', program)
			config_app()
		})
	}
	else config_app()
}

function config_app() {
	var util = require('./util.js')
	/** Set Port **/
	util.set_port(program.app, program.port)
	//console.log('Set Port = ', program.port)
	/** Set package.json **/
	var pkg = 
	{
		app: program.app,
		app_des: program.desc,
		ver: program.ver,
		repo: program.repo,
		author: program.aut,
		license: program.lic
	}
	util.set_package_json(pkg)
	//console.log('Set package.json')
	/** Set view layout **/
	util.set_view_layout(program.app, program.title)
	//console.log('Set View layout')
	/** Set Session Secret **/
	util.set_session_secret(program.app)
	//console.log('Set Session Secret')
	/** Missing set hmac keys & admin password **/
	console.log(colors.green('\n App Configured !!!'))
	console.log(colors.green('\n Getting Started: '))
	console.log(colors.yellow('\n   1)')+' cd '+program.app)
	console.log(colors.yellow('\n   2)')+' Start App, options:')
	console.log(colors.yellow('\n    2.1)')+' bash start.sh (it Runs App with PM2), Or')
	console.log(colors.yellow('\n    2.2)')+' PORT=<port Number> node app')
	console.log(colors.yellow('\n   3)')+' browse Url http://localhost:'+program.port)
	console.log(colors.yellow('\n   4)')+' login => User: Admin; Password: admin')
	console.log(colors.yellow('\n   ->)')+' View Running Process (if running on PM2) -> npm run list')
	console.log(colors.yellow('\n   ->)')+' View Logs (if running on PM2) -> npm run logs')
	console.log(colors.yellow('\n   ->)')+' Stop App (if running on PM2) -> npm stop')
	console.log(colors.greenBright('\n      Read Documentation: http://'))
	console.log(colors.cyan('\n       ENJOY YOUR NEW APP !!!'))
	
	process.exit()
}

function create_app(app_name) {
	var figlet = require('figlet')
	console.log()
	figlet('{ Generate App }', function(err, data) {
		if (err) {
			console.log('Generate App');
			//console.dir(err);
			return;
		}
		console.log(colors.cyan(data))
		console.log('\n'+colors.cyan(' Version 1.0'))
		//process.exit(0)
		create_app2(app_name)
	});
}

function create_app2(app_name) {	
	var tar = require('tar-fs')
	var readline = require('readline');
	
	console.log(colors.green('\n Generating App: '+program.app))
	/** First time extract webserver.tar.gz **/
	if (fs.existsSync(__dirname+'/webserver.tar.gz'))
	{
		console.log(colors.green('\n Preparing files...'))
		var sh = require('shelljs');
		var cwd = sh.pwd()
		//console.log('Current Directory', cwd)
		sh.cd(__dirname)
		var child = sh.exec('gzip -d webserver.tar.gz '); //, {async:true, silent:true});
		sh.cd(cwd)
	}
	var extract = tar.extract('./'+app_name)
	var bar = {count: 0, total: 19298, size:0}
	
	extract.on('entry', function(header, stream, callback) {
		bar.count ++
		//bar.size += header.size
		stream.on('end', function() {
			//console.log(header.name)
			callback() // ready for next entry
		})
		//stream.resume() // just auto drain the stream
	})
	extract.on('finish', function() {
		clearInterval(interval);
		readline.cursorTo(process.stdout, 0);
		var min = Math.floor(seg/60)
		seg = seg % 60
		var msg = ' ['+colors.green('===============')+'] 100% - Elapsed Time: '
		if (min > 0)
			msg += (min+'m:')
		msg += (seg+'s             ')
		process.stdout.write(msg)
		//console.log('\nFinish !!!')
		set_app()
	})
	/** Percentage of Extraction **/
	var seg = 0
	var interval = setInterval(function(){  
		seg++
		readline.cursorTo(process.stdout, 0);
		var pct = Math.floor(bar.count / bar.total * 1000 )
		var barl = Math.floor(pct / 67)
		var eta = Math.floor(seg / pct * 10000)
		eta = Math.floor(eta - seg*10)/10
		process.stdout.write(' [')
		for (var i=0; i < barl; i++)
			//process.stdout.write(colors.bgGreen(' '))
			process.stdout.write(colors.green('='))
		for (var i=barl; i<15; i++)
			process.stdout.write(' ')
		process.stdout.write('] '+ pct/10+ '% - ETA: '+eta+'s             ')
	}, 1500);
	/** Start extracting **/
	console.log(colors.green('\n Extracting...\n'))
	fs.createReadStream(__dirname+'/webserver.tar').pipe(extract)
	//fs.createReadStream(__dirname+'/webserver.tar').pipe(tar.extract('./'+app_name))
}

function generate_crud(model) {
	model_name = model
	var figlet = require('figlet')
	console.log()
	figlet('{ Generate Crud }', function(err, data) {
		if (err) {
			console.log('Generate Crud');
			//console.dir(err);
			return;
		}
		console.log(colors.cyan(data))
		console.log('\n'+colors.cyan(' Version 1.0'))
		//process.exit(0)
		generate_crud2(model)
	});
}

function generate_crud2(model) {
	var fs = require('fs')
	var get = require('simple-get')
	var concat = require('concat-stream')
	var util = require('./util.js')
	
	var data = fs.readFileSync(__dirname+'/config.json','utf-8')
 	var obj = JSON.parse(data)
	
	if (!obj.token || obj.token == '')
	{
		console.log(colors.greenBright('\n Warning: You need to create an Account'))
		console.log(colors.greenBright('          Go to http://appgen2-npgr.rhcloud.com/signup'))
		process.exit(1)
	}
	
	util.get_model(model, function(jsondat) {
		//console.log('model: ', jsondat)
		
		var get = require('simple-get')
		var crud_data = ''
		
		var opts = {
			url: server_url()+'/generate/crud',
			body: JSON.stringify(jsondat),
			headers: {
				//'content-type': 'text/plain; charset=utf-8',
				'appgen-token': obj.token,
				//'data': JSON.stringify(jsondat),
				'model': model
			}
		}
		get.post(opts, function (err, res) {
			if (err) throw err
			res.setTimeout(10000)
			//var routes = res.headers['data-routes']

			/*res.on('data', function(data) {
				console.log('data length:', data.length)	
			})*/
			
			res.pipe(concat(function (data) {
				// `data` is the decoded response, after it's been gunzipped or inflated 
				// (if applicable) 
				//console.log('\ngot the response: \n' + data)
				//console.log('Finish Data length: ', data.length)
				//console.log('headers: ', res.headers)
				if (!res.headers['app-msg'])
				{
					if (res.headers['aut_end']) aut_end = res.headers['aut_end']
					if (res.headers['aut_cruds']) aut_cruds = res.headers['aut_cruds']
					if (res.headers['gen_cruds']) gen_cruds = res.headers['gen_cruds']
					if (res.headers['appgen-token'])
					{
						var fs = require('fs')
						var config = {token: res.headers['appgen-token']}
						fs.writeFileSync(__dirname+'/config.json', JSON.stringify(config), 'utf-8')
					}	
					create_crud(model, data)
				}
				else
				{
					console.log('msg: ',res.headers['app-msg'])
					process.exit(1)
				}
			}))
			//res.pipe(fs.createWriteStream('./crud_orig.js'))
			/*res.on('end', function() {
				console.log('Data received')
				console.log('data length: ',data.length)	
			})*/
		})
	})
}

function create_crud(model, data) {	
	   /***** Routes *****/
	var end = data.indexOf('/******* Controller *******/')
	//console.log('Routes: ', data.toString().substr(0,end-1))
	generate_routes(data.toString().substr(0,end-1))
	   /***** Controller *****/
	var ini = end+28
	end = data.indexOf('/******* Language *******/')
	var len = end - ini 
	generate_controller(model, data.toString().substr(ini,len))
	   /***** Language *****/
	ini = end+26
	end = data.indexOf('/******* CRUD *******/')
	len = end - ini - 1
	//console.log('Language: ', data.toString().substr(ini,len))
	generate_language(data.toString().substr(ini,len))
	   /***** Crud: List.ejs *****/
	ini = end+20
	set_user_points(model, data.toString().substr(ini))
}

function generate_routes(data) {
	var routes = fs.readFileSync('./config/routes.js', 'utf8')
	console.log(colors.green('\n> Routes\n'))
	var new_routes = JSON.parse(data)
	var keys = Object.keys(new_routes)
	var pos = 0
	keys.forEach(function(key) {
		var item = '"'+key+'"'
		if (routes.indexOf(item) == -1)
		{
			pos = routes.lastIndexOf('"')
			routes = routes.substr(0, pos) +',\n  '+ item +': "'+new_routes[key]+'"'+routes.substr(pos+1) 
			//console.log('New Routes: \n'+routes)
			console.log('-> Route: '+item+' included')
		}
		 else
			 console.log('-> Route: '+item+' already exist')
	})
	
	//console.log('-> New Routes: ', new_routes)
}

function set_user_points(model, new_list){
	user_point = {
		'user_menu': '<!-- USER POINT - User Menu -->\n'+
						'<!-- END USER POINT - User Menu -->',
		'top_bar_functions': '/** USER POINT - Top Bar Functions **/\n'+
						 '/** END USER POINT - Top Bar Functions **/',				
		'edit_profile_open_dialog': '/** USER POINT - Edit Profile Open Dialog **/\n'+
									'/** END USER POINT - Edit Profile Open Dialog **/',
		'edit_profile_updated': '/** USER POINT - Edit Profile Updated **/\n'+
								'/** END USER POINT - Edit Profile Updated **/',
		'edit_profile_functions': '/** USER POINT - Edit Profile Functions **/\n'+
								'/** END USER POINT - Edit Profile Functions **/',
		'include_libs': '<!-- USER POINT - Include Libraries, Styles & Components -->\n'+
						'<!-- END USER POINT - Include Libraries, Styles & Components -->',
		'general_style': '/** USER POINT - General Style **/\n'+
						 '/** END USER POINT - General Style **/',
		'list_style': '<!--USER POINT - List Style-->\n'+
					  '<!--END USER POINT - List Style-->',
		'list_header': '<!--USER POINT - List Header-->\n'+
					  '<!--END USER POINT - List Header-->',
		'list_detail_menu': '<!--USER POINT - List Detail Menu-->\n'+
							'<!--END USER POINT - List Detail Menu-->',
		'list_start_ready': '//USER POINT - List Start Ready\n'+
						  '//END USER POINT - List Start Ready',
		'list_end_ready': '//USER POINT - List End Ready\n'+
						  '//END USER POINT - List End Ready',
		'list_functions': '//USER POINT - List Functions\n'+
						  '//END USER POINT - List Functions',
		'open_delete_dialog': '/** USER POINT - Open Delete Dialog **/\n'+
						    '/** END USER POINT - Open Delete Dialog **/',	
		'record_deleted': '/** USER POINT - Record Deleted **/\n'+
						'/** END USER POINT - Record Deleted **/',
		'delete_functions': '/** USER POINT - Delete Functions **/\n'+
						  '/** END USER POINT - Delete Functions **/',
		'open_display_dialog': '/** USER POINT - Open Display Dialog **/\n'+
							'/** END USER POINT - Open Display Dialog **/',
		'display_functions': '/** USER POINT - Display Functions **/\n'+
						   '/** END USER POINT - Display Functions **/', 
		'open_edit_dialog': '/** USER POINT - Open Edit Dialog **/\n'+
						  '/** END USER POINT - Open Edit Dialog **/',
		'validate_before_update': '/** USER POINT - Validate Before Update **/\n'+
							   '/** END USER POINT - Validate Before Update **/',	   
		'record_updated': '/** USER POINT - Record Updated **/\n'+
						'/** END USER POINT - Record Updated **/',
		'edit_functions': '/** USER POINT - Edit Functions **/\n'+
						'/** END USER POINT - Edit Functions **/',
		'open_new_dialog': '/** USER POINT - Open New Dialog **/\n'+
						'/** END USER POINT - Open New Dialog **/',
		'validate_before_create': '/** USER POINT - Validate Before Create **/\n'+
								'/** END USER POINT - Validate Before Create **/',
		'record_created': '/** USER POINT - Record Created **/\n'+
						'/** END USER POINT - Record Created **/',
		'new_functions': '/** USER POINT - New Functions **/\n'+
						'/** END USER POINT - New Functions **/',
		'before_create': '/** USER POINT - Before Create **/\n'+
						'/** END USER POINT - Before Create **/',
		'before_update': '/** USER POINT - Before Update **/\n'+
						'/** END USER POINT - Before Update **/',
		'before_delete': '/** USER POINT - Before Delete **/\n'+
						'/** END USER POINT - Before Delete **/'				
	}
	
	if (fs.existsSync('./views/'+model+'/list.ejs'))
	{
		var list_file = fs.readFileSync('./views/'+model+'/list.ejs', 'utf8');
		var list_file = fs.readFileSync('./views/'+model+'/list.ejs', 'utf8');
		
		var start = list_file.indexOf("<!-- USER POINT - User Menu -->")
		var end = list_file.indexOf("<!-- END USER POINT - User Menu -->")		
		if (end != -1)
			user_point.user_menu = list_file.substring(start, end+35)
		
		start = list_file.indexOf("/** USER POINT - Top Bar Functions **/")
		end = list_file.indexOf("/** END USER POINT - Top Bar Functions **/")		
		if (end != -1)
			user_point.top_bar_functions = list_file.substring(start, end+42)
		
		start = list_file.indexOf("/** USER POINT - Edit Profile Open Dialog **/")
		end = list_file.indexOf("/** END USER POINT - Edit Profile Open Dialog **/")		
		if (end != -1)
			user_point.edit_profile_open_dialog = list_file.substring(start, end+49)
		
		start = list_file.indexOf("/** USER POINT - Edit Profile Updated **/")
		end = list_file.indexOf("/** END USER POINT - Edit Profile Updated **/")		
		if (end != -1)
			user_point.edit_profile_updated = list_file.substring(start, end+45)
		
		start = list_file.indexOf("/** USER POINT - Edit Profile Functions **/")
		end = list_file.indexOf("/** END USER POINT - Edit Profile Functions **/")		
		if (end != -1)
			user_point.edit_profile_functions = list_file.substring(start, end+47)
				
		start = list_file.indexOf("<!-- USER POINT - Include Libraries, Styles & Components -->")
		end = list_file.indexOf("<!-- END USER POINT - Include Libraries, Styles & Components -->")		
		if (end != -1)
			user_point.include_libs = list_file.substring(start, end+64)
		
		start = list_file.indexOf("/** USER POINT - General Style **/")
		end = list_file.indexOf("/** END USER POINT - General Style **/")		
		if (end != -1)
			user_point.general_style = list_file.substring(start, end+38)
		
		start = list_file.indexOf("<!--USER POINT - List Style-->")
		end = list_file.indexOf("<!--END USER POINT - List Style-->")		
		if (end != -1)
			user_point.list_style = list_file.substring(start, end+34)
			
		start = list_file.indexOf("<!--USER POINT - List Header-->")
		end = list_file.indexOf("<!--END USER POINT - List Header-->")		
		if (end != -1)
			user_point.list_header = list_file.substring(start, end+35)
		
		start = list_file.indexOf("<!--USER POINT - List Detail Menu-->")
		end = list_file.indexOf("<!--END USER POINT - List Detail Menu-->")		
		if (end != -1)
			user_point.list_detail_menu = list_file.substring(start, end+40)

		start = list_file.indexOf("//USER POINT - List Start Ready")
		end = list_file.indexOf("//END USER POINT - List Start Ready")
		if (end != -1)
			user_point.list_start_ready = list_file.substring(start, end+35)
			
		start = list_file.indexOf("//USER POINT - List End Ready")
		end = list_file.indexOf("//END USER POINT - List End Ready")
		if (end != -1)
			user_point.list_end_ready = list_file.substring(start, end+33)
			
		start = list_file.indexOf("//USER POINT - List Functions")
		end = list_file.indexOf("//END USER POINT - List Functions")
		if (end != -1)
			user_point.list_functions = list_file.substring(start, end+33)
		
		start = list_file.indexOf("/** USER POINT - Open Delete Dialog **/")
		end = list_file.indexOf("/** END USER POINT - Open Delete Dialog **/")
		if (end != -1)
			user_point.open_delete_dialog = list_file.substring(start, end+43)
		
		start = list_file.indexOf("/** USER POINT - Record Deleted **/")
		end = list_file.indexOf("/** END USER POINT - Record Deleted **/")
		if (end != -1)
			user_point.record_deleted = list_file.substring(start, end+39)
		
		start = list_file.indexOf("/** USER POINT - Delete Functions **/")
		end = list_file.indexOf("/** END USER POINT - Delete Functions **/")
		if (end != -1)
			user_point.delete_functions = list_file.substring(start, end+41)
		
		start = list_file.indexOf("/** USER POINT - Open Display Dialog **/")
		end = list_file.indexOf("/** END USER POINT - Open Display Dialog **/")
		if (end != -1)
			user_point.open_display_dialog = list_file.substring(start, end+44)
		
		start = list_file.indexOf("/** USER POINT - Display Functions **/")
		end = list_file.indexOf("/** END USER POINT - Display Functions **/")
		if (end != -1)
			user_point.display_functions = list_file.substring(start, end+42)
		
		start = list_file.indexOf("/** USER POINT - Open Edit Dialog **/")
		end = list_file.indexOf("/** END USER POINT - Open Edit Dialog **/")
		if (end != -1)
			user_point.open_edit_dialog = list_file.substring(start, end+41)
		
		start = list_file.indexOf("/** USER POINT - Validate Before Update **/")
		end = list_file.indexOf("/** END USER POINT - Validate Before Update **/")
		if (end != -1)
			user_point.validate_before_update = list_file.substring(start, end+47)
		
		start = list_file.indexOf("/** USER POINT - Record Updated **/")
		end = list_file.indexOf("/** END USER POINT - Record Updated **/")
		if (end != -1)
			user_point.record_updated = list_file.substring(start, end+39)
		
		start = list_file.indexOf("/** USER POINT - Edit Functions **/")
		end = list_file.indexOf("/** END USER POINT - Edit Functions **/")
		if (end != -1)
			user_point.edit_functions = list_file.substring(start, end+39)
		
		start = list_file.indexOf("/** USER POINT - Open New Dialog **/")
		end = list_file.indexOf("/** END USER POINT - Open New Dialog **/")
		if (end != -1)
			user_point.open_new_dialog = list_file.substring(start, end+40)
		
		start = list_file.indexOf("/** USER POINT - Validate Before Create **/")
		end = list_file.indexOf("/** END USER POINT - Validate Before Create **/")
		if (end != -1)
			user_point.validate_before_create = list_file.substring(start, end+47)
		
		start = list_file.indexOf("/** USER POINT - Record Created **/")
		end = list_file.indexOf("/** END USER POINT - Record Created **/")
		if (end != -1)
			user_point.record_created = list_file.substring(start, end+39)
		
		start = list_file.indexOf("/** USER POINT - New Functions **/")
		end = list_file.indexOf("/** END USER POINT - New Functions **/")
		if (end != -1)
			user_point.new_functions = list_file.substring(start, end+38)
			
		start = list_file.indexOf("/** USER POINT - Before Create **/")
		end = list_file.indexOf("/** END USER POINT - Before Create **/")
		if (end != -1)
			user_point.before_create = list_file.substring(start, end+38)
			
		start = list_file.indexOf("/** USER POINT - Before Update **/")
		end = list_file.indexOf("/** END USER POINT - Before Update **/")
		if (end != -1)
			user_point.before_update = list_file.substring(start, end+38)
			
		start = list_file.indexOf("/** USER POINT - Before Delete **/")
		end = list_file.indexOf("/** END USER POINT - Before Delete **/")
		if (end != -1)
			user_point.before_delete = list_file.substring(start, end+38)
	}
	new_list = new_list.replace("#up_user_menu", user_point.user_menu)
	new_list = new_list.replace("#up_top_bar_functions", user_point.top_bar_functions)
	new_list = new_list.replace("#up_edit_profile_open_dialog", user_point.edit_profile_open_dialog)
	new_list = new_list.replace("#up_edit_profile_updated", user_point.edit_profile_updated)
	new_list = new_list.replace("#up_edit_profile_functions", user_point.edit_profile_functions)
	new_list = new_list.replace("#up_include_libs", user_point.include_libs)
	new_list = new_list.replace("#up_general_style", user_point.general_style)
	new_list = new_list.replace("#up_list_style", user_point.list_style)
	new_list = new_list.replace("#up_list_header", user_point.list_header)
	new_list = new_list.replace("#up_list_detail_menu", user_point.list_detail_menu)
	new_list = new_list.replace("#up_list_start_ready", user_point.list_start_ready)
	new_list = new_list.replace("#up_list_end_ready", user_point.list_end_ready)
	new_list = new_list.replace("#up_list_functions", user_point.list_functions)
	new_list = new_list.replace("#up_open_delete_dialog", user_point.open_delete_dialog)
	new_list = new_list.replace("#up_record_deleted", user_point.record_deleted)
	new_list = new_list.replace("#up_delete_functions", user_point.delete_functions)
	new_list = new_list.replace("#up_open_display_dialog", user_point.open_display_dialog)
	new_list = new_list.replace("#up_display_functions", user_point.display_functions)
	new_list = new_list.replace("#up_open_edit_dialog", user_point.open_edit_dialog)
	new_list = new_list.replace("#up_validate_before_update", user_point.validate_before_update)
	new_list = new_list.replace("#up_record_updated", user_point.record_updated)
	new_list = new_list.replace("#up_edit_functions", user_point.edit_functions)
	new_list = new_list.replace("#up_open_new_dialog", user_point.open_new_dialog)
	new_list = new_list.replace("#up_validate_before_create", user_point.validate_before_create)
	new_list = new_list.replace("#up_record_created", user_point.record_created)
	new_list = new_list.replace("#up_new_functions", user_point.new_functions)
	new_list = new_list.replace("#up_before_create", user_point.before_create)
	new_list = new_list.replace("#up_before_update", user_point.before_update)
	new_list = new_list.replace("#up_before_delete", user_point.before_delete)
	
	if (!fs.existsSync('./views/'+model)) fs.mkdirSync('./views/'+model)
	
	fs.writeFile('./views/'+model+'/list.ejs', new_list, function (err) {
		if (err) console.log(err);
		console.log(colors.green('\n> Crud\n'))
		console.log('-> File ./views/'+model+'/list.ejs Created\n')
	})
}

function generate_controller(model, new_controller) {
	var controller = fs.readFileSync('./api/controllers/'+model+'Controller.js', 'utf8')
	
	/** Remove Controller 'list' Function **/
	var regex = /\s*\t*list\s*:\s*function\s*\([^{]*{/

	var matches = controller.match(regex)
	
	if (matches)
	{
		var continueFor = true
		var cont = 1
		var len = 0
		for (i=matches['index']+matches[0].length; continueFor; i++)
		{
			len++
			if (controller.substr(i,1) == '{' )
				cont++
			if (controller.substr(i,1) == '}' )
				cont--
			if (cont == 0) 
			{
				continueFor = false
				if (controller.substr(i+1,1) == ',')
					len++
			}
		}
		/** Remove Existing 'list' Function **/
		//console.log('Controller before change: \n', controller)
		controller = controller.substr(0, matches['index']+1) + controller.substr(matches['index']+matches[0].length+len)
		//console.log('Controller after change: \n', controller)
		//console.log('List function exist ->', controller.substr(matches['index'],matches[0].length+len))
		
	}
	/** Remove Controller 'exist' Function **/
	regex = /\s*\t*exist\s*:\s*function\s*\([^{]*{/

	matches = controller.match(regex)
	
	if (matches)
	{
		var continueFor = true
		var cont = 1
		var len = 0
		for (i=matches['index']+matches[0].length; continueFor; i++)
		{
			len++
			if (controller.substr(i,1) == '{' )
				cont++
			if (controller.substr(i,1) == '}' )
				cont--
			if (cont == 0) 
			{
				continueFor = false
				if (controller.substr(i+1,1) == ',')
					len++
			}
		}
		/** Remove Existing 'exist' Function **/
		//console.log('Controller before change: \n', controller)
		controller = controller.substr(0, matches['index']+1) + controller.substr(matches['index']+matches[0].length+len)
		//console.log('Controller after change: \n', controller)
		//console.log('List function exist ->', controller.substr(matches['index'],matches[0].length+len))
	}
	/** Add Generated new Functions **/
	if (controller.indexOf('function') > 1)
	{
		new_controller = new_controller.substring(0, new_controller.length - 1);
		new_controller += ',\n'
	}
	regex = /module.exports\s*\t*=\s*\t*{\s*\t*\n/
	matches = controller.match(regex)
	//console.log('New Controller: ', controller)
	if (matches)
	{
		var pos = matches['index']+matches[0].length
		controller = controller.substr(0,pos-1) + new_controller + controller.substr(pos)
		//console.log('new_controller:\n', controller)
		fs.writeFile('./api/controllers/'+model+'Controller.js', controller, function(err) {
			if (err) console.log(err);
			console.log(colors.green('\n> Controller\n'))
			console.log('-> File ./api/controllers/'+model+'Controller.js Updated')
		})
	} else
	{
		console.log(colors.green('\n> Controller\n'))
		console.log('-> Error Procesing File ./api/controllers/'+model+'Controller.js')
	}
}

function generate_language(new_words) {
	var words = JSON.parse(new_words)
	var keys = Object.keys(words)
	
	fs.readdir('./config/locales', function (err, files) { 
		if (!err) 
		{
			console.log(colors.green('\n> Languages'))
			console.log('\n-> New Words: '+ keys)
			console.log('\n-> You Must include the translation in files ./config/locales/*.json')
			files.forEach(function(file) {
				if (file.indexOf('.json') > 0)
					updateLanguage(file, keys, words)
			})
		}
		else
			throw err; 
	});
}

function updateLanguage(file, keys, words) {
	fs.readFile('./config/locales/'+file, function(err, data) {
		if (err) throw err
		var obj = JSON.parse(data)
		keys.forEach(function(key) {
			if (!obj[key]) obj[key]= words[key]
		})
		var new_data = JSON.stringify(obj, null, '\t')
		fs.writeFile('./config/locales/'+file, new_data, function(err) {
			if (err) throw err
			console.log(colors.green('\n> Languages\n'))
			console.log('-> File ./config/locales/'+file+' Updated')
		})
	})
}