/**
 * authorized
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  
  //log visits
  //console.log('req.route.path: ', req.route.path)
  
	//Bypass Security
	//if (req.route.path == '/Order/SalesCube') return next()
	
	if (!req.session.user && req.route.path != '/login' && req.route.path != '/validateLogin')
		return res.redirect('/login')
	
	if (req.route.path != '/login' && req.route.path != '/validateLogin' && req.route.path != '/signout')
	{
		var resource_name = _.result(_.find(req.session.resources, { 'path': req.route.path }), 'name')
	
		if (resource_name)
			//console.log(req.method+' '+req.route.path+' Authorized')
			console.log(req.method+' '+req.originalUrl+' Authorized')
		else
			console.log(req.method+' '+req.originalUrl+' Not Authorized for user '+req.session.user)
	}
	return next()

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
};
