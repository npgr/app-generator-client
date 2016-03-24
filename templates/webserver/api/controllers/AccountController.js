/**
 * AccountController
 *
 * @description :: Server-side logic for managing Accounts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	list : function (req, res) {
		res.locals.resources = req.session.resources
 		res.locals.user = {user: req.session.user, name: req.session.username}
 		res.locals.data = []
		res.view("Account/list")
 	},
	export : function(req, res) {
		Account.find()
		 .exec(function(err, accounts) {
			if (accounts.length > 0)
			{
				var Accounts_data = JSON.stringify(accounts)
				var fs = require('fs')
				fs.writeFile('./db/Accounts.txt', Accounts_data, 'utf8', function(err){
					if (err) {
						console.log('Error Exporting Accounts: ', err)
						res.write('Error Exporting Accounts: ', err, '\n')
						
					}
					else
					{
					  console.log('Exported '+accounts.length+' Accounts to file db/Accounts.txt\n')
					  res.write('Exported '+accounts.length+' Accounts to file db/Accounts.txt\n')
					}
				})
			}
		})
	},
	import: function(req, res) {
		Account.destroy({ id: { '>=': 0 }})
		 .exec(function(err){
			if (err) console.log('Error deleting Accounts: ',err)
			var fs = require('fs')
			fs.readFile('./db/Accounts.txt', function(err, data) {
				if (err)
				{
					console.log('Error Reading Accounts: ', err)
					res.write('Error Reading Accounts: ', err)
				}
				else
				{
					var data_obj = JSON.parse(data)
					for (var i=0; i < data_obj.length; i++) {
						Account.create(data_obj[i])
						.exec(function(err, created) {
							if (err) 
								console.log('Error Creating Account: ', err)
						 //else
						//	console.log('Created Account: ', created)
						})
					}
					console.log('Imported '+data_obj.length+' Accounts to table Account')
					res.write('Imported '+data_obj.length+' Accounts to table Account')
				}
			})
		 })
	}
};

