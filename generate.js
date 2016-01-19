console.log(generate_model('newApp03', 'Product', 'xx'))

function generate_model2(app, model, attributes)
{
	return 'YessoooSS, App: '+app+'. Generated Model '+model+' with '+attributes.length+' Attibutes'
	//return 'Dir: '+ __dirname + 'Apps\\' + app
}

//exports.generate_model = function(app, model, attributes)
function generate_model(app, model, attributes)
{
	//return generate_model2(app, model, attributes)
	//return 'Yesso, App: '+app+'. Generated Model '+model+' with '+attributes.length+' Attibutes'
	var fs = require('fs')
	var fileName = './apps/'+app+'/api/model/'+model+'.js'
	if (!fs.existsSync(fileName))
	{
		var exec = require('child_process').exec
						
		run = exec('sails generate api '+model, {'cwd': __dirname+'Apps\\'+app},
				function(error, stdout, stderr) {
					if (error !== null)
						return 'Error Creating Model:' //+ error;
					generate_model2(app, model, attributes)
				})
	}
	else 
		generate_model2(app, model, attributes)	
}


