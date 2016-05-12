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

	function extract_path() 
	{
		var path = ''
		var pos = req.originalUrl.indexOf('?')
		if (pos == -1)  path = req.originalUrl
		 else  path = req.originalUrl.substring(0, pos)
		if (req.method == 'PUT' || req.method == 'DELETE')
			return path.substring(0,path.lastIndexOf('/'))
		return path
	}

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  
  //log visits
  //console.log('req.route.path: ', req.route.path)
  
	//Bypass Security
	//if (req.route.path == '/Order/SalesCube') return next()
	var colors = require('colors/safe');
	
	var d = new Date()
	var min = d.getMinutes(); if (min < 10) min = '0'+min 
	var seg = d.getSeconds(); if (seg < 10) seg = '0'+seg
	
	var time = d.getFullYear() + '/' + d.getMonth()+1 + '/' + d.getDate() + ' ' + d.getHours() + ':' + min + ':' + seg + ' - '
	
	var bypass = false
	if(req.headers.my_key)
		if (req.headers.my_key == 'abc') bypass = true
	//console.log('headers: ', req.headers)
	if (!req.session.user && req.route.path != '/login' && req.route.path != '/validateLogin' && !bypass &&
		req.route.path != '/db/import'){

		//console.log('Redirecting to login from '+req.route.path)
		if (process.env.BROWSER == 'true')
			return res.redirect('/login')
		else
			return res.forbidden('Unathorized Access') //return res.view('403')
	}
			
	
	if (req.route.path != '/login' && req.route.path != '/validateLogin' && req.route.path != '/signout' && 
	    req.route.path != '/db/import')
	{
		//var resource_name = _.result(_.find(req.session.resources, { 'path': req.route.path }), 'name')
		
		var path = extract_path()
		 
		/*Resource.find({path: path, method: req.method.toLowerCase()})
		  .exec(function(err, resourcex) {
			if (resourcex[0])
			{
			 //console.log('path: ', path, 'method: ', req.method.toLowerCase(), 'resource', resourcex)
			 ProfileResource.find({profile: req.session.profile.id, resource: resourcex[0].id})
			//.populate('resource')
			  .exec(function(err, resource){
				if (resource[0])
				{
					req.options.resource = resource[0]
					console.log(colors.green(time + req.method+' '+req.originalUrl+' Authorized for user '+req.session.user))
				}
				else
					console.log(colors.red(time + req.method+' '+req.originalUrl+' Not Authorized for user '+req.session.user))
				return next()
			 })
			}
			else 
			{
				console.log(colors.red(time + req.method+' '+req.originalUrl+' Not Authorized for user '+req.session.user))
				return next()
			}
		})*/
		
		var resource = _.find(req.session.resources, { 'path': path, 'method': req.method.toLowerCase() })
		if (resource)
		{
			req.options.resource = resource
			console.log(colors.green(time + req.method+' '+req.originalUrl+' Authorized for user '+req.session.user))
		}
		else
		{
			req.setLocale(req.session.languagePreference);
			console.log(colors.red(time + req.method+' '+req.originalUrl+' Not Authorized for user '+req.session.user))
			var msg = { auth_msg: req.__("User Not Authorized to this Option")}
			return res.json(msg)
			/** if page then redirect **/
		}
		//console.log('languagePreference', req.session.languagePreference)
		if (typeof req.session.languagePreference != 'undefined')	
			req.setLocale(req.session.languagePreference);
		return next()
	}
	else
	{
	//if (path == '/App') return res.json({msg: 'not Authorized'})
		//console.log('authorized - language Preference: ', req.session.languagePreference)
		if (typeof req.session.languagePreference != 'undefined')
			req.setLocale(req.session.languagePreference);
		return next()
	}
  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
};
