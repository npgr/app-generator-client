level = require('level')

sublevel = require('sublevel')

db = sublevel(level('./db', {valueEncoding: 'json'}))

//userdb = db.sublevel('user')
modeldb = db.sublevel('model')

//userdb.put('ngoncalves', {name: 'Nuno', pwd: 'xx'})
//userdb.put('admin', {name: 'Admin', pwd: 'yy'})

//modeldb.put('task', { name: 'Tasks'})
//modeldb.put('expense', { name: 'Expenses'})

//users = []
//userStream  = userdb.createReadStream()

modelStream  = modeldb.createReadStream()



/*userStream.on('data', function(user) {
	console.log(user)
})*/

modelStream.on('data', function(model) {
	console.log(model)
})