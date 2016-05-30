/**
 * ConfigController
 *
 * @description :: Server-side logic for managing Configs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	list : function (req, res) {
		res.locals.resources = req.session.resources
		res.locals.user = {id: req.session.userid, user: req.session.user, name: req.session.username, email: req.session.email, language: req.session.languagePreference}
		res.locals.data = []
		res.view("Config/list")
	},
	export : function(req, res) {
		Config.find()
		 .exec(function(err, configs) {
			if (configs.length > 0)
			{
				var config_data = JSON.stringify(configs)
				var fs = require('fs')
				fs.writeFile('./db/Config.txt', config_data, 'utf8', function(err){
					if (err) {
						console.log('Error Exporting Config: ', err)
						res.write('Error Exporting Config: ', err,'\n')
					}
					else
					{
					  console.log('Exported '+configs.length+' Records to file db/Config.txt')
					  res.write('Exported '+configs.length+' Records to file db/Config.txt\n')
					}
				})
			}
		})
	},
	import: function(req, res) {
		Config.destroy({ id: { '>=': 0 }})
		 .exec(function(err){
			if (err) console.log('Error deleting Configs: ',err)
			var fs = require('fs')
			fs.readFile('./db/Config.txt', function(err, data) {
				if (err)
				{
					console.log('Error Reading Configs: ', err)
					res.write('Error Reading Configs: ', err,'\n')
				}
				else
				{
					var data_obj = JSON.parse(data)
					for (var i=0; i < data_obj.length; i++) {
						Config.create(data_obj[i])
						.exec(function(err, created) {
							if (err) 
								console.log('Error Creating Config: ', err)
						 //else
						//	console.log('Created User: ', created)
						})
					}
					console.log('Imported '+data_obj.length+' Records to table Config')
					res.write('Imported '+data_obj.length+' Records to table Config\n')
				}
			})
		 })
	}
};

