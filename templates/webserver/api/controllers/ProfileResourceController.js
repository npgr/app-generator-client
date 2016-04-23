/**
 * ProfileResourceController
 *
 * @description :: Server-side logic for managing profileresources
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	/*select: function (req, res) {
		res.view("ProfileResource/select")
	},*/
	list : function (req, res) {
	//	ProfileResource.find()
	//		.exec(function(err, data){
			res.locals.resources = req.session.resources
			res.locals.user = {id: req.session.userid, user: req.session.user, name: req.session.username, 
		 email: req.session.email, language: req.session.languagePreference}
	//		res.locals.data = JSON.stringify(data)
			res.locals.data = []
			res.view("ProfileResource/list")
	//		})
	},
	getDataResources : function (req, res) {
		var profile = req.param('profile')
		
		ProfileResource.find({profile: profile})
		  .populate('resource')
		  .exec(function (err, resources) {
			var filtered_resources = []
			for (i=0; i < resources.length; i++)
				if (resources[i].resource.type == 'data')
					filtered_resources.push(resources[i].resource)
			return res.json(filtered_resources)
		  })
	},
	export : function(req, res) {
		ProfileResource.find()
		 .exec(function(err, profileResources) {
			if (profileResources.length > 0)
			{
				var ProfileResources_data = JSON.stringify(profileResources)
				var fs = require('fs')
				fs.writeFile('./db/ProfileResources.txt', ProfileResources_data, 'utf8', function(err){
					if (err) {
						console.log('Error Exporting ProfileResources: ', err)
						res.write('Error Exporting ProfileResources: ', err,'\n')
					}
					else
					{
					  console.log('Exported '+profileResources.length+' ProfileResources to file db/ProfileResources.txt')
					  res.write('Exported '+profileResources.length+' ProfileResources to file db/ProfileResources.txt\n')
					}
				})
			}
		})
	},
	import: function(req, res) {
		ProfileResource.destroy({ id: { '>=': 0 }})
		 .exec(function(err){
			if (err) console.log('Error deleting ProfileResources: ',err)
			var fs = require('fs')
			fs.readFile('./db/ProfileResources.txt', function(err, data) {
				if (err)
				{
					console.log('Error Reading ProfileResources: ', err)
					res.write('Error Reading ProfileResources: ', err,'\n')
				}
				else
				{
					var data_obj = JSON.parse(data)
					for (var i=0; i < data_obj.length; i++) {
						ProfileResource.create(data_obj[i])
						.exec(function(err, created) {
							if (err) 
								console.log('Error Creating ProfileResource: ', err)
						 //else
						//	console.log('Created ProfileResource: ', created)
						})
					}
					console.log('Imported '+data_obj.length+' ProfileResources to table ProfileResource')
					res.write('Imported '+data_obj.length+' ProfileResources to table ProfileResource\n')
				}
			})
		 })
	}
};

