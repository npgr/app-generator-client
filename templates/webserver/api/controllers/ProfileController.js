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
				res.locals.user = {user: req.session.user, name: req.session.username}
	//			res.locals.data = JSON.stringify(data)
				res.locals.data = []
				res.view("Profile/list")
	//		})
	}
};

