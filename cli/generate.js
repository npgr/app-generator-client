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
	console.log('ready for create app: %s', app_name )
}

function generate_crud(model_name)
{
	console.log('Generating Crud %s', model_name)
}

