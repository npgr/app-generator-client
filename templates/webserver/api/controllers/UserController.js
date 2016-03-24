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
						ProfileResource.find({profile: req.session.profile.id})
						 .populate('resource')
						 .sort('order')
						 .exec(function(err, data2){
							/*_.remove(data2, function (e) {
								return e.resource.type != 'page'
							})*/
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
							delete n.resource.path
							delete n.resource.name
						  })
						  req.session.resources = data2
						  res.redirect(firstpage);
						  //res.redirect('Task/list');
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
 	}
};

