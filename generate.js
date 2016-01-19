//console.log(generate_model('newApp03', 'Producto', 'xx', 'yy'))

exports.generate_model = function(app, model, attributes, app_path)
//function generate_model(app, model, attributes, app_path)
{
	var fs = require('fs')
	var _ = require('lodash')
	
	var fileName = './apps/'+app+'/api/models/'+model+'.js'
	
	var MODEL_TEMPLATE = fs.readFileSync('./templates/crud5/model.template', 'utf8');
	var compiled_Model = _.template(MODEL_TEMPLATE)
	
	// Get attributes
	atrs = JSON.stringify(attributes)
	// Get options
	// Get Functions - User Points
	
	var model_template = compiled_Model({ 'model': model, 'attributes': '//Attributes', 'options': '//_options' , 'functions': '//functions()'})
	
	fs.writeFileSync(fileName, model_template)
	
	// controllers
	
	var CONTROLLER_TEMPLATE = fs.readFileSync('./templates/crud5/controller.template', 'utf8');
	var compiled_Controller = _.template(CONTROLLER_TEMPLATE)
	
	var controller_template = compiled_Controller({ 'model': model })
	
	var fileName = './apps/'+app+'/api/controllers/'+model+'Controller.js'
	
	//if (!fs.existsSync(fileName))
	fs.writeFileSync(fileName, controller_template)	
	
	return 'Model '+model+' Was Created'
}


