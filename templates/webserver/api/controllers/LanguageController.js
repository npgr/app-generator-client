/**
 * LanguageController
 *
 * @description :: Server-side logic for managing languages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	export : function(req, res) {
		Language.find()
		 .exec(function(err, languages) {
			if (languages.length > 0)
			{
				var Languages_data = JSON.stringify(languages)
				var fs = require('fs')
				fs.writeFile('./db/Languages.txt', Languages_data, 'utf8', function(err){
					if (err) {
						console.log('Error Exporting Languages: ', err)
						res.write('Error Exporting Languages: ', err,'\n')
					}
					else
					{
					  console.log('Exported '+languages.length+' Languages to file db/Languages.txt')
					  res.write('Exported '+languages.length+' Languages to file db/Languages.txt\n')
					}
				})
			}
		})
	},
	import: function(req, res) {
		Language.destroy({ id: { '>=': 0 }})
		 .exec(function(err){
			if (err) console.log('Error deleting Languages: ',err)
			var fs = require('fs')
			fs.readFile('./db/Languages.txt', function(err, data) {
				if (err)
				{
					console.log('Error Reading Languages: ', err)
					res.write('Error Reading Languages: ', err,'\n')
				}
				else
				{
					var data_obj = JSON.parse(data)
					for (var i=0; i < data_obj.length; i++) {
						Language.create(data_obj[i])
						.exec(function(err, created) {
							if (err) 
								console.log('Error Creating Language: ', err)
						 //else
						//	console.log('Created Language: ', created)
						})
					}
					console.log('Imported '+data_obj.length+' Languages to table Language')
					res.write('Imported '+data_obj.length+' Languages to table Language\n')
				}
			})
		 })
	}
};

