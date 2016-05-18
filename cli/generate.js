#!/usr/bin/env node
 
/**
 * Module dependencies.
 */
 
var program = require('commander');
 
program
  .version('0.0.1')
  .option('app [app_name]', 'Create Application', create_app)
  .option('crud [model_name]', 'Create Crud', generate_crud)
  .parse(process.argv);
 

/*if (program.app) 
	console.log('Generating application %s', program.app);*/

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
		width: 30,
		total: 1936
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
		if (count == 1936)
			bar.tick(36)
	});
	
	child.on('close', function (code, signal) {
		//echo('\n')
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
		width: 30,
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

