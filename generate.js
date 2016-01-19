//console.log(generate_model('newApp03', 'Producto', [{attribute: 'name', type:'string', enum: '', enumdes:''}], 'yy'))

console.log(generate_function())

exports.generate_model = function(app, model, attributes, app_path)
//function generate_model(app, model, attributes, app_path)
{
	var fs = require('fs')
	var _ = require('lodash')
	
	var fileName = './apps/'+app+'/api/models/'+model+'.js'
	
	var MODEL_TEMPLATE = fs.readFileSync('./templates/crud5/model.template', 'utf8');
	var compiled_Model = _.template(MODEL_TEMPLATE)
	
	var model_file = {}
	for (i=0; i< attributes.length; i++)
	{
		atr = attributes[i].attribute
		if (atr!='id')
		{
			model_file['iii'+atr+'iii'] = {};
			model_file['iii'+atr+'iii'].iiiuuu_descriptioniii = attributes[i].description
			if (attributes[i].textarea_cols > 0) 
			{
				model_file['iii'+atr+'iii'].iiiuuu_textarea_colsiii = attributes[i].textarea_cols
				model_file['iii'+atr+'iii'].iiiuuu_textarea_rowsiii = attributes[i].textarea_rows
			}
			if (attributes[i].hide) {
				model_file['iii'+atr+'iii'].iiiuuu_hideiii = true
			} 
			model_file['iii'+atr+'iii'].iiitypeiii = attributes[i].type
			if (attributes[i].required) {
				model_file['iii'+atr+'iii'].iiirequirediii = true
			}
			if (attributes[i].enum != '') 
			{
				model_file['iii'+atr+'iii'].iiienumiii = attributes[i].enum.split(',')
				model_file['iii'+atr+'iii'].iiiuuu_enumdesiii = attributes[i].enumdes.split(',')
				
				for (j=0; j < model_file['iii'+atr+'iii'].iiienumiii.length; j++)
					model_file['iii'+atr+'iii'].iiienumiii[j].trimLeft().trimRight()
				for (j=0; j < model_file['iii'+atr+'iii'].iiiuuu_enumdesiii.length; j++)
					model_file['iii'+atr+'iii'].iiiuuu_enumdesiii[j].trimLeft().trimRight()
			}
		}
	}
	var file = JSON.stringify(model_file, null, 4)
		
	file = file.replace(/\"iii/g, '')  //Remove starting " on attribute name
	file = file.replace(/iii\"/g, '')  //Remove ending " on attribute name
	file = file.replace(/uuu_/g, '//') // Add comments //
	file = file.replace(/\"attributes\"/, 'attributes')
		
	var start = file.indexOf('[')
	var end = file.indexOf(']')
	while (start > 0)
	{
		file = file.substring(0, start-1) + file.substring(start, end).replace(/\n|\t| /g,'') + file.substring(end, file.length)
		start = file.indexOf('[', start+1)
		end = file.indexOf(']', end + 1)
	}
	
	// Get Functions - User Points
	file = file.substring(6, file.length-2)
	
	var model_template = compiled_Model({ 'model': model, 'attributes': file, 'options': '//_options' , 'functions': '//functions()'})
	
	fs.writeFileSync(fileName, model_template)
	
	// CONTROLLER
	
	var CONTROLLER_TEMPLATE = fs.readFileSync('./templates/crud5/controller.template', 'utf8');
	var compiled_Controller = _.template(CONTROLLER_TEMPLATE)
	
	var controller_template = compiled_Controller({ 'model': model })
	
	var fileName = './apps/'+app+'/api/controllers/'+model+'Controller.js'
	
	//if (!fs.existsSync(fileName))
	fs.writeFileSync(fileName, controller_template)	
	
	return 'Model '+model+' Was Created'
}

//function generate_function()
exports.generate_function = function(app, model, attributes, options, app_path)
{
	var fs = require('fs')
	var _ = require('lodash')
	
	var crud5 = require('./templates/crud5/crud5')
	
	crud5.generate(app, model, attributes, options, app_path)
}