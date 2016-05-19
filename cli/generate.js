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
  .option('--path [path]', 'App Path')
  .option('--ver [version]', 'App version')
  .option('--repo [repo]', 'Url Source Repository')
  .option('--aut [author]', 'App Author')
  .option('--lic [license]', 'App type of License')
  .option('--pwd [pwd]', 'Admin Password')
  
  .parse(process.argv);

/** Main **/  

if (program.app)
{	
	//create_app(program.app)
	set_app()
}
	
/** Functions **/
function set_app()
{
	/** Not use chalk **/
	var colors = require("colors/safe");
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
	if (program.path)
		console.log(colors.green('> App Path: '), colors.cyan(program.path))
	else {
		ask = true
		schema.properties.path = { 
			description: colors.green('App Path: '), 
			type: 'string'
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
		console.log(colors.cyan('\nStart\n'))
		var prompt = require('prompt')
		prompt.message = colors.green('> ')
		prompt.delimiter = ''
		prompt.colors = false
		
		prompt.start()
		prompt.get(schema, function(err, result) {
			if (result.pwd != result.pwd2)
				result.pwd = 'admin'
			console.log('result: ', result)
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
	console.log('Set Port = ', program.port)
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
	console.log('Set package.json')
	/** Set view layout **/
	util.set_view_layout(program.app, program.title)
	console.log('Set View layout')
	/** Set Session Secret **/
	util.set_session_secret(program.app)
	console.log('Set Session Secret')
	/** Missing set hmac keys & admin password **/
	console.log('Finish')
	console.log('Run app: bash start.sh')
}

function create_app(app_name)
{
	console.log('Creating Dir %s', app_name )
	
	require('shelljs/global');
	mkdir(app_name)
	
	/** decompress App */
	echo('Extracting webserver.tar')
	
	var ProgressBar = require('progress');
	var bar = new ProgressBar('[:bar] :percent / :elapseds - ETA :etas', {
		complete: '=',
		incomplete: ' ',
		width: 25,
		total: 1938
	});
	
	var readline  = require('readline');
	var child = exec('tar -xvf webserver.tar.gz -C '+app_name, {async:true, silent:true});
	
	count = 0
	readline.createInterface({
		input     : child.stdout,
		terminal  : false
	}).on('line', function(line) {
		//console.log(line);
		count++
		if ((count % 50) == 0) 
			bar.tick(50);
		if (count == 1938)
			bar.tick(38)
		/*if (count > 1900)
			bar.tick(1)*/
	});
	
	child.on('close', function (code, signal) {
		echo('\n')
		extract_node_modules(app_name)
	})
}

function extract_node_modules(app_name)
{
	//require('shelljs/global');
	var ProgressBar = require('progress');
	var readline  = require('readline');
	
	/** Decompress node_modules **/
	echo('Extracting node_modules.tar')
	
	var bar2 = new ProgressBar('[:bar] :percent / :elapseds - ETA :etas', {
		complete: '=',
		incomplete: ' ',
		width: 25,
		total: 13860
	});

	var child2 = exec('tar -xvf node_modules.tar.gz -C '+app_name, {async:true, silent:true})
	count = 0
	readline.createInterface({
		input     : child2.stdout,
		terminal  : false
	}).on('line', function(line) {
		//console.log(line);
		count++
		if ((count % 100) == 0) 
			bar2.tick(100);
		if (count == 13860)
			bar2.tick(60)
	});
	
	child2.on('close', function (code, signal) {
		echo('App '+app_name+' created')
		set_app()
	})
	
	/*if (exec('tar -xf node_modules.tar.gz -C '+app_name).code == 0) {
		echo('Application %s Created', app_name)
		echo('Finish')
	} else {
		echo('Error creating App');
		return
	}*/
	
}

function generate_crud(model_name)
{
	console.log('Generating Crud %s', model_name)
}

