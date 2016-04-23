/**
 * ResourceController
 *
 * @description :: Server-side logic for managing resources
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	select: function (req, res) {
		res.render("Resource/select")
	},
	list : function (req, res) {
	//	Resource.find()
	//		.exec(function(err, data){
			res.locals.resources = req.session.resources
			res.locals.user = {id: req.session.userid, user: req.session.user, name: req.session.username, 
		 email: req.session.email, language: req.session.languagePreference}
	//		res.locals.data = JSON.stringify(data)
			res.locals.data = []
			res.view("Resource/list")
	//		})
	},
	export : function(req, res) {
		Resource.find()
		 .exec(function(err, resources) {
			if (resources.length > 0)
			{
				var resources_data = JSON.stringify(resources)
				var fs = require('fs')
				fs.writeFile('./db/Resources.txt', resources_data, 'utf8', function(err){
					if (err) {
						console.log('Error Exporting Resources: ', err)
						res.write('Error Exporting Resources: ', err,'\n')
					}
					else
					{
					  console.log('Exported '+resources.length+' Resources to file db/Resources.txt')
					  res.write('Exported '+resources.length+' Resources to file db/Resources.txt\n')
					}
				})
			}
		})
	},
	import: function(req, res) {
		Resource.destroy({ id: { '>=': 0 }})
		 .exec(function(err){
			if (err) console.log('Error deleting Resources: ',err)
			var fs = require('fs')
			fs.readFile('./db/Resources.txt', function(err, data) {
				if (err)
				{
					console.log('Error Reading Resources: ', err)
					res.write('Error Reading Resources: ', err,'\n')
				}
				else
				{
					var data_obj = JSON.parse(data)
					for (var i=0; i < data_obj.length; i++) {
						Resource.create(data_obj[i])
						.exec(function(err, created) {
							if (err) 
								console.log('Error Creating Resource: ', err)
						 //else
						//	console.log('Created Resource: ', created)
						})
					}
					console.log('Imported '+data_obj.length+' Resources to table Resource')
					res.write('Imported '+data_obj.length+' Resources to table Resource\n')
				}
			})
		 })
	}
};

