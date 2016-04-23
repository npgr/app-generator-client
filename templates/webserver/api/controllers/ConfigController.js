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
	}
	
};

