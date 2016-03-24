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
				res.locals.user = {user: req.session.user, name: req.session.username}
	//			res.locals.data = JSON.stringify(data)
				res.locals.data = []
				res.view("Resource/list")
	//		})
	}
};

