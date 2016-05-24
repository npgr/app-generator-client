#!/usr/bin/env node
 
/**
 * Module dependencies.
 */
 
var program = require('commander');
 
program
  .version('0.1.0')
  .option('app [app_name]', 'Create Application') //, create_app)
  .option('crud [model_name]', 'Create Crud', generate_crud)
  .option('--title [title]', 'Application Title')
  .option('--desc [app_desc]', 'Application Description')
  .option('--port <port>', 'Port Number')
  .option('--ver [version]', 'App version')
  .option('--repo [repo]', 'Url Source Repository')
  .option('--aut [author]', 'App Author')
  .option('--lic [license]', 'App type of License')
  .option('--pwd [pwd]', 'Admin Password')
  
  .parse(process.argv);

/** Main **/  
var colors = require("cli-color");
if (program.app)
{	
	create_app(program.app)
}
	
/** Functions **/
function set_app()
{
	var ask = false
	var schema = { properties: {} }
	if (program.title)
		console.log(colors.green('> title: '), colors.cyan(program.title))
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
		console.log(colors.green('> App Description: '), colors.cyan(program.desc))
	else {
		ask = true
		schema.properties.desc = { 
			description: colors.green('App Description: '), 
			type: 'string'
		}
	}
	if (program.port)
		console.log(colors.green('> App Description: '), colors.cyan(program.desc))
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
		console.log(colors.green('> App Version: '), colors.cyan(program.ver))
	else {
		ask = true
		schema.properties.ver = { 
			description: colors.green('App Version: '), 
			type: 'string', 
			/** Use Regex **/
			default: '1.0.0'
		}
	}
	if (program.repo)
		console.log(colors.green('> Url Source Repository: '), colors.cyan(program.repo))
	else {
		ask = true
		schema.properties.repo = { 
			description: colors.green('Url Source Repository: '), 
			type: 'string'
		}
	}
	if (program.aut)
		console.log(colors.green('> Author: '), colors.cyan(program.aut))
	else {
		ask = true
		schema.properties.aut = { 
			description: colors.green('Author: '), 
			type: 'string'
		}
	}
	if (program.lic)
		console.log(colors.green('> License: '), colors.cyan(program.lic))
	else {
		ask = true
		schema.properties.lic = { 
			description: colors.green('License: '), 
			type: 'string'
		}
	}
	if (program.pwd)
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
	}
	if (ask)
	{
		console.log(colors.green('\n\n Configure App\n'))
		var prompt = require('prompt')
		prompt.message = colors.green('> ')
		prompt.delimiter = ''
		prompt.colors = false
		
		prompt.start()
		prompt.get(schema, function(err, result) {
			if (result.pwd != result.pwd2)
				result.pwd = 'admin'
			//console.log('result: ', result)
			Object.assign(program, result)
			//console.log('program: ', program)
			config_app()
		})
	}
	else config_app()
}

function config_app()
{
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
	console.log('\n   1) cd '+program.app)
	console.log('\n   2) Start App, options:')
	console.log('\n      2.1) bash start.sh (it Runs App with PM2), Or')
	console.log('\n      2.2) PORT=<port Number> node app')
	console.log('\n   3) browse Url http://localhost:'+program.port)
	console.log('\n   4) login => User: Admin; Password: Configured Value')
	console.log('\n   -> View Running Process (if running on PM2) -> npm run list')
	console.log('\n   -> View Logs (if running on PM2) -> npm run logs')
	console.log('\n   -> Stop App (if running on PM2) -> npm stop')
	console.log('\n      Read Documentation: http://')
	console.log(colors.cyan('\n       ENJOY YOUR NEW APP !!!'))
	
	process.exit()
}

function create_app(app_name)
{
	var figlet = require('figlet')
	console.log()
	figlet('{ Generate App }', function(err, data) {
		if (err) {
			console.log('Generate 1.0');
			//console.dir(err);
			return;
		}
		console.log(colors.cyan(data))
		console.log('\n'+colors.cyan(' Version 1.0'))
		//process.exit(0)
		create_app2(app_name)
	});
}

function create_app2(app_name) 
{	
	var tar = require('tar-fs')
	var readline = require('readline');
	var fs = require('fs')
	
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
	var bar = {count: 0, total: 17010, size:0}
	
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

function generate_crud(model)
{
	var get = require('simple-get')
	var concat = require('concat-stream')
	var util = require('./util.js')
	
	util.get_model(model, function(jsondat) {
		//console.log('model: ', jsondat)
		
		var get = require('simple-get')
 
		var opts = {
			url: 'http://localhost:7272',
			//body: 'dato',//JSON.stringify(jsondat),
			headers: {
				'key': 'my key',
				'data': JSON.stringify(jsondat),
				'model': model
			}
		}
		get.post(opts, function (err, res) {
			if (err) throw err
			res.setTimeout(10000)
			var routes = res.headers['data-routes']
			console.log('Routes: \n', routes)
			res.pipe(concat(function (data) {
				// `data` is the decoded response, after it's been gunzipped or inflated 
				// (if applicable) 
				console.log('\ngot the response: ' + data)
			}))
		})
	})
}

