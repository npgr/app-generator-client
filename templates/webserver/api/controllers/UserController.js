/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	select: function (req, res) {
		res.view("User/select")
	},
	login: function(req, res) {
		if (req.session.flash) 
		{ 
			res.locals.flash = _.clone(req.session.flash)
			//res.locals.flash = _.clone(req.session.flash)
			req.session.flash = {}
		}
		  else  res.locals.flash = {}
		res.render("User/login")
	},
	signout: function(req, res) {
		req.session.user = null
		res.redirect("/login")
	},
	validateLogin: function(req, res) {
		User.findOneByUsr(req.body.username)
			.populate('profile')
			.exec(function(err, data) {
				if(err) res.json({ "error": err})
				  else if (data) {
					if (data.pwd== req.body.password)
					{
						req.session.userid = data.id
						req.session.user = req.body.username
						req.session.username = data.name
						req.session.profile = data.profile
						req.session.languagePreference = data.language 
						
						ProfileResource.find({profile: req.session.profile.id})
						 .populate('resource')
						 .sort('order')
						 .exec(function(err, data2){
						  var firstpage = 'App/list'
						  _.forEach(data2, function(n, key) {
							if (n.resource.id == data.profile.firstpage)
								firstpage = n.resource.path							
							delete n.profile
							delete n.id
							delete n.createdAt
							delete n.updatedAt
							delete n.resource.id
							delete n.resource.createdAt
							delete n.resource.updatedAt
							n.path = n.resource.path
							n.name = n.resource.name.replace(/ /g, "_");
							n.method = n.resource.method
							delete n.resource.path
							delete n.resource.name
						  })
						  req.session.resources = data2
						  res.redirect(firstpage);
						})
					}
					else
					{
						req.session.flash = { err: req.__('Username or Password incorrect')}
						res.redirect('login')
					}	
				  }
					else 
				  {
					req.session.flash = { err: req.__('Username or Password incorrect')}
					res.redirect('login')
				  }	
			})
	},
	list : function (req, res) {
		//User.find()
 			//.exec(function(err, data){
				res.locals.resources = req.session.resources
 				res.locals.user = {user: req.session.user, name: req.session.username}
 				res.locals.data = []
				res.view("User/list")
 			//})
 	},
	export : function(req, res) {
		User.find()
		 .exec(function(err, users) {
			if (users.length > 0)
			{
				var users_data = JSON.stringify(users)
				var fs = require('fs')
				fs.writeFile('./db/User.txt', users_data, 'utf8', function(err){
					if (err) {
						console.log('Error Exporting Users: ', err)
						res.write('Error Exporting Users: ', err,'\n')
					}
					else
					{
					  console.log('Exported '+users.length+' Users to file db/Users.txt')
					  res.write('Exported '+users.length+' Users to file db/Users.txt\n')
					}
				})
			}
		})
	},
	import: function(req, res) {
		User.destroy({ id: { '>=': 0 }})
		 .exec(function(err){
			if (err) console.log('Error deleting Users: ',err)
			var fs = require('fs')
			fs.readFile('./db/User.txt', function(err, data) {
				if (err)
				{
					console.log('Error Reading Users: ', err)
					res.write('Error Reading Users: ', err,'\n')
				}
				else
				{
					var data_obj = JSON.parse(data)
					for (var i=0; i < data_obj.length; i++) {
						User.create(data_obj[i])
						.exec(function(err, created) {
							if (err) 
								console.log('Error Creating User: ', err)
						 //else
						//	console.log('Created User: ', created)
						})
					}
					console.log('Imported '+data_obj.length+' Users to table Users')
					res.write('Imported '+data_obj.length+' Users to table Users\n')
				}
			})
		 })
	}
};

