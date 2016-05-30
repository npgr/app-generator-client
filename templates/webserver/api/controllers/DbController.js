/**
 * DBController
 *
 * @description :: Server-side logic for managing languages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	export : function (req, res) {
		//console.log('Executing export data...')
		sails.controllers.account.export(req, res)
		sails.controllers.config.export(req, res)
		sails.controllers.profile.export(req, res)
		sails.controllers.profileresource.export(req, res)
		sails.controllers.resource.export(req, res)
		sails.controllers.user.export(req, res)
		setTimeout(function(){ res.end('') }, 7000);
	},
	import: function (req, res) {
		//console.log('Executing import data...')
		sails.controllers.account.import(req, res)
		sails.controllers.config.import(req, res)
		sails.controllers.profile.import(req, res)
		sails.controllers.resource.import(req, res)
		sails.controllers.profileresource.import(req, res)
		sails.controllers.user.import(req, res)
		setTimeout(function(){ res.end('') }, 7000);
	}
};