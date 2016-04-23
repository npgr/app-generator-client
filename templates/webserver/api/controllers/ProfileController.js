/**
 * ProfileController
 *
 * @description :: Server-side logic for managing profiles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	select: function (req, res) {
		res.render("Profile/select")
	},
	list : function (req, res) {
	//	Profile.find()
	//		.exec(function(err, data){
			res.locals.resources = req.session.resources
			res.locals.user = {id: req.session.userid, user: req.session.user, name: req.session.username, 
		 email: req.session.email, language: req.session.languagePreference}
	//		res.locals.data = JSON.stringify(data)
			res.locals.data = []
			res.view("Profile/list")
	//		})
	},
	export : function(req, res) {
		Profile.find()
		 .exec(function(err, profiles) {
			if (profiles.length > 0)
			{
				var profiles_data = JSON.stringify(profiles)
				var fs = require('fs')
				fs.writeFile('./db/Profiles.txt', profiles_data, 'utf8', function(err){
					if (err) {
						console.log('Error Exporting Profiles: ', err)
						res.write('Error Exporting Profiles: ', err, '\n')
					}
					else
					{
					  console.log('Exported '+profiles.length+' Profiles to file db/Profiles.txt')
					  res.write('Exported '+profiles.length+' Profiles to file db/Profiles.txt\n')
					}
				})
			}
		})
	},
	import: function(req, res) {
		Profile.destroy({ id: { '>=': 0 }})
		 .exec(function(err){
			if (err) console.log('Error deleting Profiles: ',err)
			var fs = require('fs')
			fs.readFile('./db/Profiles.txt', function(err, data) {
				if (err)
				{
					console.log('Error Reading Profiles: ', err)
					res.write('Error Reading Profiles: ', err,'\n')
				}
				else
				{
					var data_obj = JSON.parse(data)
					for (var i=0; i < data_obj.length; i++) {
						Profile.create(data_obj[i])
						.exec(function(err, created) {
							if (err) 
								console.log('Error Creating Profile: ', err)
						 //else
						//	console.log('Created Profile: ', created)
						})
					}
					console.log('Imported '+data_obj.length+' Profiles to table Profile')
					res.write('Imported '+data_obj.length+' Profiles to table Profile\n')
				}
			})
		 })
	}
};

