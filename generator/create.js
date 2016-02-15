if (process.argv.length < 3)
{
	command_help()
	process.exit()
}

var file_path = process.argv[2]

//*** Validate license, crypt file

switch (process.argv[1])
{
	case 'model':
		
		console.log('Generate Model')
		var data = read_file(file_path)
		
		try { 
			var data_parsed = JSON.parse(data) 
		}
		catch(err) { 
			console.log('Error Parsing Data')
			process.exit()
		}
		var generate = require('./generate.js')
		var msg = generate.generate_model(data_parsed.app, data_parsed.model, data_parsed.attributes, data_parsed.app_path)
		console.log('msg: ', msg)
	break;
	case 'mfunction':
		console.log('Generate Model Function')
		console.log('data: ', read_file(file_path))
	break;
	default:
		command_help()
}	

function command_help() {
	console.log('Usage: Generate [ model | mfunction ] <data_file>')
}

function read_file(file_path) {
	var fs = require('fs')
	
	if (!fs.existsSync(file_path))
		return 'file does not exist'
		
	return fs.readFileSync(file_path, 'utf8')
}

//fs.writeFileSync('prueba.txt', 'datos', 'utf8')