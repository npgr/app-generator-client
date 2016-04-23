/**
 * DBController
 *
 * @description :: Server-side logic for managing languages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	export : function (req, res) {
				
		sails.controllers.account.export(req, res)
		sails.controllers.app.export(req, res)
		sails.controllers.attribute.export(req, res)
		//sails.controllers.functionattribute.export(req, res)
		sails.controllers.functionlist.export(req, res)
		sails.controllers.language.export(req, res)
		sails.controllers.model.export(req, res)
		sails.controllers.modelfunction.export(req, res)
		sails.controllers.profile.export(req, res)
		sails.controllers.profileresource.export(req, res)
		sails.controllers.resource.export(req, res)
		sails.controllers.user.export(req, res)
		sails.controllers.userresource.export(req, res)
		setTimeout(function(){ res.end('') }, 7000);
	},
	import: function (req, res) {
		//console.log('Executing import data...')
		/** Security **/
		sails.controllers.account.import(req, res)
		sails.controllers.profile.import(req, res)
		sails.controllers.resource.import(req, res)
		sails.controllers.profileresource.import(req, res)
		sails.controllers.user.import(req, res)
		sails.controllers.userresource.import(req, res)
		/** Apps **/
		sails.controllers.app.import(req, res)
		sails.controllers.model.import(req, res)
		sails.controllers.attribute.import(req, res)
		sails.controllers.modelfunction.import(req, res)
		sails.controllers.functionlist.import(req, res)
		sails.controllers.language.import(req, res)
		//sails.controllers.functionattribute.import(req, res)
		setTimeout(function(){ res.end('') }, 7000);
	}
};