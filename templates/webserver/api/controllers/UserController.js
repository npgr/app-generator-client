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
	create: function(req, res, next) {
		var record = req.params.all();
		record.salt = require('crypto').randomBytes(12)
		
		var Hashes = require('jshashes')
		var SHA512 = new Hashes.SHA512
		//record.pwd = require('crypto').createHash('sha256').update(this.$.pwd.value).digest('base64')
		record.pwd = SHA512.b64_hmac(record.salt+record.pwd, sails.config.appConfig.HMAC_KEY2)
		
		User.create(record, function (err, created){
			if (err) return next(err);
			return res.json(created);
		})
	},
	update: function(req, res, next) {
		var record = req.params.all();
		if (record.pwd != '')
		{
			record.salt = require('crypto').randomBytes(12)
			var Hashes = require('jshashes')
			var SHA512 = new Hashes.SHA512
			record.pwd = SHA512.b64_hmac(record.salt+record.pwd, sails.config.appConfig.HMAC_KEY2)
		}
		User.update({id: record.id},record)
			.exec(function (err, updated){
			if (err) 
				return next(err);
			return res.json(updated);
		})
	},
	login: function(req, res) {
		/** Load App Config **/
		if (typeof sails.config.appConfig.loaded == 'undefined')
		{
			sails.config.appConfig.loaded = true
			Config.find()
				.exec(function (err, data) {
					for (i=0; i < data.length; i++)
						sails.config.appConfig[data[i].item] = data[i].value
			})
			//var key = 'PWD_MIN_LEN'
			//sails.config.appConfig[key] = 65
		}

		if (process.env.BROWSER != 'true')
		{
		  if (!req.headers.client_appl)
			return res.forbidden('Unathorized Access') //res.view('403')
		  if (req.headers.client_appl != 'Generator')
			return res.forbidden('Unathorized Access') //res.view('403')
		}

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
		//req.session.user = null
		//res.redirect("/login")
		req.session = null
		res.redirect("/pages/byebye.html")
	},
	validateLogin: function(req, res) {
		User.findOneByUsr(req.body.username)
			.populate('profile')
			.exec(function(err, data) {
				if(err) res.json({ "error": err})
				  else if (data) {
				  
					var client_pwd = req.body.password
					var Hashes = require('jshashes')
					var SHA512 = new Hashes.SHA512
		
					var pwd = SHA512.b64_hmac(data.salt+client_pwd, sails.config.appConfig.HMAC_KEY2)
					//var pwd = client_pwd
					
					if (data.pwd == pwd)
					{
						/** Update New PWD - Salt in DB -- Seems not necesary **/
						//var salt_new = require('crypto').randomBytes(12)
						//var pwd_new = SHA512.b64_hmac(salt_new+pwd_new, sails.config.appConfig.HMAC_KEY2)
						//User.Update({id: data.id}, {salt: salt_new, pwd: pwd_new})
						
						req.session.userid = data.id
						req.session.user = req.body.username
						req.session.username = data.name
						req.session.profile = data.profile
						req.session.email = data.email
						req.session.languagePreference = data.language 
						
						/*Resource.find({id: data.profile.firstpage})
						  .exec(function(err, data2) {
							var firstpage = 'App/list'
							if (data2[0])
								firstpage = data2[0].path
								res.redirect(firstpage);
						  })*/
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
						//res.redirect('login')
						req.headers.client_appl = 'Generator'
						sails.controllers.user.login(req, res)
					}	
				  }
					else 
				  {
					req.session.flash = { err: req.__('Username or Password incorrect')}
					//res.redirect('login')
					req.headers.client_appl = 'Generator'
					sails.controllers.user.login(req, res)
				  }	
			})
	},
	list : function (req, res) {
		res.locals.resources = req.session.resources
		res.locals.user = {id: req.session.userid, user: req.session.user, name: req.session.username, 
		 email: req.session.email, language: req.session.languagePreference}
		res.locals.data = []
		res.view("User/list")
 	},
	UpdProfile: function (req, res) {
		User.findOneById(Number(req.param('id')))
			.exec(function(err, data){
				var Hashes = require('jshashes')
				var SHA512 = new Hashes.SHA512

				var pwd = SHA512.b64_hmac(data.salt+req.param('pwd_old'), sails.config.appConfig.HMAC_KEY2)

				if (data.pwd != pwd)
				{
					var msg = { auth_msg: req.__("Current Password Incorrect"), err: true}
					return res.json(msg)
					//console.log('Error on password, ',req.param('pwd_old'), data.pwd)
					//return
				}
				var updated_data = { email: req.param('email'), language: req.param('language')}
				if (req.param('pwd_1') != '')
				{
					updated_data.salt = require('crypto').randomBytes(12)
					updated_data.pwd = SHA512.b64_hmac(updated_data.salt+req.param('pwd_1'), sails.config.appConfig.HMAC_KEY2)
					//updated_data.pwd =  req.param('pwd_1')
				}
				User.update({id: req.param('id')}, updated_data)
				  .exec(function(err, updated) {
					if (err) console.log('Error: ', err)
					  else
					 {
						req.session.email = req.param('email')
						req.session.languagePreference = req.param('language')
						var msg = { auth_msg: req.__("Profile Changed, Close Session to Apply Changes")}
						return res.json(msg)
					 }
				}) 	
			})
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

